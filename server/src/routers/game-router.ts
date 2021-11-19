import express, { request, response } from 'express';
import { gameService } from '../services/game-service';

/**
 * Express router containing game methods.
 */
const gameRouter = express.Router();

gameRouter.get('/search/:searchString', (request, response) => {
  const searchString = request.params.searchString;

  gameService
    .search(searchString)
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

gameRouter.get('/', (_request, response) => {
  gameService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

gameRouter.get('/:id', (request, response) => {
  const id = Number(request.params.id);
  gameService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

//Add new game to database
gameRouter.post('/', (request, response) => {
  const data = request.body;

  if (data && data.game_title.length != 0 && data.game_description.length != 0)
    gameService
      .create(data.igdb_id, data.game_title, data.game_description)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing review title');
});

export default gameRouter;
