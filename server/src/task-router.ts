import express from 'express';
import taskService from './task-service';
import reviewService from './review-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

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
