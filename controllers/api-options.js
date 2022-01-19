const { fetchApiOptions } = require("../models/api-options");
const endpoints = require("../endpoints.json");

exports.getApiOptions = (req, res, next) => {
	res.send({ endpoints });
};
