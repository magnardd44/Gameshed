import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { Review, reviewService } from '../src/services/review-service';

import userService, { Token } from '../src/services/user-service';
import { gameService } from '../src/services/game-service';
import { genreService } from '../src/services/genre-service';

// // Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3002/api/v2';

jest.mock('../src/mysql-pool', () => {
  const mysql = require('mysql');
  return mysql.createPool({
    host: 'mysql.stud.ntnu.no',
    connectionLimit: 1,
    user: 'solveol_gameshed',
    password: 'gameshed',
    database: 'solveol_test',
  });
});

//Mock user service

userService.verify = jest.fn(() => {
  return new Promise((resolve: any, reject: any) => {
    resolve(testReviews[0].user_id);
  });
});

const testReviews: Review[] = [
  {
    review_id: 1,
    game_id: 1,
    game_title: 'Zelda',
    review_title: 'Testanmeldelse 1',
    text: 'Dette er den første testanmeldelsen',
    user_id: 890,
    rating: 6,
    published: true,
    genre_id: 1,
    platform_id: 86,
    relevant: 1,
    likes: 3,
  },
  {
    review_id: 2,
    game_id: 2,
    game_title: 'Inscryption',
    review_title: 'Testanmeldelse 2',
    text: 'Dette er den andre testanmeldelsen',
    user_id: 890,
    rating: 4,
    published: true,
    genre_id: 3,
    platform_id: 126,
    relevant: 1,
    likes: 2,
  },
  {
    review_id: 3,
    game_id: 3,
    game_title: 'Echo',
    review_title: 'Testanmeldelse 3',
    text: 'Dette er den tredje testanmeldelsen',
    user_id: 890,
    rating: 2,
    published: true,
    genre_id: 5,
    platform_id: 127,
    relevant: 1,
    likes: 5,
  },
  {
    review_id: 4,
    game_id: 3,
    game_title: 'Echo',
    review_title: 'Testanmeldelse 4',
    text: 'Dette er den fjerde testanmeldelsen',
    user_id: 892,
    rating: 2,
    published: false,
    genre_id: 5,
    platform_id: 127,
    relevant: 1,
    likes: 5,
  },
];

let webServer: any;
beforeAll((done) => {
  webServer = app.listen(3002, () => done());
  // Use separate port for testing
});

//Create test user, test game and test reviews. Delete previous test reviews
beforeEach((done) => {
  pool.query("INSERT INTO platforms (platform_name) VALUES ('zool_platform')", (error, results) => {
    if (error) throw error;
    testReviews.forEach((element) => {
      element.platform_id = results.insertId;
    });
    pool.query("INSERT INTO genres (genre_name) VALUES ('zool_adventure')", (error, results) => {
      if (error) throw error;
      testReviews.forEach((element) => {
        element.genre_id = results.insertId;
      });
      pool.query("INSERT INTO games (game_title) VALUES ('zool_game')", (error, results) => {
        if (error) throw error;
        testReviews.forEach((element) => {
          element.game_id = results.insertId;
        });
        pool.query(
          'INSERT INTO mapping_platform (game_id, platform_id ) VALUES (?, ?)',
          [testReviews[0].game_id, testReviews[0].platform_id],
          (error, results) => {
            if (error) throw error;
            pool.query(
              'INSERT INTO mapping_genre (game_id, genre_id ) VALUES (?, ?)',
              [testReviews[0].game_id, testReviews[0].genre_id],
              (error, results) => {
                if (error) throw error;
                pool.query(
                  "INSERT INTO users (email) VALUES ('zool@zool.no')",
                  (error, results) => {
                    if (error) throw error;
                    testReviews.forEach((element) => {
                      element.user_id = results.insertId;
                    });

                    pool.query('DELETE FROM reviews', (error) => {
                      if (error) return done.fail(error);
                      // Create testTasks sequentially in order to set correct id, and call done() when finished
                      reviewService
                        .create(
                          testReviews[0].game_id,
                          testReviews[0].review_title,
                          testReviews[0].text,
                          testReviews[0].rating,
                          testReviews[0].user_id,
                          testReviews[0].published
                        ) // Create testReview[1] after testReview[0] has been created
                        .then((review_id: number) => {
                          testReviews[0].review_id = review_id;
                          return reviewService.create(
                            testReviews[1].game_id,
                            testReviews[1].review_title,
                            testReviews[1].text,
                            testReviews[1].rating,
                            testReviews[1].user_id,
                            testReviews[1].published
                          );
                        }) // Create testReview[2] after testReview[1] has been created
                        .then((review_id: number) => {
                          testReviews[1].review_id = review_id;

                          return reviewService.create(
                            testReviews[2].game_id,
                            testReviews[2].review_title,
                            testReviews[2].text,
                            testReviews[2].rating,
                            testReviews[2].user_id,
                            testReviews[2].published
                          );
                        }) // Create testREview[3] after testReview[2] has been created
                        .then((review_id: number) => {
                          testReviews[2].review_id = review_id;
                          return reviewService.create(
                            testReviews[3].game_id,
                            testReviews[3].review_title,
                            testReviews[3].text,
                            testReviews[3].rating,
                            testReviews[3].user_id,
                            testReviews[3].published
                          );
                        })
                        .then((review_id: number) => {
                          testReviews[3].review_id = review_id;
                        })

                        .then(() => done());
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});
//Delet user and game
afterEach((done) => {
  pool.query('DELETE FROM mapping_relevant', () => {
    pool.query('DELETE FROM platforms', () => {
      pool.query('DELETE FROM reviews', () => {
        pool.query("DELETE FROM users WHERE email = 'zool@zool.no'", () => {
          pool.query("DELETE FROM games WHERE game_title = 'zool_game'", () => {
            pool.query("DELETE FROM genres WHERE genre_name = 'zool_adventure'", () => {
              done();
            });
          });
        });
      });
    });
  });
});
// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done.fail(new Error());
  webServer.close(() => pool.end(() => done()));
});

//Tests view of published reviews

describe('Fetch  reviews (GET)', () => {
  test('Fetch published reviews (200 OK)', (done) => {
    axios.get('/reviews/published').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data.length).toEqual(testReviews.length - 1);
      expect(
        response.data.filter((t: any) => t.review_title == testReviews[0].review_title).length
      ).toEqual(1);
      expect(
        response.data.filter((t: any) => t.review_title == testReviews[1].review_title).length
      ).toEqual(1);
      expect(
        response.data.filter((t: any) => t.review_title == testReviews[2].review_title).length
      ).toEqual(1);

      done();
    });
  });

  test('Fetch reviews by genre (200 OK)', (done) => {
    axios.get('/reviews/genre/' + testReviews[0].genre_id).then((response) => {
      expect(response.status).toEqual(200);

      expect(
        response.data.filter((t: any) => t.review_title == testReviews[0].review_title).length
      ).toEqual(1);

      done();
    });
  });

  test('Fetch reviews by platform (200 OK)', (done) => {
    axios.get('/reviews/platform/' + testReviews[0].platform_id).then((response) => {
      expect(response.status).toEqual(200);

      expect(
        response.data.filter((t: any) => t.review_title == testReviews[0].review_title).length
      ).toEqual(1);

      done();
    });
  });

  //Test getting a single complete review

  test('Fetch complete (200 OK)', (done) => {
    axios.get('/reviews/review/' + testReviews[0].review_id).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data.review_title).toEqual(testReviews[0].review_title);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/reviews/4')
      .then((response) => done.fail(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new review (POST)', () => {
  test('Create new review (200 OK)', (done) => {
    axios
      .post('/reviews', {
        review_title: 'Ny testanmeldelse',
        text: 'Dette er en ny testanmeldelse fra Solveig',
        rating: 6,
      })
      .then((response: any) => {
        expect(response.status).toEqual(200);
        // expect(response.data).toEqual({ id: 4 });
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

describe('Delete review (DELETE)', () => {
  test('Delete review (200 OK)', (done) => {
    axios.delete('/reviews/' + testReviews[0].review_id).then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

// //Test Edit review
describe('Update review (PATCH)', () => {
  test('Update review', (done) => {
    axios
      .patch('/reviews/' + testReviews[0].review_id, {
        title: 'Dette er en test2',
        text: 'test',
        rating: 3,
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  test('Publish review', (done) => {
    axios
      .patch('/reviews/' + testReviews[0].review_id + '/publish', {})
      .then((response) => {
        expect(response.status).toEqual(200);
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  test('Like review', (done) => {
    axios
      .patch('/reviews/' + testReviews[0].review_id + '/relevant', {
        relevant: 1,
        user_id: testReviews[0].user_id,
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        axios.get('/reviews/review/' + testReviews[0].review_id).then((response) => {
          //console.log(response.data);
          expect(response.data.likes).toEqual(1);

          done();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

describe('Get top ten', () => {
  axios
    .get('/reviews/topTen')
    .then((response) => {
      expect(response.status).toEqual(200);
      //expect(response.data).toHaveLength(1);
    })
    .catch((err) => {
      console.log(err);
    });
});

describe('Get last ten', () => {
  axios
    .get('/reviews/lastTen')
    .then((response) => {
      expect(response.status).toEqual(200);
      //expect(response.data).toHaveLength(1);
    })
    .catch((err) => {
      console.log(err);
    });
});

describe('User is not verified', () => {
  test('post /', (done) => {
    const spy = jest.spyOn(userService, 'verify');
    spy.mockImplementationOnce(() => Promise.reject());

    axios
      .post('/reviews', {
        review_title: 'Ny testanmeldelse',
        text: 'Dette er en ny testanmeldelse fra Solveig',
        rating: 6,
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 401');
        done();
      });
  });

  test('patch /:id', (done) => {
    const spy = jest.spyOn(userService, 'verify');
    spy.mockImplementationOnce(() => Promise.reject());

    axios
      .patch('/reviews/1', {
        title: 'Ny testanmeldelse',
        text: 'Dette er en ny testanmeldelse fra Solveig',
        rating: 6,
      })
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 401');
        done();
      });
  });

  test('patch /:id/publish', (done) => {
    const spy = jest.spyOn(userService, 'verify');
    spy.mockImplementationOnce(() => Promise.reject());

    axios.patch('/reviews/1/publish').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });

  test('patch /:id/relevant', (done) => {
    const spy = jest.spyOn(userService, 'verify');
    spy.mockImplementationOnce(() => Promise.reject());

    axios.patch('/reviews/1/relevant').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });
});
