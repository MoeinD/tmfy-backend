import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@tmfyticket/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    //Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    //Create and save a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 40
    })
    ticket.save();
    console.log(ticket);
    //Create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        price: 56,
        title: 'test2',
        version: ticket.version + 1,
        userId: mongoose.Types.ObjectId().toHexString(),
    }
    //Create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    //return all of this stuff
    return { data, listener, msg, ticket };
}

it('finds, updates and save a ticket ', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('aks the message', () => {

})