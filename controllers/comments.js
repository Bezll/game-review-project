const {
	fetchCommentsById,
	insertComments,
	removeComments,
} = require("../models/comments");

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

exports.deleteComments = (req, res, next) => {
	const { comment_id } = req.params;
	removeComments(comment_id)
		.then(() => {
			res.status(204).send({ msg: "Comment deleted successfully" });
		})
		.catch((err) => {
			next(err);
		});
};
