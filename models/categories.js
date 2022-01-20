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

exports.insertCategory = async (newCategory) => {
	const { slug, description } = newCategory;
	try {
		return await db
			.query(
				`INSERT INTO categories (slug, description) VALUES ($1, $2) RETURNING *;`,
				[slug, description]
			)
			.then(({ rows }) => {
				return rows[0];
			});
	} catch (err) {
		return Promise.reject(err);
	}
};
