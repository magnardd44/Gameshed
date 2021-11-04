import express from 'express';
import { gameService } from './services';
import { reviewService } from './review-service';

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

//Show published reviews
router.get('/publishedReviews', (_request, response) => {
  reviewService
    .getPublished()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Fetch individual review after it has been added and saved
router.get('/reviews/:id', (request, response) => {
  const id = Number(request.params.id);
  reviewService
    .get(id)
    .then((review) =>
      review ? response.send(review) : response.status(404).send('Review not found')
    )
    .catch((error) => response.status(500).send(error));
});

//Edit review
router.patch('/reviews/:id', (request, response) => {
  const data = request.body;
  if ((data && data.title, data.text, data.rating != undefined))
    reviewService
      .edit(Number(request.params.id), data.title, data.text, data.rating)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('');
});

//Set review status to published
router.patch('/reviews/:id/publish', (request, response) => {
  reviewService
    .publish(Number(request.params.id), true)
    .then((id) => response.send({ id: id }))
    .catch((error) => response.status(500).send(error));
});

//Delete review

router.delete('/reviews/:id', (request, response) => {
  reviewService
    .delete(Number(request.params.id))
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

export default router;
