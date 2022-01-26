import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongod: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'qsdfgh';
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  // connect mongoose to mongoService
  await mongoose.connect(uri);
});

beforeEach(async () => {
  // get all collections and remove all collections after each test
  const collections = await mongoose.connection.db.collections();
  collections.forEach(async (col) => {
    await col.deleteMany({});
  });
});

afterAll(async () => {
  // The Server can be stopped again with
  await mongod.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  return response.get('Set-Cookie');
};
