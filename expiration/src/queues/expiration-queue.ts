import Queue from 'bull';
import { ExpirationCompletedPublisher } from '../events/publishers/expiration-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async ({ data }) => {
  new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: data.orderId,
  });
});

export { expirationQueue };
