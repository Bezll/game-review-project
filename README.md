# Northcoders House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimick the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

You will spend the setup and seeding phase of this project in a pair, and separate once its time to build the server up! The point to separate is clearly annotated :)

## Step 1 - Setting up your project

You will need to create _two_ `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.

You have also been provided with a `db` folder with some data, a [setup.sql](./db/setup.sql) file, a `seeds` folder and a `utils` folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

Your second task is to make accessing both sets of data around your project easier. You should make 2 `index.js` files: one in each of your data folders (test & development).

The job of `index.js` in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like a index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- `categoryData`
- `reviewData`
- `userData`
- `commentData`

## Step 2 - Creating tables and Seeding

You will need to create your tables and write your seed function to insert the data into your database.

In order to both create the tables and seed your data, you will need to create a connection to your database. You can do this in the provided `connection.js`.

### Creating Tables

You should have separate tables for `categories`, `reviews`, `users` and `comments`. Make sure to consider the order in which you create your tables. You should think about whether you require any constraints on your table columns (e.g. 'NOT NULL')

Each category should have:

- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given category

Each user should have:

- `username` which is the primary key & unique
- `avatar_url`
- `name`

Each review should have:

- `review_id` which is the primary key
- `title`
- `review_body`
- `designer`
- `review_img_url` defaults to `https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg`
- `votes` defaults to 0
- `category` field which references the slug in the categories table
- `owner` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp

Each comment should have:

- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `review_id` field that references an review's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`

- **NOTE:** psql expects `Timestamp` types to be in a specific date format - **not a unix timestamp** as they are in our data! However, you can easily **re-format a unix timestamp into something compatible with our database using JS - you will be doing this in your utility functions**... [JavaScript Date object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

### Seeding

You need to complete the provided seed function to insert the appropriate data into your database.

Utilising your data manipulation skills, you will need to design some utility functions to ensure that the data can fit into your tables. These functions should be extracted into your `utils.js` and built using TDD. If you're feeling stuck, think about how the data looks now and compare it to how it should look for it fit into your table. The katas we gave you on day 1 of this block might be useful.

**Some advice: don't write all the utility functions in one go, write them when you need them in your seed**

---

## Step 3 - Building Endpoints

- Use proper project configuration from the offset, being sure to treat development and test environments differently.
- Test each route **as you go**, checking both successful requests **and the variety of errors you could expect to encounter** [See the error-handling file here for ideas of errors that will need to be considered](error-handling.md).
- After taking the happy path when testing a route, think about how a client could make it go wrong. Add a test for that situation, then error handling to deal with it gracefully.

---

Work through building endpoints in the following order:

You will work through the first endpoint in your pair and then diverge for the rest of the sprint.

_Here is a summary of all the endpoints. More detail about each endpoint is further down this document._

**Essential endpoints**

```http
GET /api/categories
```

> Time to go solo!

```http
GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
GET /api/reviews
GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments
GET /api
```

> Hosting and README time!

**Next endpoints to work through**

```http
DELETE /api/comments/:comment_id
GET /api/users
GET /api/users/:username
PATCH /api/comments/:comment_id
```

---

All of your endpoints should send the responses specified below in an **object**, with a **key name** of what it is that being sent. E.g.

```json
{
  "categories": [
    {
      "description": "Abstact games that involve little luck",
      "slug": "Euro games"
    },
    {
      "description": "Players attempt to uncover each other's hidden role",
      "slug": "Social deduction"
    },
    {
      "description": "Games involving physical skill",
      "slug": "Dexterity"
    }
  ]
}
```

---

### Essential Routes

#### **GET /api/categories**

Responds with:

- an array of category objects, each of which should have the following properties:
  - `slug`
  - `description`

---

**Please now bid farewell to your pair and continue on this sprint working solo. Ensure that you fork your partner's repo so you don't run into merge conflicts.**

#### **GET /api/reviews/:review_id**

Responds with:

- a review object, which should have the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `review_body`
  - `designer`
  - `review_img_url`
  - `category`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this

---

#### **PATCH /api/reviews/:review_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current review's vote property by 1

  `{ inc_votes : -100 }` would decrement the current review's vote property by 100

Responds with:

- the updated review

---

#### **GET /api/reviews**

Responds with:

- an `reviews` array of review objects, each of which should have the following properties:
  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `category`
  - `review_img_url`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id - you should make use of queries to the database in order to achieve this

Should accept queries:

- `sort_by`, which sorts the reviews by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `category`, which filters the reviews by the category value specified in the query

---

#### **GET /api/reviews/:review_id/comments**

Responds with:

- an array of comments for the given `review_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

---

#### **POST /api/reviews/:review_id/comments**

Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment

---

#### **GET /api**

Responds with:

- JSON describing all the available endpoints on your API

---

### **STOP POINT: Hosting and README!**

- If you _have_ already hosted your app at this point, remember to push up to `heroku` your updated code
- If you haven't already hosted your app, now is the time! Follow the instructions in [hosting.md](./hosting.md)
- Write your README, including the following information:
  - [ ] Link to hosted version
  - [ ] Write a summary of what the project is
  - [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
  - [ ] Include information about how to create the two `.env` files
  - [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

---

### Further Routes

#### **DELETE /api/comments/:comment_id**

Should:

- delete the given comment by `comment_id`

Responds with:

- status 204 and no content

---

#### **GET /api/users**

Responds with:

- an array of objects, each object should have the following property:
  - `username`

---

#### **GET /api/users/:username**

Responds with:

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

#### **PATCH /api/comments/:comment_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -1 }` would decrement the current comment's vote property by 1

Responds with:

- the updated comment

---

### _Even more_ endpoints/tasks

#### Adding pagination to GET /api/reviews

> To make sure that an API can handle large amounts of data, it is often necessary to use **pagination**. Head over to [Google](https://www.google.co.uk/search?q=cute+puppies), and you will notice that the search results are broken down into pages. It would not be feasible to serve up _all_ the results of a search in one go. The same is true of websites / apps like Facebook or Twitter (except they hide this by making requests for the next page in the background, when we scroll to the bottom of the browser). We can implement this functionality on our `/api/reviews` and `/api/comments` endpoints.

- Should accepts the following queries:
  - `limit`, which limits the number of responses (defaults to 10)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
- add a `total_count` property, displaying the total number of reviews (**this should display the total number of reviews with any filters applied, discounting the limit**)

---

#### Adding pagination to GET /api/reviews/:review_id/comments

Should accept the following queries:

- `limit`, which limits the number of responses (defaults to 10)
- `p`, stands for page which specifies the page at which to start (calculated using limit)

---

#### POST /api/reviews

Request body accepts:

- an object with the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_body`
  - `designer`
  - `category` which is a `category` from the categories table

Responds with:

- the newly added review, with all the above properties as well as:
  - `review_id`
  - `votes`
  - `created_at`
  - `comment_count`

#### POST /api/categories

Request body accepts:

- an object in the form:

```json
{
  "slug": "category name here",
  "description": "description here"
}
```

Responds with:

- a category object containing the newly added category

#### DELETE /api/reviews/:review_id

Should:

- delete the given review by review_id

Respond with:

- status 204 and no content
