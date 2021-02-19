import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { response } from 'express';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: 'test',
        title: 'concert',
        price: 30
    })
    await ticket.save();

    return ticket;
}
it('fetch orders for an particular user ', async () => {
    //create three tickets
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin();
    const user2 = global.signin();
    //Create one order as User #1
    await request(app).post('/api/orders')
        .set('Cookie', user1).
        send({ ticketId: ticket1.id }).expect(201)
    //Create two orders as User #2
    const { body: orderOne } = await request(app).post('/api/orders').set('Cookie', user2).send({ ticketId: ticket2.id }).expect(201);
    const { body: orderTwo } = await request(app).post('/api/orders').set('Cookie', user2).send({ ticketId: ticket3.id }).expect(201);
    //Make request for get orders for User #2
    const orders = await request(app).get('/api/orders').set('Cookie', user2).expect(200);
    //make sure we only got the orders for User #2
    expect(orders.body.length).toEqual(2);
    expect(orders.body[0].id).toEqual(orderOne.id);
    expect(orders.body[1].id).toEqual(orderTwo.id);
})