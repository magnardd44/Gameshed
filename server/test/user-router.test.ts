import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import userService, { Token } from '../src/services/user-service';

axios.defaults.baseURL = 'http://localhost:3003/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3003, () => done());
});

beforeEach((done) => {
  //Truncate fungerer ikke pga. foreign keys
  // Delete all tasks, and reset id auto-increment start value
  pool.query('DELETE FROM users', (error) => {
    if (error) return done.fail(error);

    userService.add('admin', 'admin').then((token) => {
      expect(token).toHaveProperty('id');
      expect(token).toHaveProperty('token');
      expect(token.id).toBeGreaterThan(0);
      done();
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done.fail(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('get', () => {
  test('all', (done) => {
    userService.get_all().then((results) => {
      expect(results.length).toEqual(1);
      done();
    });
  });

  test('Unauthorized', (done) => {
    axios.get('/user').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });
});

describe('add', () => {
  let users = [
    { email: 'abc@online.no', password: 'test1' },
    { email: 'def@hotmail.no', password: 'test1' },
    { email: 'student@stud.ntnu.no', password: 'emnekode' },
  ];

  test('create', (done) => {
    Promise.all(users.map((u) => axios.post('/user/add', u))).then((results) => {
      results.map((r) => expect(r.data.id).toBeGreaterThan(0));
      done();
    });
  });

  test('Dobbel create', (done) => {
    Promise.all([axios.post('/user/add', users[0]), axios.post('/user/add', users[0])]).catch(
      (error) => {
        expect(error.message).toEqual('Request failed with status code 500');
        done();
      }
    );
  });

  test('feil', (done) => {
    axios.post('/user/add', {}).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });
});

describe('put', () => {
  let users = [
    { email: 'student@stud.ntnu.no', password: 'emnekode2002' },
    { nick: 'student@stud.ntnu.no', email: 'student@stud.ntnu.no', about: 'superstudent' },
  ];

  test('Legger til ny brukar og endrar han', (done) => {
    axios.post('/user/add', users[0]).then((results) => {
      expect(results.status).toBe(201);
      let token = JSON.stringify(results.data);
      axios
        .put('/user/', { user: users[1] }, { headers: { authorization: token } })
        .then((results) => {
          axios.get('/user', { headers: { authorization: token } }).then((results) => {
            expect(results.data).toMatchObject(users[1]);
            done();
          });
        });
    });
  });

  test('feil', (done) => {
    axios.put('/user/', {}).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('Unauthorized', (done) => {
    axios.put('/user/', { user: users[1] }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });
});

describe('delete', () => {
  let user = { email: 'student@stud.ntnu.no', password: 'emnekode2002' };

  test('Legger til ny brukar og slettar han', (done) => {
    axios.post('/user/add', user).then((results) => {
      expect(results.status).toBe(201);
      let token = JSON.stringify(results.data);
      let id = results.data.id;

      userService.get(id).then((result) => {
        expect(result.email).toMatch(user.email);
        axios.delete('/user/', { headers: { authorization: token } }).then((results) => {
          expect(results.status).toBe(204);
          userService.get(id).catch((error) => {
            expect(error).toBe('Userdata not found');
            done();
          });
        });
      });
    });
  });

  test('Unauthorized', (done) => {
    axios.delete('/user/').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });
});

describe('login', () => {
  test('admin', (done) => {
    axios.post('/user/login', { email: 'admin', password: 'admin' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('token');
      expect(response.data.id).toBeGreaterThan(0);
      done();
    });
  });

  test('feil', (done) => {
    axios.post('/user/login', {}).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('Unauthorized', (done) => {
    axios.post('/user/login', { email: 'email', password: 'password' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 401');
      done();
    });
  });
});

describe('logout', () => {
  test('admin', (done) => {
    axios.post('/user/login', { email: 'admin', password: 'admin' }).then((response) => {
      expect(response.status).toEqual(200);

      let token: string = JSON.stringify(response.data);

      axios.post('/user/logout', {}, { headers: { authorization: token } }).then((response) => {
        expect(response.status).toEqual(200);
        axios.post('/user/logout', {}, { headers: { authorization: token } }).catch((error) => {
          expect(error.message).toEqual('Request failed with status code 401');
          done();
        });
      });
    });
  });
});
