const express = require("express");
const { getCategories } = require("./controllers/categories");
const {
	getReviewById,
	patchReviewById,
	getReviews,
} = require("./controllers/reviews");
const {
	getComments,
	postComments,
	deleteComments,
} = require("./controllers/comments");
const {
	handle404s,
	handlePsqlErrors,
	handleCustomErrors,
	handleServerErrors,
} = require("./errors/errors");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComments);
app.delete("/api/comments/:comment_id", deleteComments);

app.all("*", handle404s);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
