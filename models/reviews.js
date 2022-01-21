const db = require("../db/connection.js");
const { fetchCommentsById, removeComments } = require("./comments");

exports.fetchMappedReviewsById = async (review_id) => {
	try {
		return await db
			.query(
				`SELECT reviews.*,
			COUNT(comment_id) AS comment_count 
			FROM reviews 
			LEFT JOIN comments
			ON reviews.review_id = comments.review_id
			WHERE reviews.review_id = $1
			GROUP BY reviews.review_id;`,
				[review_id]
			)
			.then(({ rows }) => {
				if (rows.length > 0) {
					return rows[0];
				} else {
					return Promise.reject({ status: 404, msg: "Not found" });
				}
			});
	} catch (err) {
		return Promise.reject(err);
	}
};

exports.updateReviewById = async (review_id, inc_votes) => {
	try {
		return await db
			.query(
				`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
				[review_id, inc_votes]
			)
			.then(({ rows }) => {
				if (rows.length > 0) {
					return rows[0];
				} else {
					return Promise.reject({ status: 404, msg: "Not found" });
				}
			});
	} catch (err) {
		return Promise.reject(err);
	}
};

exports.fetchMappedReviews = async (
	sort_by = "created_at",
	order = "DESC",
	category = "%",
	items_per_page = 13,
	page = 1
) => {
	const acceptableSortBys = [
		"review_id",
		"title",
		"designer",
		"owner",
		"category",
		"votes",
		"created_at",
	];
	if (!acceptableSortBys.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	const acceptableOrder = ["ASC", "DESC"];
	if (!acceptableOrder.includes(order.toUpperCase())) {
		return Promise.reject({ status: 400, msg: "Bad request" });
	}

	const sql = `SELECT
	reviews.*,
	COUNT(comment_id) AS comment_count
	FROM reviews
	LEFT JOIN comments
	ON reviews.review_id = comments.review_id
	WHERE category ILIKE '${category}'
	GROUP BY reviews.review_id
	ORDER BY ${sort_by} ${order}
	LIMIT $1
	OFFSET $2
	;`;

	try {
		return await db
			.query(sql, [items_per_page, (page - 1) * items_per_page])
			.then(({ rows }) => {
				if (rows.length > 0) {
					return rows;
				} else {
					return Promise.reject({ status: 404, msg: "Not found" });
				}
			});
	} catch (err) {
		return Promise.reject(err);
	}
};

async function deleteReviewById(review_id) {
	try {
		return await db
			.query(`DELETE FROM reviews WHERE review_id = $1;`, [review_id])
			.then(({ rowCount }) => {
				if (rowCount === 1) {
					return;
				} else {
					return Promise.reject({ status: 404, msg: "Id not found" });
				}
			});
	} catch (err) {
		return Promise.reject(err);
	}
}

exports.removeReviewAndComments = async (review_id) => {
	const args = { review_id };
	try {
		await removeComments(args);
	} catch (err) {
		return Promise.reject({ status: 404, msg: "Id not found" });
	}

	try {
		await deleteReviewById(review_id);
	} catch (err) {
		return Promise.reject({ status: 404, msg: "Id not found" });
	}
};

// exports.fetchMappedReviews = async (
// 	sort_by,
// 	order,
// 	category,
// 	items_per_page,
// 	page
// ) => {
// 	const [reviews, comments] = await Promise.all([
// 		fetchReviews(sort_by, order, category, items_per_page, page),
// 		fetchCommentsById(),
// 	])
// 		.then((result) => {
// 			return result;
// 		})
// 		.catch((err) => Promise.reject(err));

// let reviewCount;
// await fetchReviews(sort_by, order, category).then((res) => {
// 	reviewCount = res.length;
// });

// 	const newReviews = JSON.parse(JSON.stringify(reviews));

// 	for (let i = 0; i < newReviews.length; i++) {
// 		const commentCount = comments.filter(
// 			(comment) => comment.review_id === newReviews[i].review_id
// 		);
// 		newReviews[i].comment_count = commentCount.length;
// 		newReviews[i].total_count = reviewCount;
// 	}

// 	return newReviews;
// };

exports.insertReview = async (newReview) => {
	const { owner, title, review_body, designer, category } = newReview;
	try {
		return await db
			.query(
				`INSERT INTO reviews (owner, title, review_body, designer, category) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
				[owner, title, review_body, designer, category]
			)
			.then(({ rows }) => {
				return rows[0];
			});
	} catch (err) {
		return Promise.reject(err);
	}
};
