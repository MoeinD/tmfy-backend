import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    /**we need to listen to the subject
     * and add the subscription for it
     */
    const subscription = stan.subscribe('ticket:created');

    subscription.on('message', (msg) => {
        console.log('Messge has been crecivec for this subscription ', msg);
    })

})