import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets').send({});

    expect(response.status).not.toEqual(404);
})

it('can only be accessed if the user is signed in ', async () => {

})

it('reutrn an error if an invalid title is provide ', async () => {

})

it('return an error if an invalid price has been provided ', async () => {

})

it('create a ticket with valid parameters', async () => {

})