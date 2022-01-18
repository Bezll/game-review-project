const {
	fetchMappedReviewsById,
	updateReviewById,
} = require("../models/reviews");

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

exports.patchReviewById = (req, res, next) => {
	const { review_id } = req.params;
	const { inc_votes } = req.body;
	updateReviewById(review_id, inc_votes)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => {
			next(err);
		});
};
