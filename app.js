const express = require("express");
const { getApiOptions } = require("./controllers/api-options");
const { getCategories } = require("./controllers/categories");
const { getUsers, getUsersByUsername } = require("./controllers/users");
const {
	getReviewById,
	patchReviewById,
	getReviews,
	postReview,
} = require("./controllers/reviews");
const {
	getComments,
	postComments,
	deleteComments,
	patchComments,
} = require("./controllers/comments");
const {
	handle404s,
	handlePsqlErrors,
	handleCustomErrors,
	handleServerErrors,
} = require("./errors/errors");

const app = express();
app.use(express.json());

app.get("/api", getApiOptions);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/reviews", getReviews);
app.post("/api/reviews", postReview);

app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComments);
app.delete("/api/comments/:comment_id", deleteComments);
app.patch("/api/comments/:comment_id", patchComments);

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUsersByUsername);

app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
