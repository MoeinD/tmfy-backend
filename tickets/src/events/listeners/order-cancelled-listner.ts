import { Listener, OrderCancelledEvent, Subjects } from "@tmfyticket/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatePublisher } from "../publishers/ticket-update-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket)
            throw new Error('ticket not found');

        ticket.set({ orderId: undefined });
        await ticket.save();

        let deepcopy = JSON.parse(JSON.stringify(ticket));
        delete deepcopy.id;
        await new TicketUpdatePublisher(this.client).publish(Object.assign(deepcopy, { id: ticket.id }));
        msg.ack();
    };
}