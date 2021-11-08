import express from 'express';
import router from './game-review-router';
import searchRouter from './search-router';
import userRouter from './user-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2', router);
app.use('/api/v2/search', searchRouter);
app.use('/api/v2/user', userRouter);

export default app;
