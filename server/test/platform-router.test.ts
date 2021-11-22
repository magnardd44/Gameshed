import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { Platform, platformService } from '../src/services/platform-service';
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

const testPlatform: Platform[] = [
  {
    platform_id: 1,
    platform_name: 'Xbox',
  },
  {
    platform_id: 2,
    platform_name: 'Xbox 360',
  },
  {
    platform_id: 3,
    platform_name: 'Xbox One',
  },
  {
    platform_id: 4,
    platform_name: 'Game Boy',
  },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  //Mock user service
  userService.verify = jest.fn(() => {
    return new Promise((resolve: any, reject: any) => {
      resolve(1);
    });
  });
  // Delete all platforms, and reset id auto-increment start value
  pool.query('DELETE FROM platforms', (error) => {
    if (error) return done.fail(error);

    pool.query('ALTER TABLE platforms AUTO_INCREMENT = 1', (error) => {
      if (error) return done.fail(error);

      platformService
        .create(testPlatform[0].platform_name)
        .then(() => platformService.create(testPlatform[1].platform_name)) // Create testPlatform[1] after testPlatform[0] has been created
        .then(() => platformService.create(testPlatform[2].platform_name)) // Create testPlatform[2] after testPlatform[1] has been created
        .then(() => platformService.create(testPlatform[3].platform_name)) // Create testPlatform[3] after testPlatform[2] has been created
        .then(() => done()); // Call done() after testPlatform[3] has been created

      pool.query('DELETE FROM mapping_platform', (error) => {
        if (error) return done.fail(error);

        pool.query('ALTER TABLE mapping_platform AUTO_INCREMENT = 1', (error) => {
          if (error) return done.fail(error);
        });
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll(() => {
  pool.end();
  webServer.close();
});

//Tests calls on platform
describe('Fetch platforms (GET)', () => {
  test('Fetch all platforms (200 OK)', async () => {
    const response = await axios.get('/platforms');
    expect(response.status).toEqual(200);
  });

  test('Fetch all platforms (500 Internal Server error)', async () => {
    try {
      platformService.getAll = () => Promise.reject();
      const response = await axios.get('/platforms');
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 500');
    }
  });

  test('Fetch platform by name (200 OK)', async () => {
    const response = await axios.get('/platforms/Xbox');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(testPlatform[0]);
  });

  test('Fetch platform by name (404 Not Found)', async () => {
    try {
      const response = await axios.get('/platforms/-1');
    } catch (error: any) {
      expect(error.response.status).toEqual(404);
    }
  });

  test('Fetch platform by name (500 Internal Server error)', async () => {
    try {
      platformService.getId = () => Promise.reject();
      const response = await axios.get('/platforms/Xbox');
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 500');
    }
  });
});

describe('Create new platform (POST)', () => {
  test('Create new platform (201 OK)', async () => {
    await axios.post('/platforms', { platform_name: 'DS' }).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual({ id: 5 });
    });
  });
  test('Create new platform (400)', async () => {
    try {
      const response = await axios.post('/platforms');
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 400');
    }
  });
  test('Create new platform (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      const response = await axios.post('/platforms', { platform_name: 'DS' });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 401');
    }
  });
  test('Create new platform (500 Internal Server error)', async () => {
    const newPlatform = { platform_name: null };
    try {
      const response = await axios.post('/platforms', { platform_name: newPlatform });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 500');
    }
  });
});

//Tests calls on mappin_platform

describe('Create new platform_map (POST)', () => {
  test('Create new platform_map (200 OK)', async () => {
    await axios
      .post('/platforms/map', { platform_name: 'Platform1', game_id: 1 })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ id: 1 });
      });
  });
  test('Create new platform_map (400)', async () => {
    await axios.post('/platforms/map', { game_id: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
    });
  });

  test('Create new platform_map (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      await axios.post('/platforms/map', { platform_name: 'Platform1', game_id: 1 });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 401');
    }
  });

  test('Create new platform_map (500 Internal Server error)', async () => {
    const newPlatform_map = { platform_name: '', game_id: -1 };
    try {
      const response = await axios.post('/platforms/map', newPlatform_map);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Create new platform_map/string (POST)', () => {
  test('Create new platform_map/string (200 OK)', async () => {
    await axios
      .post('/platforms/map/string', { platform: 'Platform1', game_id: 1 })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual({ id: 0 });
      });
  });
  test('Create new platform_map/string (400)', async () => {
    try {
      await axios.post('/platforms/map/string', { game_id: '' });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 400');
    }
  });

  test('Create new platform_map/string (401)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      await axios.post('/platforms/map/string', { platform: 'Platform1', game_id: 1 });
    } catch (error: any) {
      expect(error.message).toEqual('Request failed with status code 401');
    }
  });

  test('Create new platform_map/string (500 Internal Server error)', async () => {
    const newPlatform_map = { platform: '', game_id: -1 };
    try {
      const response = await axios.post('/platforms/map/string', newPlatform_map);
    } catch (error: any) {
      expect(error.response.status).toEqual(500);
    }
  });
});

describe('Delete platform (DELETE)', () => {
  test('Delete platform (200 OK)', async () => {
    const response = await axios.delete('/platforms/2');
    expect(response.status).toEqual(200);
  });

  test('Delete task (500 Internal Server error)', async () => {
    let actualDelete = platformService.delete;
    platformService.delete = () => Promise.reject();

    await expect(() => axios.delete('/platforms/2')).rejects.toThrow(
      'Request failed with status code 500'
    );

    platformService.delete = actualDelete;
  });

  test('Delete platform (401 OK)', async () => {
    try {
      userService.verify = jest.fn(() => Promise.reject());
      const response = await axios.delete('/platforms/2');
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
    }
  });
});
