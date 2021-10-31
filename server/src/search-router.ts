import express from 'express';
import searchService from './search-service';

const searchRouter = express.Router();

searchRouter.post('/', (request, response) => {
	const data = request.body;

	if (data?.game) {
		searchService.search(data.game)
		.then(res=>response.send(res))
		.catch(err=>response.status(500).send(err))
	} else response.status(400).send('Missing search field');
});

// Debug
searchRouter.get('/get', (request, response) => {
	searchService.get_token()
	.then(res=>response.send(res))
	.catch(err=>response.status(500).send(err))
});

export default searchRouter;
