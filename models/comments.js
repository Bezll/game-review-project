const db = require("../db/connection.js");

// exports.fetchCommentsById = async (review_id) => {
// 	let queryString = "SELECT * FROM comments";

// 	const queryParams = [];

// 	if (review_id) {
// 		queryString += " WHERE review_id = $1;";
// 		queryParams.push(review_id);
// 	}

// 	try {
// 		return await db.query(queryString, queryParams).then(({ rows }) => {
// 			if (rows.length > 0) {
// 				return rows;
// 			} else {
// 				return Promise.reject({ status: 404, msg: "Not found" });
// 			}
// 		});
// 	} catch (err) {
// 		return Promise.reject(err);
// 	}
// };

exports.fetchCommentsById = async (
	review_id,
	items_per_page = 10,
	page = 1
) => {
	const queryParams = [items_per_page, (page - 1) * items_per_page];

	let queryString = "SELECT * FROM comments LIMIT $1 OFFSET $2";

	if (review_id) {
		queryString =
			"SELECT * FROM comments WHERE review_id = $3 LIMIT $1 OFFSET $2;";
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

exports.removeComments = async (comment_id) => {
	try {
		return await db
			.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
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
};

exports.updateComments = async (comment_id, inc_votes) => {
	try {
		return await db
			.query(
				`UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
				[comment_id, inc_votes]
			)
			.then(({ rows }) => {
				if (rows.length > 0) {
					return rows[0];
				} else {
					return Promise.reject({ status: 404, msg: "Id not found" });
				}
			});
	} catch (err) {
		return Promise.reject(err);
	}
};
