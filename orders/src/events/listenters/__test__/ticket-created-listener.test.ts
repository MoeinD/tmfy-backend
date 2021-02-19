import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from '@tmfyticket/common';
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";



const setup = async () => {
    //create an instance of the listener
    const listenter = new TicketCreatedListener(natsWrapper.client);
    //create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    //creae a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listenter, data, msg };

}

it('create and saves a ticket ', async () => {
    const { listenter, data, msg } = await setup();
    //call the onMessage function with the data object + message object
    await listenter.onMessage(data, msg);
    //write asserstion to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
})

it('aks the messages', async () => {
    const { msg, data, listenter } = await setup();
    //call the on message function with the data object + message object
    await listenter.onMessage(data, msg);
    //write assertion to make sure ack fuction is called
    expect(msg.ack).toHaveBeenCalled();
})