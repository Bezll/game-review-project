const db = require("../db/connection.js");

exports.fetchCategories = async () => {
	try {
		return await db.query(`SELECT * FROM categories;`).then(({ rows }) => {
			return rows;
		});
	} catch (error) {
		return Promise.reject(error);
	}
};
