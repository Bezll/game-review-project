const db = require(".././connection");
const format = require("pg-format");
const {
	formatCategories,
	formatUsers,
	formatReviews,
	formatComments,
} = require("../../utils/seed-formatting");

const seed = async (data) => {
	const { categoryData, commentData, reviewData, userData } = data;
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS reviews;`);
	await db.query(`DROP TABLE IF EXISTS users;`);
	await db.query(`DROP TABLE IF EXISTS categories;`);

	await db.query(`
        CREATE TABLE categories (
        slug TEXT PRIMARY KEY, 
        description VARCHAR(1000) NOT NULL 
      );`);

	await db.query(`
        CREATE TABLE users (
        username VARCHAR(100) NOT NULL PRIMARY KEY,
        avatar_url VARCHAR(150),
        name VARCHAR(100)
      );`);

	await db.query(`
        CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        review_body VARCHAR(1000) NOT NULL,
        review_img_url VARCHAR(150) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category TEXT NOT NULL REFERENCES categories(slug),
        owner VARCHAR(100) NOT NULL REFERENCES users(username),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );`);

	await db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(100) NOT NULL REFERENCES users(username),
          review_id INT NOT NULL REFERENCES reviews(review_id),
          votes INT DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          body VARCHAR(1000) NOT NULL
        )`);

	const formattedCategories = formatCategories(categoryData);
	const sql = format(
		`INSERT INTO categories (slug, description) VALUES %L RETURNING *;`,
		formattedCategories
	);
	await db.query(sql);

	const formattedUsers = formatUsers(userData);
	const sql2 = format(
		`INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
		formattedUsers
	);
	await db.query(sql2);

	const formattedReviews = formatReviews(reviewData);
	const sql3 = format(
		`INSERT INTO reviews (
      title,
      review_body,
      review_img_url,
      votes,
      category,
      owner,
      created_at) VALUES %L RETURNING *;`,
		formattedReviews
	);
	await db.query(sql3);

	const formattedComments = formatComments(commentData);
	const sql4 = format(
		`INSERT INTO comments (	
      body,
      votes,
      author,
      review_id,
      created_at) VALUES %L RETURNING *;`,
		formattedComments
	);
	await db.query(sql4);

	const result = await db.query(`SELECT * FROM comments`);
	console.log(result.rows);
};

module.exports = seed;
