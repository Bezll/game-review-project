const { fetchApiOptions } = require("../models/api-options");

exports.getApiOptions = (req, res, next) => {
	fetchApiOptions()
		.then((options) => {
			res.status(200).send({ options });
		})
		.catch((err) => {
			next(err);
		});
};
