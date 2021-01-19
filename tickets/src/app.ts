import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import newRouter from './routes/new';

import { errorHandler, NotFoundError } from '@tmfyticket/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.Node_ENV! == 'test'
    })
)

app.use(newRouter);

app.all('*', async () => {
    throw new NotFoundError();
})
app.use(errorHandler);

export { app };