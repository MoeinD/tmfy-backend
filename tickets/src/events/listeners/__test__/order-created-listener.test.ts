import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/tickets";
import { OrderCreatedEvent, OrderStatus } from '@tmfyticket/common';
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";

const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'test',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    })

    await ticket.save();

    //create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'fdsf',
        expiresAt: 'dffsf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
    }

    //Create a fake message 
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return { msg, listener, data, ticket };
};

it('sets the userId of the ticket ', async () => {
    const { data, listener, ticket, msg } = await setup();

    await listener.onMessage(data, msg);

    const upatedTicket = await Ticket.findById(ticket.id);

    expect(upatedTicket.orderId).toEqual(data.id);

})

it('calls the ack message ', async () => {
    const { data, listener, ticket, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event', async () => {
    const { data, listener, msg, ticket } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //@ts-ignore
    const ticketUpdateData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdateData.version).toEqual(ticket.version + 1);
    expect(ticketUpdateData.orderId).toEqual(data.id);
})

