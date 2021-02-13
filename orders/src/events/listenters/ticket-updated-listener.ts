import { Message } from "node-nats-streaming";
import { Listener, TicketUpdatedEvent, Subjects } from "@tmfyticket/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.id);
        const { title, price } = data;
        if (!ticket) {
            throw new Error('ticket not found');
        }
        ticket.set({ title, price });
        await ticket.save();
        msg.ack();
    }

}