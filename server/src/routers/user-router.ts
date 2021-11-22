import express from 'express';
import userService from '../services/user-service';

/**
 * Express router containing user methods.
 */

const userRouter = express.Router();

userRouter.get('/', (request, response) => {
  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then((id) => userService.get(id))
    .then((res) => response.send(res))
    .catch((err) => response.status(500).send(err));
});

userRouter.post('/add', (request, response) => {
  const data = request.body;

  if (data?.email && data?.password) {
    userService
      .add(data.email, data.password)
      .then((res) => response.status(201).send(res))
      .catch((err) => response.status(500).send(err));
  } else response.status(400).send('Manglar epost eller passord');
});

userRouter.put('/', (request, response) => {
  const data = request.body;

  if (data?.user) {
    userService
      .verify(request.headers.authorization)
      .catch((err) => {
        response.status(401).send(err);
        throw err;
      })
      .then((id) => userService.put(id, data.user))
      .then((res) => response.send(res))
      .catch((err) => response.status(500).send(err));
  } else response.status(400).send('Manglar brukar');
});

userRouter.post('/login', (request, response) => {
  const data = request.body;

  if (data?.email && data?.password) {
    userService
      .login(data.email, data.password)
      .then((res) => response.send(res))
      .catch((err) => response.status(401).send(err));
  } else response.status(400).send('Manglar epost eller passord');
});

userRouter.post('/logout', (request, response) => {
  const data = request.body;

  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then((id) => {
      userService.logout(id);
      response.send();
    })
    .catch((err) => {
      if (response.statusCode != 401) response.status(500).send(err);
    });
});

userRouter.delete('/', (request, response) => {
  const data = request.body;

  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then((id) => userService.delete(id))
    .then(() => response.status(204).send())
    .catch((err) => response.status(500).send(err));
});

export default userRouter;
