const fs = require("fs/promises");

exports.fetchApiOptions = async () => {
	try {
		return await fs
			.readFile(
				"/Users/jabezsouttar/Desktop/northcoders/backend/be-nc-games/endpoints.json",
				"utf8"
			)
			.then((data) => {
				const parsedData = JSON.parse(data);
				console.log(parsedData);
				return parsedData;
			});
	} catch (err) {
		return Promise.reject(err);
	}
};
