import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './ticket-created-events';
import { Subjects } from './subjects';

export class TicketCreatedLister extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data ', data.id, data.price, data.title);
        msg.ack();
    }

}