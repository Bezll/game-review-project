const db = require("../db/connection.js");

exports.fetchUsers = async (username) => {
	let queryString = "SELECT username FROM users";

	const queryParams = [];

	if (username) {
		queryString = "SELECT * FROM users WHERE username = $1;";
		queryParams.push(username);
	}

	try {
		return await db.query(queryString, queryParams).then(({ rows }) => {
			if (username) {
				console.log("rows");
				return rows[0];
			} else if (!username) {
				console.log("rows[0]");
				return rows;
			} else {
				return Promise.reject({ status: 404, msg: "Not found" });
			}
		});
	} catch (err) {
		return Promise.reject(err);
	}
};
