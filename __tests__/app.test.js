const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
	describe("GET", () => {
		test("Returns a list of all endpoint options", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(Object.keys(body.endpoints)).toHaveLength(7);
				});
		});
	});
});

describe("/api/categories", () => {
	describe("GET", () => {
		test("Returns a list of all categories", () => {
			return request(app)
				.get("/api/categories")
				.expect(200)
				.then(({ body }) => {
					expect(body.categories).toHaveLength(4);
					body.categories.forEach((category) => {
						expect(category).toEqual(
							expect.objectContaining({
								slug: expect.any(String),
								description: expect.any(String),
							})
						);
					});
				});
		});
	});
	describe("POST", () => {
		test("should return status 201 and the new categories", () => {
			const newCategory = {
				slug: "Test Category",
				description: "This is a test description",
			};
			return request(app)
				.post("/api/categories")
				.send(newCategory)
				.expect(201)
				.then(({ body }) => {
					expect(body.category).toEqual({
						slug: "Test Category",
						description: "This is a test description",
					});
				});
		});
	});
});

describe("/api/reviews/:review_id", () => {
	describe("GET", () => {
		test("Returns a review by specified id", () => {
			return request(app)
				.get("/api/reviews/2")
				.expect(200)
				.then(({ body }) => {
					expect(body.review).toEqual(
						expect.objectContaining({
							review_id: 2,
							title: "Jenga",
							designer: "Leslie Scott",
							owner: "philippaclaire9",
							review_img_url:
								"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
							review_body: "Fiddly fun for all the family",
							category: "dexterity",
							created_at: "2021-01-18T10:01:41.251Z",
							votes: 5,
							comment_count: 3,
						})
					);
				});
		});
		test("Review_id is a valid request but non-existent", () => {
			return request(app)
				.get("/api/reviews/1000000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
	describe("PATCH", () => {
		test("should update the vote count in the specified review", () => {
			return request(app)
				.patch("/api/reviews/1")
				.send({ inc_votes: 1 })
				.expect(200)
				.then(({ body }) => {
					expect(body.review).toEqual(
						expect.objectContaining({
							review_id: 1,
							title: "Agricola",
							designer: "Uwe Rosenberg",
							owner: "mallionaire",
							review_img_url:
								"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
							review_body: "Farmyard fun!",
							category: "euro game",
							created_at: "2021-01-18T10:00:20.514Z",
							votes: 2,
						})
					);
				});
		});
		test("Review_id is a valid request but non-existent", () => {
			return request(app)
				.patch("/api/reviews/1000000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
	describe("DELETE", () => {
		test("should return status:204 and return deleted successfully message", () => {
			return request(app).delete("/api/reviews/2").expect(204);
		});
		test("Should return status:404 when passed invalid review_id", () => {
			return request(app)
				.delete("/api/reviews/1000000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Id not found");
				});
		});
	});
});

describe("/api/reviews", () => {
	describe("GET", () => {
		test("Returns a list of all reviews including a comment_count for each", () => {
			return request(app)
				.get("/api/reviews")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toHaveLength(13);
					body.reviews.forEach((review) => {
						expect(review).toEqual(
							expect.objectContaining({
								review_id: expect.any(Number),
								title: expect.any(String),
								designer: expect.any(String),
								owner: expect.any(String),
								review_img_url: expect.any(String),
								review_body: expect.any(String),
								category: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
								comment_count: expect.any(Number),
							})
						);
					});
				});
		});
		test("should sort the results by the default sort_by (date) order (DESC) when nothing is specified", () => {
			return request(app)
				.get("/api/reviews")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews[0].created_at).toBe(
						"2021-01-25T11:16:54.963Z"
					);
					expect(body.reviews[12].created_at).toBe(
						"1970-01-10T02:08:38.400Z"
					);
				});
		});
		test("should sort the results by the default sort_by (date) but with requested order (ASC)", () => {
			return request(app)
				.get("/api/reviews?order=asc")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews[0].created_at).toBe(
						"1970-01-10T02:08:38.400Z"
					);
					expect(body.reviews[12].created_at).toBe(
						"2021-01-25T11:16:54.963Z"
					);
				});
		});
		test("should respond with a Status 400 when invalid order is requested", () => {
			return request(app)
				.get("/api/reviews?order=ascc")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("should sort the results by number of votes", () => {
			return request(app)
				.get("/api/reviews?sort_by=votes")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews[0].votes).toBe(100);
					expect(body.reviews[12].votes).toBe(1);
				});
		});
		test("should respond with a Status 400 when invalid sort_by is requested", () => {
			return request(app)
				.get("/api/reviews?sort_by=votess")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
		test("should sort the results by title in ASC alphabetical order", () => {
			return request(app)
				.get("/api/reviews?sort_by=title&&order=asc")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews[0].title).toBe(
						"A truly Quacking Game; Quacks of Quedlinburg"
					);
					expect(body.reviews[12].title).toBe("Ultimate Werewolf");
				});
		});
		test("should filter the results by the category dexterity", () => {
			return request(app)
				.get("/api/reviews?category=dexterity")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews).toHaveLength(1);
				});
		});
		test("should respond with a Status 404 when invalid category filter is applied", () => {
			return request(app)
				.get("/api/reviews?category=dext")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		test("should return a limited number of results when specified using items_per_page", () => {
			return request(app)
				.get("/api/reviews?items_per_page=5")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews.length).toBe(5);
				});
		});
		test("Returns a specific page of results when specified along with a custom items_per_page limit, does not effect review total_count", () => {
			return request(app)
				.get("/api/reviews?items_per_page=5&&page=2")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews.length).toBe(5);
					expect(body.reviews[0]).toEqual({
						review_id: 10,
						title: "Build you own tour de Yorkshire",
						designer: "Asger Harding Granerud",
						owner: "mallionaire",
						review_img_url: expect.any(String),
						review_body: expect.any(String),
						category: "social deduction",
						created_at: "2021-01-18T10:01:41.251Z",
						votes: 10,
						comment_count: 0,
						total_count: 13,
					});
				});
		});
		test("should adjust the total_count based on the category filter applied", () => {
			return request(app)
				.get("/api/reviews?category=dexterity")
				.expect(200)
				.then(({ body }) => {
					expect(body.reviews.length).toBe(1);
					expect(body.reviews[0]).toEqual({
						review_id: 2,
						title: "Jenga",
						designer: "Leslie Scott",
						owner: "philippaclaire9",
						review_img_url: expect.any(String),
						review_body: expect.any(String),
						category: "dexterity",
						created_at: "2021-01-18T10:01:41.251Z",
						votes: 5,
						comment_count: 3,
						total_count: 1,
					});
				});
		});
		test("should respond with a Status 404 when items_per_page and page specified return no results", () => {
			return request(app)
				.get("/api/reviews?items_per_page=50&&page=20")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
	describe("POST", () => {
		test("should add a new review with the relevant properties, and return this as the body", () => {
			const newReview = {
				title: "Test",
				designer: "Test Designer",
				owner: "mallionaire",
				review_body: "Test Text Body",
				category: "euro game",
				votes: 0,
			};

			return request(app)
				.post("/api/reviews")
				.send(newReview)
				.expect(201)
				.then(({ body }) => {
					expect(body.review).toEqual(
						expect.objectContaining({
							review_id: 14,
							title: "Test",
							designer: "Test Designer",
							owner: "mallionaire",
							review_img_url:
								"https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
							review_body: "Test Text Body",
							category: "euro game",
							created_at: expect.any(String),
							votes: 0,
						})
					);
				});
		});
		test("should respond with a Status 400 when invalid username is used", () => {
			const invalidUsername = {
				title: "Test",
				designer: "Test Designer",
				owner: "incorrect",
				review_body: "Test Text Body",
				category: "euro game",
				votes: 0,
			};

			return request(app)
				.post("/api/reviews")
				.send(invalidUsername)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
	});
});

describe("/api/reviews/:review_id/comments", () => {
	describe("GET", () => {
		test("Returns all comments with specified review_id, should contain all of the relevant fields ", () => {
			return request(app)
				.get("/api/reviews/2/comments")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments).toHaveLength(3);
					body.comments.forEach((comment) => {
						expect(comment).toEqual(
							expect.objectContaining({
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
							})
						);
					});
				});
		});
		test("Review_id is a valid request but non-existent", () => {
			return request(app)
				.get("/api/reviews/10000/comments")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
		test("should return a limited number of results when specified using items_per_page", () => {
			return request(app)
				.get("/api/reviews/2/comments?items_per_page=2")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments.length).toBe(2);
				});
		});
		test("Returns a specific page of results when specified along with a custom items_per_page limit", () => {
			return request(app)
				.get("/api/reviews/2/comments?items_per_page=2&&page=2")
				.expect(200)
				.then(({ body }) => {
					expect(body.comments.length).toBe(1);
					expect(body.comments[0]).toEqual({
						comment_id: 5,
						review_id: 2,
						votes: 13,
						created_at: "2021-01-18T10:24:05.410Z",
						author: "mallionaire",
						body: "Now this is a story all about how, board games turned my life upside down",
					});
				});
		});
	});
	describe("POST", () => {
		test("should return status 201 and the new comment", () => {
			const newComment = {
				author: "bainesface",
				body: "This board game is good!",
			};
			return request(app)
				.post("/api/reviews/1/comments")
				.send(newComment)
				.expect(201)
				.then(({ body }) => {
					expect(body.comment).toEqual({
						comment_id: expect.any(Number),
						author: "bainesface",
						body: "This board game is good!",
						created_at: expect.any(String),
						review_id: 1,
						votes: 0,
					});
				});
		});
		test("should respond with a Status 400 when invalid author is used", () => {
			const invalidAuthor = {
				author: "Incorrect",
				body: "This board game is good!",
			};

			return request(app)
				.post("/api/reviews/1/comments")
				.send(invalidAuthor)
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad request");
				});
		});
	});
	describe("DELETE", () => {
		test("should return status:204 and return Comment deleted successfully message", () => {
			return request(app).delete("/api/comments/1").expect(204);
		});
		test("Should return status:404 when passed invalid comment_id", () => {
			return request(app)
				.delete("/api/comments/1000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Id not found");
				});
		});
	});
	describe("PATCH", () => {
		test("should increment the votes count by the specified amount", () => {
			return request(app)
				.patch("/api/comments/1")
				.send({ inc_votes: 1 })
				.expect(200)
				.then(({ body }) => {
					expect(body.comment).toEqual(
						expect.objectContaining({
							comment_id: 1,
							body: "I loved this game too!",
							votes: 17,
							author: "bainesface",
							review_id: 2,
							created_at: "2017-11-22T12:43:33.389Z",
						})
					);
				});
		});
		test("Should return status:404 when passed invalid comment_id", () => {
			return request(app)
				.patch("/api/comments/1000")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Id not found");
				});
		});
	});
});

describe("/api/users", () => {
	describe("GET", () => {
		test("should return a list of all usernames", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body }) => {
					expect(body.users).toHaveLength(4);
					body.users.forEach((user) => {
						expect(user).toEqual(
							expect.objectContaining({
								username: expect.any(String),
							})
						);
					});
				});
		});
	});
});

describe("/api/users/:username", () => {
	describe("GET", () => {
		test("should return all user info for specified user_id", () => {
			return request(app)
				.get("/api/users/bainesface")
				.expect(200)
				.then(({ body }) => {
					expect(body.user).toEqual(
						expect.objectContaining({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						})
					);
				});
		});
		test("Should return status:404 when passed invalid username", () => {
			return request(app)
				.get("/api/users/incorrect")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not found");
				});
		});
	});
});
