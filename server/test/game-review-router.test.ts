import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { Review, reviewService } from '../src/review-service';

// // Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

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
    user_id: 891,
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
    user_id: 892,
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
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
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
      .then(() =>
        reviewService.create(
          testReviews[2].game_id,
          testReviews[2].review_title,
          testReviews[2].text,
          testReviews[2].rating,
          testReviews[2].user_id,
          testReviews[2].published
        )
      ) // Create testREview[3] after testReview[2] has been created
      .then(() =>
        reviewService.create(
          testReviews[3].game_id,
          testReviews[3].review_title,
          testReviews[3].text,
          testReviews[3].rating,
          testReviews[3].user_id,
          testReviews[3].published
        )
      )
      .then(() => done()); // Call done() after testTask[2] has been created
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
    axios.get('/publishedReviews').then((response) => {
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

  //Test getting a single complete review

  test('Fetch complete (200 OK)', (done) => {
    axios.get('/reviews/' + testReviews[0].review_id).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data.review_title).toEqual(testReviews[0].review_title);
      done();
    });
  });

  //   test('Fetch task (404 Not Found)', (done) => {
  //     axios
  //       .get('/tasks/4')
  //       .then((_response) => done.fail(new Error()))
  //       .catch((error) => {
  //         expect(error.message).toEqual('Request failed with status code 404');
  //         done();
  //       });
  //   });
  // });

  // describe('Create new task (POST)', () => {
  //   test('Create new task (200 OK)', (done) => {
  //     axios.post('/tasks', { title: 'Ny oppgave' }).then((response) => {
  //       expect(response.status).toEqual(200);
  //       expect(response.data).toEqual({ id: 4 });
  //       done();
  //     });
  //   });
  // });

  // describe('Delete task (DELETE)', () => {
  //   test('Delete task (200 OK)', (done) => {
  //     axios.delete('/tasks/2').then((response) => {
  //       expect(response.status).toEqual(200);
  //       done();
  //     });
  //   });
  // });
  // //Test Edit task
  // describe('Update task(PATCH)', () => {
  //   test('Update task', (done) => {
  //     axios.patch('/tasks/1', { done: true }).then((response) => {
  //       expect(response.status).toEqual(200);
  //     });
  //   });
});
