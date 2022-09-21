import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';

import { errorHandler, NotFoundError, CurrentUser } from '@afang324/common';

const app = express();
app.set('trust proxy', true); //tell express to trust traffic from nginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, //do not encrypt cookie
    //send cookie only on https request, unless it's a test environment
    secure: process.env.NODE_ENV != 'test'
  })
);

app.use(CurrentUser);
app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };