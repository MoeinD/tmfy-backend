
import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    /**throw the error if we 
     * have not created the JWT key
     */
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    /**check that we have create a new 
     * const for the connection to the mongo db fo the ticket
     * otherwise got the error
     */
    if (!process.env.MONGO_URI)
        throw new Error('MONGO_URI must be defined');
    try {
        await mongoose.connect(process.env.MONGO_URI, {
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

