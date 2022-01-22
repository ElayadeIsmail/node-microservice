import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
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
