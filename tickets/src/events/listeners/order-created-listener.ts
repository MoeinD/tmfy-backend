import { Listener, OrderCreatedEvent, Subjects } from "@tmfyticket/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatePublisher } from "../publishers/ticket-update-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        //find the ticket that the order is reserving.
        const ticket = await Ticket.findById(data.ticket.id);
        //If no ticket, throw error
        if (!ticket)
            throw new Error('Ticket not found');
        //make the ticket as being reserved by setting its orderId prop
        ticket.set({ orderId: data.id })
        //Save the ticket
        await ticket.save();
        let deepcopy = JSON.parse(JSON.stringify(ticket));
        delete deepcopy.id;
        await new TicketUpdatePublisher(this.client).publish(Object.assign(deepcopy, { id: ticket.id }));

        //ack the message ∏
        msg.ack();
    }

}