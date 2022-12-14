import express from 'express';
import { platformService } from '../services/platform-service';
import userService from '../services/user-service';

/**
 * Express router containing platform methods.
 */
const platformRouter = express.Router();

platformRouter.get('/', (_request, response) => {
  platformService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

platformRouter.get('/:name', (request, response) => {
  const name = request.params.name;
  if (typeof name == 'string')
    platformService
      .getId(name)
      .then((platform) =>
        platform ? response.send(platform) : response.status(404).send('Platform not found')
      )
      .catch((error) => response.status(500).send(error));
});

platformRouter.delete('/:id', (request, response) => {
  const id = Number(request.params.id);
  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then(() => platformService.delete(id))
    .then(() => response.status(200).send())
    .catch((error) => response.status(500).send(error));
});

platformRouter.post('/', (request, response) => {
  const data = request.body;

  if (!data.hasOwnProperty('platform_name')) {
    response.status(400).send('A platform needs the following property: platform__name.');
  } else {
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then(() => platformService.create(data.platform_name))
      .then((id) => {
        response.status(201);
        response.send({ id: id });
      })
      .catch((error) => response.status(500).send(error));
  }
});

//Update mapping_platform
platformRouter.post('/map', (request, response) => {
  const data = request.body;
  if (typeof data.platform_name == 'string' && typeof data.game_id == 'number')
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then((userId) => platformService.updatePlatformMap(data.platform_id, data.game_id))
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform');
});

platformRouter.post('/map/string', (request, response) => {
  const data = request.body;
  if (typeof data.platform == 'string' && typeof data.game_id == 'number')
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then(() => platformService.updatePlatformMapString(data.platform, data.game_id))
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform');
});

export default platformRouter;
