const db = require("../db/connection.js");
const { fetchCommentsById } = require("./comments");

async function fetchReviewById(review_id) {
	try {
		return await db
			.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
			.then(({ rows }) => {
				return rows[0];
			});
	} catch (error) {
		return Promise.reject(error);
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
		.catch((error) => Promise.reject(error));

	const mappedReviewById = JSON.parse(JSON.stringify(reviewById));
	mappedReviewById.comment_count = commentsById.length;

	return mappedReviewById;
};
