import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    console.log('publisher connected to NAT streaming server');

    const publisher =
        new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '34',
            title: 'test',
            price: 45,
        })
    }
    catch (err) {
        console.error('error that has been created');
    }
})