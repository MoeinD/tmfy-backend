import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from "@tmfyticket/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async  onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order)
            throw new Error('Order not fount');

        /**check if the order has been paid and complete 
         * we do not need to cancel and just ack 
         * without cancelling the order
         */
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        })
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();

    }

}