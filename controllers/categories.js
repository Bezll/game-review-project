const { fetchCategories, insertCategory } = require("../models/categories");

exports.getCategories = (req, res, next) => {
	fetchCategories()
		.then((categories) => {
			res.status(200).send({ categories });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postCategory = (req, res, next) => {
	const newCategory = req.body;
	insertCategory(newCategory)
		.then((category) => {
			res.status(201).send({ category });
		})
		.catch((err) => {
			next(err);
		});
};
