import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';


const api = '/api/tickets';
const mongooseId = () => {
    return mongoose.Types.ObjectId().toHexString();
}

it('return a 404 if the  provided id does not exist ', async () => {
    await request(app).put(`${api}/${mongooseId()}`).set('Cookie', global.signin()).send({ title: 'test', price: 20 }).expect(404);
})

it('return 401 if the user is not authenticated', async () => {
    await request(app).put(`${api}/${mongooseId()}`).send({ title: 'test', price: 20 }).expect(401);
})

it('return 401 if the user does not own the ticket ', async () => {
    const response = await request(app).post(api).set('Cookie', global.signin()).send({ title: 'testtitke ', price: 20 });

    await request(app).put(`${api}/${response.body.id}`).set('Cookie', global.signin()).send({ title: 'test new ', price: 20 }).expect(401);

})

it('return 400 is the title or price is not valid', async () => {
    await request(app).put(`${api}/${mongooseId()}`).set('Cookie', global.signin()).send({ title: '', price: 20 }).expect(400);
    await request(app).put(`${api}/${mongooseId()}`).set('Cookie', global.signin()).send({ title: 'ffsdfsf', price: -20 }).expect(400);
})

it('update the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app).post(api).set('Cookie', cookie).
        send({ title: 'test', price: 20 });
    /**we can check the update ticket from the db or make another get reqiest for checking the new value */
    const updateResponse = await request(app).put(`${api}/${response.body.id}`).set('Cookie', cookie).send({ title: 'test new', price: 30 }).expect(200);
    expect(updateResponse.body.title).toEqual('test new');
})

it('publishes and events ', async () => {
    const cookie = global.signin();

    const response = await request(app).post(api).set('Cookie', cookie).
        send({ title: 'test', price: 20 });
    /**we can check the update ticket from the db or make another get reqiest for checking the new value */
    await request(app).put(`${api}/${response.body.id}`).set('Cookie', cookie).send({ title: 'test new', price: 30 }).expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})