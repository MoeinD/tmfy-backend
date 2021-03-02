import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tmfyticket/common';
import { stripe } from '../../stripe';
jest.mock('../../stripe');

const api = '/api/payments';

it('returns a 404 when purchasing an otrder that does ot exist ', async () => {
    await request(app).post(api).set('Cookie', global.signin()).send({
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

    await request(app).post(api).set('Cookie', global.signin()).send({
        token: 'test',
        orderId: order.id
    }).expect(401);
})

it('return 400 when the order has been cnacelled ', async () => {
    const orderId = mongoose.Types.ObjectId().toHexString();
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        version: 0,
        price: 30,
        status: OrderStatus.Created,
        userId

    })
    order.set({ status: OrderStatus.Cancelled })

    await order.save();

    await request(app).post(api).set('Cookie', global.signin(userId)).send({
        token: 'test',
        orderId: order.id
    }).expect(400);
})

it('returns a 204 with valid inputs ', async () => {
    const orderId = mongoose.Types.ObjectId().toHexString();
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);

    const order = Order.build({
        id: orderId,
        version: 0,
        price,
        status: OrderStatus.Created,
        userId
    })

    await order.save();

    await request(app).post(api).set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId
        }).expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(price * 100);
    expect(chargeOptions.currency).toEqual('usd');

})