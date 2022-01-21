Board-Game-review Back-End Project
This project has been setup to build the API endpoints for the Board Game review Front-End project, which interacts with a PSQL database.

🌟 Getting Started
You will need to follow the instructions below to navigate through this repo.

📜 Prerequisites
This project has been built on the following versions of software and libraries.

node v17.1.0
postgreSQL v14.1
express v4.17.2
dotenv v14.1.0
pg v8.7.1
pg-format v1.0.4

💡 Install
git clone https://github.com/Bezll/be-nc-games.git

In your terminal, cd into the cloned repo.

cd be-nc-games

npm install

In the root directory please create two .env files:

.env.development
.env.test

Inside the .env.development file please add PGDATABASE=nc_games.

Inside the .env.test file please add PGDATABASE=nc_games_test

Now, everything you need is installed.✨

🚀 Running the tests

To initialise the database please run - npm setup-dbs.

Then to seed the database please run - npm seed.

If you wish to run the endpoint on a local machine please run - npm start.

To run the test suite I have created please run - npm test.

🏠 Hosted Site
This server has been hosted using Heroku. You can find it here - https://nc-game-reviews-project.herokuapp.com/api

👏Acknowledgments
Built under guidance and with help from the Northcoders Team.
