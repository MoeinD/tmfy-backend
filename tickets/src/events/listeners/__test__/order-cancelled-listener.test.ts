import { OrderCancelledListener } from "../order-cancelled-listner"
import { natsWrapper } from "../../../nats-wrapper"
import mongoose from 'mongoose';
import { Ticket } from "../../../models/tickets";
import { OrderCancelledEvent } from "@tmfyticket/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'test',
        price: 30,
        userId: 'test',
    })
    ticket.set({
        orderId
    })
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { data, msg, listener, ticket, orderId };
}

it('updates the ticket , publishes an event , and acks the message ', async () => {
    const { msg, data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    //**after callinng this one the order id of the ticket should be undefined */
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket.orderId).toEqual(undefined);
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})