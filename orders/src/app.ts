import { currentUser, errorHandler, NotFoundError } from '@eitickets/common';
import cookieSessions from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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

app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(indexOrderRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
