import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(id?: string): string[];
        }
    }
}
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51IQAFqDQpPWenNPaIeRpYwn6L647Ws18C9J2rYuUW1AuxopK7QLTErCjjqbOdsv2M1YcTvpAM985hEsd99BDlLrf004WRQp9fo';

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'test';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

/**make sure to remove all the collection before start any new test */
beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

/**stop and close every things after finishing the test */
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = (userid?: string) => {
    //build a JWT payload . {id , email}
    const id = userid || mongoose.Types.ObjectId().toHexString();
    const payload = {
        id,
        email: 'test@test.com'
    }
    //create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //build session object . { jwt : my_jwt}
    const session = { jwt: token };

    //turn that session into JSON
    const sessionJSON = JSON.stringify(session);
    /**take JSON and encode it as base64 */
    const base64 = Buffer.from(sessionJSON).toString('base64');

    /**return a string thats the cookie with the encoded data 
     * this is the format that we can see in the development tools
     * and we need to chek the network tab and check the header for it
    */

    return [`express:sess=${base64}`];
}