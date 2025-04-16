import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import request from 'supertest';

declare global {
  var signup: () => Promise<string[]>;
}

// 1- Initiate DB server and connect to it
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'Aasdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// 2- Before Each test we delete all documents in db
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// 3- After finish test close DB server
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = async () => {
  const response = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('failed to get cookie from sign up');
  }
  return cookie;
};
