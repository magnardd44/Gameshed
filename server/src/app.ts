import express from 'express';
import searchRouter from './routers/search-router';
import userRouter from './routers/user-router';
import gameRouter from './routers/game-router';
import reviewRouter from './routers/review-router';
import genreRouter from './routers/genre-router';
import platformRouter from './routers/game-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('/api/v2/search', searchRouter);
app.use('/api/v2/user', userRouter);
app.use('/api/v2/game', gameRouter);
app.use('/api/v2/review', reviewRouter);
app.use('/api/v2/review', genreRouter);
app.use('/api/v2/platform', platformRouter);

export default app;
