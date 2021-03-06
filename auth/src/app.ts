import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { recentUserRouter } from './routes/current-user';
import signInRouter from './routes/signin';
import signUpRouter from './routes/signup';
import signOutRouter from './routes/signout';
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
app.use(recentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);
app.all('*', async () => {
    throw new NotFoundError();
})
app.use(errorHandler);

export { app };