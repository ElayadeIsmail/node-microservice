import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('Jwt must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo_url must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
    await natsWrapper.connect('ticketing', 'qsqdq', 'http://nats-srv:4222');
    // close nats
    natsWrapper.client.on('close', () => {
      console.log('Closing Nats ');
      process.exit();
    });
    // CALL nats close function after trying to shut dow process
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on PORT 3000!!!!');
  });
};

start();
