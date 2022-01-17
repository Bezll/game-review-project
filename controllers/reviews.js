const { fetchMappedReviewsById } = require("../models/reviews");

exports.getReviewById = (req, res, next) => {
	const { review_id } = req.params;
	fetchMappedReviewsById(review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => {
			next(err);
		});
};
