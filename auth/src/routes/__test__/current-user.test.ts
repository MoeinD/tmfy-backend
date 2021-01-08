import request from 'supertest';

import { app } from '../../app';
import { response } from 'express';

it('responds with details aboout the current user ', async () => {
    // const authResponse = await request(app).post('/api/users/signup').send({
    //     email: 'test@test.com',
    //     password: 'password'
    // }).expect(201);
    const cookie = await global.signin();

    const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('respond with null if not authenticated ', async () => {
    const response = await request(app)
        .get('/api/users/currentuser').send().
        expect(200);
    expect(response.body.currentUser).toBeNull();
})
