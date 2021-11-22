import express, { request, response } from 'express';
import { genreService } from '../services/genre-service';
import userService from '../services/user-service';

/**
 * Express router containing genre methods.
 */
const genreRouter = express.Router();

genreRouter.get('/', (request, response) => {
  genreService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

genreRouter.get('/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

genreRouter.get('/get/:name', (request, response) => {
  const name = request.params.name;
  genreService
    .getId(name)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

genreRouter.delete('/:id', (request, response) => {
  const id = Number(request.params.id);
  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then(() => genreService.delete(id))
    .then(() => response.status(200).send())
    .catch((error) => response.status(500).send(error));
});

genreRouter.post('/', (request, response) => {
  const data = request.body;
  if (data && data.genre_name.length != 0)
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then(() => genreService.create(data.genre_name))

      .then((id) => {
        response.status(201);
        response.send({ id: id });
      })
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre name');
});

//Update mapping_genre
genreRouter.post('/map', (request, response) => {
  const data = request.body;
  if (data && typeof data.game_id == 'number')
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then((userId) => genreService.updateGenreMap(data.game_id, data.genre_id))
      .then((id) => {
        response.status(201);
        response.send({ id: id });
      })
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre');
});

genreRouter.post('/map/string', (request, response) => {
  const data = request.body;
  if (typeof data.game_id == 'number' && typeof data.genre == 'string')
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then((userId) => genreService.updateGenreMapString(data.game_id, data.genre))
      .then((id) => {
        response.status(201);
        response.send({ id: id });
      })
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre');
});

export default genreRouter;
