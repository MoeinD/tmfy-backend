import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongooose from 'mongoose';
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@tmfyticket/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongooose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 34
    })

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'tesdd',
        expiresAt: new Date(),
        ticket
    })

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { ticket, order, listener, data, msg };
}