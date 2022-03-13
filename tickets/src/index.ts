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
    await natsWrapper.connect('ticketing', 'qsqdq', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on PORT 3000!!!!');
  });
};

start();
