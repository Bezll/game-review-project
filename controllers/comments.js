const { fetchCommentsById, insertComments } = require("../models/comments");

exports.getComments = (req, res, next) => {
	const { review_id } = req.params;
	fetchCommentsById(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postComments = (req, res, next) => {
	const { review_id } = req.params;
	const newComment = req.body;
	insertComments(review_id, newComment)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};
