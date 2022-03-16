import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongod: MongoMemoryServer;

beforeAll(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  // build a JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session Object {JWT: MY_JWT}
  const session = { jwt: token };
  // Turn that session to json
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
