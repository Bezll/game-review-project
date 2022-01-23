const swaggerUI = require("swagger-ui-express"); //<< generate swagger UI
const express = require("express");
const { getCategories, postCategory } = require("./controllers/categories");
const { getUsers, getUsersByUsername } = require("./controllers/users");
const {
	getReviewById,
	patchReviewById,
	deleteReviewById,
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

const swaggerDocument = require("./swagger.json");

const app = express();
app.use(express.json());

app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/api/categories", getCategories);
app.post("/api/categories", postCategory);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);
app.delete("/api/reviews/:review_id", deleteReviewById);
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
