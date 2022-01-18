const db = require("../db/connection.js");

exports.fetchCommentsById = async (review_id) => {
	try {
		return await db
			.query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
			.then(({ rows }) => {
				return rows;
			});
	} catch (err) {
		return Promise.reject(err);
	}
};

exports.fetchComments = async () => {
	try {
		return await db.query(`SELECT * FROM comments;`).then(({ rows }) => {
			return rows;
		});
	} catch (err) {
		return Promise.reject(err);
	}
};
