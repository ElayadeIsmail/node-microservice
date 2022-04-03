import { currentUser, errorHandler, NotFoundError } from '@eitickets/common';
import cookieSessions from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSessions({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
