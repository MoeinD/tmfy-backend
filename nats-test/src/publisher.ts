import nats from 'node-nats-streaming';
console.clear();
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('publisher connected to NAT streaming server');

    /**this is the data to be shared */
    const data = JSON.stringify({
        id: '123',
        title: 'connect',
        price: 40
    })
    /**before publising we need to make it json  */
    /**
    /**for publishing 
     * we need the subject and data to be shared
     */
    stan.publish('ticket:created', data, () => {
        console.log('Event published.');
    })

})