import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
export class TicketCreatedLister extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payment-service';
    onMessage(data: any, msg: Message): void {
        console.log('Event data ', data);
        msg.ack();
    }

}