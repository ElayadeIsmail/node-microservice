import { currentUser, NotFoundError } from '@eitickets/common';
import cookieSessions from 'cookie-session';
import express from 'express';

const app = express();

app.use(express.json());
app.set('trust proxy', true);

app.use(
  cookieSessions({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use('*', () => {
  throw new NotFoundError();
});

export { app };
