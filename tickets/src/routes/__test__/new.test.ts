import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';

it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in ', async () => {
    await request(app).post('/api/tickets').send({}).expect(401);
})

it('return a staus other than 401 if the user is signed in ', async () => {
    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});
    expect(response.status).not.toEqual(401);
})
it('reutrn an error if an invalid title is provide ', async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: '', price: 20 }).expect(400);

    const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ price: 20 });
    expect(response.status).toEqual(400);
})

it('return an error if an invalid price has been provided ', async () => {
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'test', price: -20 }).expect(400);

    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'test' }).expect(400);
})

it('create a ticket with valid parameters', async () => {
    /**get list of the tickets that has been created */
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'test ticket'
    await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price: 40 }).expect(200);

    tickets = await Ticket.find();
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
})