import express, { request, response } from 'express';
import { reviewService } from '../services/review-service';
import userService from '../services/user-service';

/**
 * Express router containing review methods.
 */
const reviewRouter = express.Router();

//Add new review to database
reviewRouter.post('/reviews', (request, response) => {
  const data = request.body;

  if (data && data.review_title.length != 0 && data.game_id != 0)
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then((userId) =>
        reviewService.create(data.game_id, data.review_title, data.text, data.rating, userId, false)
      )
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing review title');

  //const data = request.body;
  //if (data && data.review_title.length != 0 && data.game_id != 0)
  //  reviewService
  //    .create(data.game_id, data.review_title, data.text, data.rating)

  //    .then((id) => response.send({ id: id }))
  //    .catch((error) => response.status(500).send(error));
  //else response.status(400).send('Missing review title');
});

//Show published reviews
reviewRouter.get('/publishedReviews', (request, response) => {
  reviewService
    .getPublished()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Show published reviews based on genre
reviewRouter.get('/genreReviews/:genre_id', (request, response) => {
  const genre_id = Number(request.params.genre_id);
  reviewService
    .getGenre(genre_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Show published reviews based on platform
reviewRouter.get('/platformReviews/:platform_id', (request, response) => {
  const platform_id = Number(request.params.platform_id);
  reviewService
    .getPlatform(platform_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Fetch individual drafts after it has been added and saved
reviewRouter.get('/reviews/:review_id/draft', (request, response) => {
  const id = Number(request.params.review_id);
  reviewService
    .getDraft(id)
    .then((review) =>
      review ? response.send(review) : response.status(404).send('Review not found')
    )
    .catch((error) => response.status(500).send(error));
});

//Fetch published review
reviewRouter.get('/reviews/:review_id', (request, response) => {
  const id = Number(request.params.review_id);
  reviewService
    .get(id)
    .then((review) =>
      review ? response.send(review) : response.status(404).send('Review not found')
    )
    .catch((error) => response.status(500).send(error));
});

//Edit review
reviewRouter.patch('/reviews/:id', (request, response) => {
  const data = request.body;
  if ((data && data.title, data.text, data.rating != undefined))
    reviewService
      .edit(Number(request.params.id), data.title, data.text, data.rating)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('');
});

//Set review status to published
reviewRouter.patch('/reviews/:id/publish', (request, response) => {
  reviewService
    .publish(Number(request.params.id), true)
    .then((id) => response.send({ id: id }))
    .catch((error) => response.status(500).send(error));
});

//Add like to review
reviewRouter.patch('/reviews/:id/relevant', (request, response) => {
  const data = request.body;
  reviewService
    .relevant(Number(request.params.id), data.user_id, data.relevant)
    .then((id) => response.send({ id: id }))
    .catch((error) => response.status(500).send(error));
});

//Delete review

reviewRouter.delete('/reviews/:id', (request, response) => {
  reviewService
    .delete(Number(request.params.id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

export default reviewRouter;
