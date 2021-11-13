import express from 'express';
import userService from './user-service';

const userRouter = express.Router();

userRouter.get('/', (request, response) => {
  response.send('hello');
});

userRouter.post('/get', (request, response) => {
  const data = request.body;

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
      .then((res) => response.send(res))
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
    });
  //} else response.status(400).send('Manglar token');
});

userRouter.post('/delete', (request, response) => {
  const data = request.body;

  userService
    .verify(request.headers.authorization)
    .catch((err) => {
      response.status(401).send(err);
      throw err;
    })
    .then((id) => userService.delete(id))
    .then(() => response.send())
    .catch((err) => response.status(500).send(err));
  //} else response.status(400).send('Manglar token');
});

//// DEBUG ///
userRouter.post('/verify', (request, response) => {
  const data = request.body;

  userService
    .verify(request.headers.authorization)
    .then((res) => response.send(res))
    .catch((err) => response.status(401).send(err));
});

userRouter.get('/debug/user/:id', (request, response) => {
  userService
    .get_debug(Number(request.params.id))
    .then((res) => response.send(res))
    .catch((error) => response.status(500).send(error));
});

userRouter.get('/debug/login', (request, response) => {
  userService
    .get_login_debug()
    .then((res) => response.send(res))
    .catch((error) => response.status(500).send(error));
});

export default userRouter;
