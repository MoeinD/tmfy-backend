import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedLister } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to NATS');
    /**we need ot check and on close 
     * stop to send the message to listener
     */
    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    })
    new TicketCreatedLister(stan).listen();
})

/**we want to close the process when exit or stop the listner
 * 
 */
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


