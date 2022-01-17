const db = require("../db/connection.js");

function formatCategories(categoryData) {
	const formattedCategories = categoryData.map((category) => [
		category.slug,
		category.description,
	]);
	return formattedCategories;
}

function formatUsers(userData) {
	const formattedUsers = userData.map((user) => [
		user.username,
		user.avatar_url,
		user.name,
	]);
	return formattedUsers;
}

function formatReviews(reviewData) {
	const formattedReviews = reviewData.map((review) => [
		review.title,
		review.designer,
		review.review_body,
		review.review_img_url,
		review.votes,
		review.category,
		review.owner,
		review.created_at,
	]);
	return formattedReviews;
}

function formatComments(commentData) {
	const formattedComments = commentData.map((comment) => [
		comment.body,
		comment.votes,
		comment.author,
		comment.review_id,
		comment.created_at,
	]);
	return formattedComments;
}

module.exports = {
	formatCategories,
	formatUsers,
	formatReviews,
	formatComments,
};
