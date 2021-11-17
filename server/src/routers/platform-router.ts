import express, { request, response } from 'express';
import { genreService } from '../services/genre-service';
import { platformService } from '../services/platform-service';

/**
 * Express router containing platform methods.
 */
const platformRouter = express.Router();

//Update mapping_platform
platformRouter.post('/map', (request, response) => {
  const data = request.body;
  if (data)
    platformService
      .updatePlatformMap(data.platform_id, data.game_id)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform');
});

/*
platformRouter.get('/platforms/:id', (request, response) => {
  const id = Number(request.params.id);
  platformService
    .get(id)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});
*/

platformRouter.get('/:name', (request, response) => {
  const name = request.params.name;

  platformService
    .getId(name)
    .then((platform) =>
      platform ? response.send(platform) : response.status(404).send('Platform not found')
    )
    .catch((error) => response.status(500).send(error));
});

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

platformRouter.post('/', (_request, response) => {
  const data = request.body;
  if (data && data.platform_name.length != 0)
    platformService
      .create(data.platform_name)

      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform name');
});

platformRouter.delete('/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// //Add new user to database
// router.post('/users', (request, response) => {
//   const data = request.body;
//   if (data && data.nickname.length != 0)
//     userService
//       .create(data.nickname, data.bio)

//       .then((id) => response.send({ id: id }))
//       .catch((error) => response.status(500).send(error));
//   else response.status(400).send('Missing user nickname');
// });

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
// router.post('/tasks', (request, response) => {
//   const data = request.body;
//   if (data && data.title.length != 0)
//     taskService
//       .create(data.title)
//       .then((id) => response.send({ id: id }))
//       .catch((error) => response.status(500).send(error));
//   else response.status(400).send('Missing task title');
// });

export default platformRouter;
