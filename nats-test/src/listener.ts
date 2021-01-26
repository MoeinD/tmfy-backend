import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

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
    /**we need to listen to the subject
     * and add the subscription for it
     */
    /**the option of setManualAckMode is false by default
     * and the ack will be send auto to the publisher to 
     * confirm
     * and if we set to true we need to chagne the code manually
     * after recieving the message
     */
    const options = stan.subscriptionOptions().setManualAckMode(true);
    /**we can add the queue group and then for
     * eample if we have more that one of the listener 
     * running that subject will be sent just to one of them 
     */
    /**for example now we have this serive group order-service-queue-group */

    const subscription = stan.subscribe('ticket:created', 'order-service-queue-group', options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Recieved event #${msg.getSequence()} , with data: ${data}`);
        }
        /**if we set ack to true  */
        msg.ack();
    })

})

/**we want to close the process when exit or stop the listner
 * 
 */
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());