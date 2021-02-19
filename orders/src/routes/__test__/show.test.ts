import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';


it('Fetches the order ', async () => {
    //create a ticket
    const ticket1 = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 30
    })
    await ticket1.save();

    //make a request to build an order with this ticket
    const user = global.signin();

    const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket1.id }).expect(201);

    /**make a get request */
    const { body: fetchOrder } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).send().expect(200);
    expect(order.userId).toEqual(fetchOrder.userId);
    expect(fetchOrder.id).toEqual(order.id);

    /**make sure another user do not have access to this. */
    await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.signin()).send().expect(401);
})

