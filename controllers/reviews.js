const {
	fetchMappedReviewsById,
	updateReviewById,
	removeReviewAndComments,
	fetchMappedReviews,
	insertReview,
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

exports.deleteReviewById = (req, res, next) => {
	const { review_id } = req.params;
	removeReviewAndComments(review_id)
		.then(() => {
			res.status(204).send({
				msg: "Review and comments deleted successfully",
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category, items_per_page, page } = req.query;
	fetchMappedReviews(sort_by, order, category, items_per_page, page)
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postReview = (req, res, next) => {
	const newReview = req.body;
	insertReview(newReview)
		.then((review) => {
			res.status(201).send({ review });
		})
		.catch((err) => {
			next(err);
		});
};
