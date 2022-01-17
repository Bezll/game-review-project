const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

// const runSeed = async () => {
// 	await seed(devData);
// 	await db.end();
// };

const runSeed = () => {
	return seed(devData).then(() => {
		return db.end();
	});
};

runSeed();
