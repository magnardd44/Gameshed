# Welcome to Gameshed!

![logo](/client/src/images/logo.png)

_Created by Gruppe 4 Webutvikling: Helena Fawn Agustsson, Magnar Dybwad Dæhli, Stein Eggum, Solveig
Oterhals Landsvik_

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
files are not in the git repository. The connection details are as follows:

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

## 4 Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

## 5 You are now ready to start using the app

Access the app by opening the path http://localhost:3000/#/ To be able to create reviews you have to
be logged in, so creating a new user is a good way to start. For more information about how to use
the app, please see our instruction video.

## 6 Testing

We have included a set of unit tests to make sure our application stays robust at all times. The
tests are developed using the jest framework.

#### Run server tests:

```sh
cd server
npm test
```

### Run client tests:

```sh
cd client
npm test
```
