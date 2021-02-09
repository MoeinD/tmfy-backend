import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

it('test that when user do not have the access can not delte the order', async () => {
    /**create a new ticket */
    const ticket = Ticket.build({
        title: 'test',
        price: 20
    })
    await ticket.save();
    const user = global.signin();

    const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201);
    /**try to delte with the another user  */
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', global.signin()).send().expect(401);
    /**now try to cancel with the correct permission */
    await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(204);
    /**make suer the order has been canceled */
    const cancelleduser = await Order.findById(order.id);
    expect(cancelleduser.status).toEqual(OrderStatus.Canceled);
})

it.todo('emits a order cacelled even');