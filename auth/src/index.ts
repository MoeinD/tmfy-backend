import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { recentUserRouter } from './routes/current-user';
import signInRouter from './routes/signin';
import signUpRouter from './routes/signup';
import signOutRouter from './routes/signout';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
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

const start = async () => {
    /**throw the error if we 
     * have not created the JWT key
     */
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to Auth DB');
    }
    catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('listening on port on 3000');
    })
}
start();


