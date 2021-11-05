import express from 'express';
import userService from './user-service';

const userRouter = express.Router();

userRouter.get('/', (request, response) => {
	response.send('hello');
});

userRouter.post('/get', (request, response) => {
	const data = request.body;

	if (data?.token) {
		userService.verify(data.token)
		.catch(err=>response.status(401).send(err))
		.then(()=>userService.get(data.token))
		.then(res=>response.send(res))
		.catch(err=>response.status(500).send(err))
	} else response.status(400).send('Manglar token');
});

userRouter.post('/add', (request, response) => {
	const data = request.body;

	if (data?.email && data?.password) {
		userService.add(data.email, data.password)
		.then(res=>response.send(res))
		.catch(err=>response.status(500).send(err))
	} else response.status(400).send('Manglar epost eller passord');
});

userRouter.post('/login', (request, response) => {
	const data = request.body;

	if (data?.email && data?.password) {
		userService.login(data.email, data.password)
		.then(res=>response.send(res))
		.catch(err=>response.status(401).send(err))
	} else response.status(400).send('Manglar epost eller passord');
});

userRouter.post('/logout', (request, response) => {
	const data = request.body;

	if (data?.token) {
		userService.verify(data.token)
		.catch(err=>response.status(401).send(err))
		.then(()=>{
			userService.logout(data.token.id)
			response.send();
		})
	} else response.status(400).send('Manglar token');

});

userRouter.post('/delete', (request, response) => {
	const data = request.body;

	if (data?.token) {
		userService.verify(data.token)
		.catch(err=>response.status(401).send(err))
		.then(()=>userService.delete(data.token.id))
		.then(()=>response.send())
		.catch(err=>response.status(500).send(err))
	} else response.status(400).send('Manglar token');
});

//// DEBUG ///
userRouter.post('/verify', (request, response) => {
	const data = request.body;

	if (data?.token) {
		userService.verify(data.token)
			.then(res=>response.send(res))
			.catch(err=>response.status(401).send(err))
	} else response.status(400).send('Manglar token');
});

userRouter.get('/debug/user/:id', (request, response) => {
	userService
		.get_debug(Number(request.params.id))
		.then(res=>response.send(res))
		.catch((error) => response.status(500).send(error));
});

userRouter.get('/debug/login', (request, response) => {
	userService
		.get_login_debug()
		.then(res=>response.send(res))
		.catch((error) => response.status(500).send(error));
});

export default userRouter;
