
import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listenters/ticket-created-listener';
import { TicketUpdatedListener } from './events/listenters/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listenters/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listenters/payment-created-listener';




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
    if (!process.env.NATS_CLIENT_ID)
        throw new Error('NATS_CLIENT_ID must be defined');
    if (!process.env.NATS_URL)
        throw new Error('NATS_URL must be defined');
    if (!process.env.NATS_CUSTER_ID)
        throw new Error('NATS_CUSTER_ID must be defined');
    try {
        await natsWrapper.connect(process.env.NATS_CUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
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


