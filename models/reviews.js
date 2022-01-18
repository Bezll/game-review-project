const db = require("../db/connection.js");
const { fetchCommentsById } = require("./comments");

async function fetchReviewById(review_id) {
	try {
		return await db
			.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
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
}

exports.fetchMappedReviewsById = async (review_id) => {
	const [reviewById, commentsById] = await Promise.all([
		fetchReviewById(review_id),
		fetchCommentsById(review_id), // Lives in model/comments.js
	])
		.then((result) => {
			return result;
		})
		.catch((err) => Promise.reject(err));

	const mappedReviewById = JSON.parse(JSON.stringify(reviewById));
	mappedReviewById.comment_count = commentsById.length;

	return mappedReviewById;
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
