const { fetchUsers } = require("../models/users");

exports.getUsers = (req, res, next) => {
	fetchUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getUsersByUsername = (req, res, next) => {
	const { username } = req.params;
	fetchUsers(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};
