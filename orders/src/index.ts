import mongoose from 'mongoose';
import { app } from './app';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const main = async () => {
  console.log('Staaarting !!!!!');

  if (!process.env.JWT_KEY) {
    throw new Error('Jwt must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo_url must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  try {
    // connecting to nats
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    // close nats
    natsWrapper.client.on('close', () => {
      console.log('Closing Nats ');
      process.exit();
    });
    // CALL nats close function after trying to shut dow process
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    // start listening to ticket created event
    new TicketCreatedListener(natsWrapper.client).listen();
    // start listening to ticket updated event
    new TicketUpdatedListener(natsWrapper.client).listen();

    new ExpirationCompleteListener(natsWrapper.client).listen();

    new PaymentCreatedListener(natsWrapper.client).listen();
    // mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected Successfully to MongoDB');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on PORT 3000!!!!');
  });
};

main();
