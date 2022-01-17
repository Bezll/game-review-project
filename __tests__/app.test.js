const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
});

describe("/api/reviews/:review_id", () => {
	describe("GET", () => {
		test("Returns a review by specified id", () => {
			return request(app)
				.get("/api/reviews/1")
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
							votes: 1,
							comment_count: 0,
						})
					);
				});
		});
	});
});
