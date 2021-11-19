# Gruppe 4 Webutvikling

Welcome to Gameshed!

Welcome to our webapplication Gameshed! Gameshed is all about letting you create your own game
reviews. As a starting point you have the IGDB database which contains thousands of games in a wide
variety of genres and for more than 150 platforms. And if, against all odds, you want to share your
opinions on a game that you can't find in our system, you are free to publish your own game
description. If you're more interested in reading reviews than in writing them, Gameshed provides
several ways to discover the types of reviews that interests you the most. We sincerely hope you
will enjoy the Gameshed experience, but first there are a few steps you need to go through to get
started.

## 1 Download the project folder and save it to your computer

You can acces the app through our gitlab repository

## 2 Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'solveol_gameshed';
process.env.MYSQL_PASSWORD = 'gameshed';
process.env.MYSQL_DATABASE = 'solveol_gameshed';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'solveol_gameshed';
process.env.MYSQL_PASSWORD = 'gameshed';
process.env.MYSQL_DATABASE = 'solveol_test';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## 3 Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

## 4

Access the app by opening the path http://localhost:3000/#/ To be able to create reviews you have to
be logged in, so creating a new user is a good way to start.

## Testing

## Run server tests:

We have included a set of unit tests to make sure our

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

```sh
npm test
```
