import { Listener, OrderCreatedEvent, Subjects, OrderCancelledEvent } from "@tmfyticket/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        //find the ticket that the order is reserving.
        const ticket = await Ticket.findById(data.ticket.id);
        //If no ticket, throw error
        if (!ticket)
            throw new Error('Ticket not found');
        //make the ticket as being reserved by setting its orderId prop
        ticket.set({ orderId: data.id })
        //Save the ticket
        await ticket.save();
        //ack the message 
        msg.ack();
    }

}