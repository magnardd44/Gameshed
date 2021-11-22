import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';

import { Genre, genreService } from '../src/services/genre-service';
import userService from '../src/services/user-service';

//Mock user service

/*
userService.verify = jest.fn(() => {
  return new Promise((resolve: any, reject: any) => {
    resolve(testPlatform[0].platform_id);
  });
});
*/

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

const testGenre: Genre[] = [
  {
    genre_id: 1,
    genre_name: 'genre1',
    genre_img: null,
  },
  {
    genre_id: 2,
    genre_name: 'genre2',
    genre_img: null,
  },
  {
    genre_id: 3,
    genre_name: 'genre3',
    genre_img: null,
  },
  {
    genre_id: 4,
    genre_name: 'genre4',
    genre_img: null,
  },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3004/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3004, () => done());
});

beforeEach((done) => {
  //Mock user service
  userService.verify = jest.fn(() => {
    return new Promise((resolve: any, reject: any) => {
      resolve(1);
    });
  });
  // Delete all platforms, and reset id auto-increment start value
  pool.query('DELETE FROM genres', (error) => {
    if (error) return done.fail(error);

    pool.query('ALTER TABLE genres AUTO_INCREMENT = 1', (error) => {
      if (error) return done.fail(error);

      pool.query('DELETE FROM mapping_genre', (error) => {
        if (error) return done.fail(error);

        pool.query('ALTER TABLE mapping_genre AUTO_INCREMENT = 1', (error) => {
          if (error) return done.fail(error);

          genreService
            .create(testGenre[0].genre_name)
            .then(() => genreService.create(testGenre[1].genre_name)) // Create testPlatform[1] after testPlatform[0] has been created
            .then(() => genreService.create(testGenre[2].genre_name)) // Create testPlatform[2] after testPlatform[1] has been created
            .then(() => genreService.create(testGenre[3].genre_name)) // Create testPlatform[3] after testPlatform[2] has been created
            .then(() => done()); // Call done() after testPlatform[3] has been created
        });
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  pool.query('DELETE FROM genres', (error) => {
    if (error) return done.fail(error);

    pool.query('ALTER TABLE genres AUTO_INCREMENT = 1', (error) => {
      if (error) return done.fail(error);

      pool.query('DELETE FROM mapping_genre', (error) => {
        if (error) return done.fail(error);

        pool.query('ALTER TABLE mapping_genre AUTO_INCREMENT = 1', (error) => {
          if (error) return done.fail(error);
        });
      });
    });
  });
  pool.end();
  webServer.close();
});

//Tests calls on platform

describe('Fetch genres (GET)', () => {
  test('Fetch all genres (200 OK)', async () => {
    const response = await axios.get('/genres');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testGenre);
  });

  test('Fetch all genres (500 Internal Server error)', async () => {
    try {
      genreService.getAll = () => Promise.reject();
      const response = await axios.get('/genres');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  test('Fetch genres by name (200 OK)', async () => {
    const response = await axios.get('/genres/get/genre1');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testGenre[0]);
  });

  test('Fetch genres by name (404 Not Found)', async () => {
    try {
      const response = await axios.get('/genres/get/-1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(404);
    }
  });

  test('Fetch genre by name (500 Internal Server Error)', async () => {
    try {
      genreService.getId = () => Promise.reject();
      const response = await axios.get('/genres/get/genre1');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  test('Fetch genres by id (200 OK)', async () => {
    const response = await axios.get('/genres/1');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testGenre[0]);
  });

  test('Fetch genres by id (404 Not Found)', async () => {
    try {
      const response = await axios.get('/genres/-1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(404);
    }
  });

  test('Fetch genres by id (500 Internal Server Error)', async () => {
    try {
      genreService.get = () => Promise.reject();
      const response = await axios.get('/genres/1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Create new genre (POST)', () => {
  test('Create new genre (201 Created)', async () => {
    const new_genre = { genre_name: 'genre5' };
    await axios.post('/genres', new_genre).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 5 });
    });
  });
  test('Create new genre (400)', async () => {
    const genreName0Length = { genre_name: '' };
    try {
      const response = await axios.post('/genres', genreName0Length);
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
    }
  });
  test('Create new genre (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      const response = await axios.post('/genres', { genre_name: 'genre5' });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });
  test('Create new genre (500 Internal Server error)', async () => {
    const newGenre = { genre_name: null };
    try {
      const response = await axios.post('/genres', { genre_name: newGenre });
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});
describe('Create new genre_map (POST)', () => {
  test('Create new genre_map (201 Created)', async () => {
    const newGenre_map = { game_id: 1, genre_id: 1 };
    await axios.post('/genres/map', newGenre_map).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 1 });
    });
  });

  test('Create new genre_map (400)', async () => {
    const newGenre_map = { game_id: '' };
    try {
      await axios.post('/genres/map', newGenre_map);
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
    }
  });

  test('Create new genre_map (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      await axios.post('/genres/map', { game_id: 1, genre_id: 1 });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });

  test('Create new genre_map (500 Internal Server error)', async () => {
    const newGenre_map = { game_id: 1, genre_id: -1 };
    try {
      const response = await axios.post('/genres/map', newGenre_map);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Create new genres_map/string (POST)', () => {
  test('Create new genre_map/string (201 Created)', async () => {
    const newGenreMapString = { game_id: 1, genre: 'genre_map_string1' };
    await axios.post('/genres/map/string', newGenreMapString).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 0 });
    });
  });

  test('Create new genre_map/string (400)', async () => {
    try {
      await axios.post('/genres/map/string', { game_id: '', genre: 0 });
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
    }
  });

  test('Create new genre_map/string (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      await axios.post('/genres/map/string', { game_id: 1, genre: 'genre_map1' });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });

  test('Create new genre_map/string (500 Internal Server error)', async () => {
    const newGenre_map_string = { game_id: -1, genre: 'genre' };
    try {
      const response = await axios.post('/genres/map/string', newGenre_map_string);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Delete genre (DELETE)', () => {
  test('Delete genre (200 OK)', async () => {
    const response = await axios.delete('/genres/1');
    expect(response.status).toEqual(200);
  });

  test('Delete task (500 Internal Server error)', async () => {
    try {
      let actualDelete = genreService.delete;
      genreService.delete = () => Promise.reject();
      const response = await axios.delete('/genres/2');
      genreService.delete = actualDelete;
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  test('Delete genre (401 OK)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      const response = await axios.delete('/genres/2');
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });
});
