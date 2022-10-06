# Game-Board Backend Project

This project is the backend for the Board Game review site, a independent project carried out at Northcoders.
This repository servers the API endpoints for the Board Game review Frontend project, which interacts with a PSQL database.

The frontend of this project can be found here - https://github.com/Bezll/nc-games
This server has been hosted using Heroku. You can find it here - https://nc-game-reviews-project.herokuapp.com/api

## Stack

Javascript, PSQL, Express.js, Node.js

## Installation

Use the package manager npm to install this project.

```bash
npm i
```

In the root directory please create two .env files:

.env.development
.env.test

Inside the .env.development file please add PGDATABASE=nc_games.

Inside the .env.test file please add PGDATABASE=nc_games_test

## To Run

To initialise the database.

```bash
npm setup-dbs
```

To seed the database.

```bash
npm seed
```

If you wish to run the endpoint on a local machine.

```bash
npm start
```

To run the test suite I have created.

```bash
npm test
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

👏Acknowledgments
Built under guidance and with help from the Northcoders Team.
