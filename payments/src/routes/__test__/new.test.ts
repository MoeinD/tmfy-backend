import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tmfyticket/common';

it('returns a 404 when purchasing an otrder that does ot exist ', async () => {
    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'test',
        orderId: mongoose.Types.ObjectId().toHexString()
    }).expect(404);

})

it('reutrn 401 when the order does not belongs to the user ', async () => {

    const orderId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: orderId,
        version: 0,
        price: 30,
        status: OrderStatus.Created,
        userId: 'test'

    })

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'test',
        orderId: order.id
    }).expect(401);
})

it('return 400 when the order has been cnacelled ', async () => {
    const orderId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: orderId,
        version: 0,
        price: 30,
        status: OrderStatus.Created,
        userId: 'test'

    })

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin('test')).send({
        token: 'test',
        orderId: order.id
    }).expect(400);
})