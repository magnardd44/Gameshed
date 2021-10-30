import express from 'express';
import { gameService, reviewService } from './services';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/games', (_request, response) => {
  gameService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

router.get('/games/:id', (request, response) => {
  const id = Number(request.params.id);
  gameService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

//Add new game to database
router.post('/games', (request, response) => {
  const data = request.body;
  if (data && data.review_title.length != 0)
    gameService
      .create(data.review_title, data.text, data.rating, data.description)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing review title');
});

//Add new review to database
router.post('/reviews', (request, response) => {
  const data = request.body;
  if (data && data.review_title.length != 0)
    reviewService
      .create(data.review_title, data.text, data.rating)

      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing review title');
});

router.get('/reviews', (_request, response) => {
  reviewService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/reviews/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .get(id)
    .then((task) => (task ? response.send(task) : response.status(404).send('Task not found')))
    .catch((error) => response.status(500).send(error));
});

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

// router.delete('/tasks/:id', (request, response) => {
//   taskService
//     .delete(Number(request.params.id))
//     .then((_result) => response.send())
//     .catch((error) => response.status(500).send(error));
// });

export default router;
