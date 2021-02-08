import mongoose from 'mongoose';
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';




it('returns an error if the ticket does not exist ', async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId }).expect(404);
})

it('returns an error if the ticket is already reserved ', async () => {
    /**first we need to create a ticket and save it in the database */
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })
    await ticket.save();

    /**we need to create a new order and
     *  asociated the order with that ticket
     */
    const order = Order.build({
        ticket,
        userId: 'test',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save();
    /**now if we try create a new order and try to use
     * this ticket will got the error
     */

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id }).expect(400);


})

it('reserves a ticket ', async () => {

})