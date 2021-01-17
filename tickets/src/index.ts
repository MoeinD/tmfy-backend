
import mongoose from 'mongoose';

import { app } from './app';

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


