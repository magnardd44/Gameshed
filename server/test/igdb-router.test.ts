import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import app from '../src/app';
import searchService from '../src/services/search-service';
process.env.IGDB_CLIENT_ID = 'id';
process.env.IGDB_CLIENT_SECRET = 'secret';
const portNumber = 3009;

axios.defaults.baseURL = 'http://localhost:' + portNumber + '/api/v2';
jest.setTimeout(1000);

const realAxios = axios.create();
const mockAdapter = new MockAdapter(axios);

const goodReply = [
  {
    id: 1022,
    genres: [{ name: 'a' }],
    platforms: [{ name: 'a' }],
    screenshots: ['url'],
    similar_games: ['mario'],
    cover: 'url',
  },
];

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(portNumber, () => done());
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done.fail(new Error());
  webServer.close(() => done());
});

beforeEach(() => {
  searchService.token = {
    access_token: '',
    expire_time: 0,
    token_type: '',
  };
});

describe('Testing api-key', () => {
  beforeEach(() => {
    mockAdapter.reset();
  });

  test('Search bad API-key', (done) => {
    mockAdapter
      .onPost(
        'https://id.twitch.tv/oauth2/token?client_id=id&client_secret=secret&grant_type=client_credentials'
      )
      .reply(401);

    realAxios.post('/search/', { game: 'Zelda' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });

  test('use stored api-key', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(200, [{ id: 1 }]);

    searchService.token = {
      token_type: 'bearer',
      access_token: 'abc',
      expire_time: Date.now() * 1000 + 10000,
    };

    realAxios.post('/search/', { game: 'Zelda' }).then((results) => {
      expect(results.status).toBe(200);
      done();
    });
  });
});

describe('Testing search', () => {
  beforeEach(() => {
    mockAdapter.reset();
    mockAdapter
      .onPost(
        'https://id.twitch.tv/oauth2/token?client_id=id&client_secret=secret&grant_type=client_credentials'
      )
      .reply(200, { id: 1, token: 'abc' });
  });

  test('Search for Zelda', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(200, goodReply);

    realAxios.post('/search/', { game: 'Zelda' }).then((results) => {
      expect(results.status).toBe(200);
      expect(results.data.length).toBeGreaterThan(0);
      expect(Number(results.data[0].igdb_id)).toBeGreaterThan(0);
      done();
    });
  });

  test('No search text', (done) => {
    realAxios.post('/search/', { game: '' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 400');
      done();
    });
  });

  test('IGDB error', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(400);

    searchService.search = jest.fn(() => {
      return Promise.reject();
    });

    realAxios.post('/search/', { game: 'Mario' }).catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});

describe('Testing get', () => {
  beforeEach(() => {
    mockAdapter.reset();
    mockAdapter
      .onPost(
        'https://id.twitch.tv/oauth2/token?client_id=id&client_secret=secret&grant_type=client_credentials'
      )
      .reply(200, { id: 1, token: 'abc' });
  });

  test('Get data for The Legend of Zelda', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(200, goodReply);

    realAxios.get('/search/get/1022').then((results) => {
      expect(results.status).toBe(200);
      expect(results.data).toHaveProperty('igdb_id');
      expect(results.data.igdb_id).toBe(1022);
      done();
    });
  });

  test('Text instead of id', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(400);

    realAxios.get('/search/get/text').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});

describe('Testing extra', () => {
  beforeEach(() => {
    mockAdapter.reset();
    mockAdapter
      .onPost(
        'https://id.twitch.tv/oauth2/token?client_id=id&client_secret=secret&grant_type=client_credentials'
      )
      .reply(200, { id: 1, token: 'abc' });
  });

  test('Get extra for The Legend of Zelda', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(200, goodReply);

    realAxios.get('/search/get_extra/1022').then((results) => {
      expect(results.status).toBe(200);
      expect(results.data).toHaveProperty('cover_url');
      done();
    });
  });

  test('Text instead of id', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(400);

    realAxios.get('/search/get_extra/text').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});

describe('Testing get_all', () => {
  beforeEach(() => {
    mockAdapter.reset();
    mockAdapter
      .onPost(
        'https://id.twitch.tv/oauth2/token?client_id=id&client_secret=secret&grant_type=client_credentials'
      )
      .reply(200, { id: 1, token: 'abc' });
  });

  test('Get all for The Legend of Zelda', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(200, goodReply);

    realAxios.get('/search/get_all/1022').then((results) => {
      expect(results.status).toBe(200);
      expect(results.data).toHaveProperty('igdb_id');
      expect(Number(results.data.igdb_id)).toBeGreaterThan(0);
      expect(results.data).toHaveProperty('igdb');
      expect(results.data.igdb).toHaveProperty('cover_url');
      done();
    });
  });

  test('Get all for text instead of id', (done) => {
    mockAdapter.onPost('https://api.igdb.com/v4/games').reply(400);
    realAxios.get('/search/get_all/text').catch((error) => {
      expect(error.message).toEqual('Request failed with status code 500');
      done();
    });
  });
});
