import express, { request, response } from 'express';
import { genreService } from '../services/genre-service';

/**
 * Express router containing genre methods.
 */
const genreRouter = express.Router();

//Update mapping_genre
genreRouter.post('/map', (request, response) => {
  const data = request.body;
  if (data)
    genreService
      .updateGenreMap(data.game_id, data.genre_id)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre');
});

genreRouter.get('/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

genreRouter.get('/:name', (request, response) => {
  const name = request.params.name;
  genreService
    .getId(name)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

genreRouter.get('/', (_request, response) => {
  genreService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

genreRouter.delete('/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

genreRouter.post('/', (_request, response) => {
  const data = request.body;
  if (data && data.review_title.length != 0)
    genreService
      .create(data.genre_name)

      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre name');
});

export default genreRouter;
