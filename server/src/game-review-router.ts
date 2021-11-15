import express, { request, response } from 'express';
import { gameService } from './game-services';
import { reviewService } from './review-service';
import { genreService } from './genre-service';
import { platformService } from './platform-service';
import userService from './user-service';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.get('/games/search/:searchString', (request, response) => {
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

  if (data && data.game_title.length != 0 && data.game_description.length != 0)
    gameService
      .create(data.igdb_id, data.game_title, data.game_description)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing review title');
});

//Update mapping_platform
router.post('/platformMap', (request, response) => {
  const data = request.body;
  if (data)
    platformService
      .updatePlatformMap(data.platform_id, data.game_id)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform');
});

//Update mapping_genre
router.post('/genreMap', (request, response) => {
  const data = request.body;
  if (data)
    genreService
      .updateGenreMap(data.game_id, data.genre_id)
      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre');
});

//Add new review to database
router.post('/reviews', (request, response) => {
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
router.get('/publishedReviews', (request, response) => {
  reviewService
    .getPublished()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Show published reviews based on genre
router.get('/genreReviews/:genre_id', (request, response) => {
  const genre_id = Number(request.params.genre_id);
  reviewService
    .getGenre(genre_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Show published reviews based on platform
router.get('/platformReviews/:platform_id', (request, response) => {
  const platform_id = Number(request.params.platform_id);
  reviewService
    .getPlatform(platform_id)
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

//Fetch individual drafts after it has been added and saved
router.get('/reviews/:review_id/draft', (request, response) => {
  const id = Number(request.params.review_id);
  reviewService
    .getDraft(id)
    .then((review) =>
      review ? response.send(review) : response.status(404).send('Review not found')
    )
    .catch((error) => response.status(500).send(error));
});

//Fetch published review
router.get('/reviews/:review_id', (request, response) => {
  const id = Number(request.params.review_id);
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

//Add like to review
router.patch('/reviews/:id/relevant', (request, response) => {
  const data = request.body;
  reviewService
    .relevant(Number(request.params.id), data.user_id, data.relevant)
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

router.get('/genre/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

router.get('/genres/:name', (request, response) => {
  const name = request.params.name;
  genreService
    .getId(name)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

router.get('/genres', (_request, response) => {
  genreService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

router.delete('/genre/:id', (request, response) => {
  const id = Number(request.params.id);
  genreService
    .get(id)
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.post('/genres', (_request, response) => {
  const data = request.body;
  if (data && data.review_title.length != 0)
    genreService
      .create(data.genre_name)

      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing genre name');
});

/*
router.get('/platforms/:id', (request, response) => {
  const id = Number(request.params.id);
  platformService
    .get(id)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});
*/

router.get('/platforms/:name', (request, response) => {
  const name = request.params.name;
  platformService
    .getId(name)
    .then((genre) => (genre ? response.send(genre) : response.status(404).send('Genre not found')))
    .catch((error) => response.status(500).send(error));
});

router.get('/platforms', (_request, response) => {
  platformService
    .getAll()
    .then((rows) => {
      response.send(rows);
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

router.post('/platforms', (_request, response) => {
  const data = request.body;
  if (data && data.platform_name.length != 0)
    platformService
      .create(data.platform_name)

      .then((id) => response.send({ id: id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing platform name');
});

router.delete('/platforms/:id', (request, response) => {
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

export default router;
