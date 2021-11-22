import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { Game, gameService } from '../src/services/game-service';
import userService from '../src/services/user-service';

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

const testGame: Game[] = [
  {
    game_id: 1,
    igdb_id: null,
    game_title: 'Spill1',
    genre: [],
    platform: [],
    game_description: 'spill1',
  },
  {
    game_id: 2,
    igdb_id: null,
    game_title: 'Spill2',
    genre: Array(),
    platform: [],
    game_description: 'spill2',
  },
  {
    game_id: 3,
    igdb_id: null,
    game_title: 'Spill3',
    genre: [],
    platform: [],
    game_description: 'spill3',
  },
  {
    game_id: 4,
    igdb_id: null,
    game_title: 'Spill4',
    genre: [],
    platform: [],
    game_description: 'spill4',
  },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3005/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3005, () => done());
});

beforeEach((done) => {
  //Mock user service
  userService.verify = jest.fn(() => {
    return new Promise((resolve: any, reject: any) => {
      resolve(1);
    });
  });
  // Delete all platforms, and reset id auto-increment start value
  pool.query('DELETE FROM games', (error) => {
    if (error) return done.fail(error);

    pool.query('ALTER TABLE games AUTO_INCREMENT = 1', (error) => {
      if (error) return done.fail(error);

      gameService
        .create(0, testGame[0].game_title, testGame[0].game_description)
        .then(() => gameService.create(0, testGame[1].game_title, testGame[1].game_description)) // Create testPlatform[1] after testPlatform[0] has been created
        .then(() => gameService.create(0, testGame[2].game_title, testGame[2].game_description)) // Create testPlatform[2] after testPlatform[1] has been created
        .then(() => gameService.create(0, testGame[3].game_title, testGame[3].game_description)) // Create testPlatform[3] after testPlatform[2] has been created
        .then(() => done()); // Call done() after testPlatform[3] has been created
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll(() => {
  pool.end();
  webServer.close();
});

//Tests calls on platform

describe('Fetch games (GET)', () => {
  test('Fetch all games (201 Created)', async () => {
    const response = await axios.get('/games');
    expect(response.status).toEqual(201);
  });

  test('Fetch all games (500 Internal Server error)', async () => {
    try {
      gameService.getAll = () => Promise.reject();
      const response = await axios.get('/games');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  test('Fetch game by name (200 OK)', async () => {
    const response = await axios.get('/games/search/Spill1');
    expect(response.status).toEqual(200);
    expect(response.data[0]).toEqual(testGame[0]);
  });

  test('Fetch game by name (404 Not Found)', async () => {
    try {
      const response = await axios.get('/games/search/-1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(404);
    }
  });

  test('Fetch game by name (500 Internal Server Error)', async () => {
    try {
      gameService.search = () => Promise.reject();
      const response = await axios.get('/games/search/Spill1');
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });

  test('Fetch game by id (200 OK)', async () => {
    const response = await axios.get('/games/1');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testGame[0]);
  });

  test('Fetch game by id (404 Not Found)', async () => {
    try {
      const response = await axios.get('/games/-1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(404);
    }
  });

  test('Fetch game by id (500 Internal Server Error)', async () => {
    try {
      gameService.get = () => Promise.reject();
      const response = await axios.get('/games/1');
    } catch (error: any) {
      console.log(error.response.status);
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Create new game (POST)', () => {
  test('Create new game (201 Created)', async () => {
    const new_game = { igdb_id: 1, game_title: 'Nytt spill', game_description: 'nytt spill' };
    await axios.post('/games', new_game).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 5 });
    });
  });
  test('Create new game (400)', async () => {
    const newGame0Length = { game_title: '' };
    try {
      const response = await axios.post('/games', newGame0Length);
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
    }
  });
  test('Create new game (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      const response = await axios.post('/games', {
        igdb_id: 1,
        game_title: 'Nytt spill',
        game_description: 'nytt spill',
      });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });
  test('Create new game (500 Internal Server error)', async () => {
    const new_game = {
      igdb_id: null,
      game_title: 'newGame',
      game_description: 'newGame Description',
    };
    try {
      const response = await axios.post('/games', { genre_name: new_game });
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});
