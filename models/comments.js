const db = require("../db/connection.js");

exports.fetchCommentsById = async (review_id) => {
	let queryString = "SELECT * FROM comments";

	const queryParams = [];

	if (review_id) {
		queryString += " WHERE review_id = $1;";
		queryParams.push(review_id);
	}

	try {
		return await db.query(queryString, queryParams).then(({ rows }) => {
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

exports.insertComments = async (review_id, newComment) => {
	const { author, body } = newComment;
	try {
		return await db
			.query(
				`INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
				[review_id, author, body]
			)
			.then(({ rows }) => {
				return rows[0];
			});
	} catch (err) {
		return Promise.reject(err);
	}
};