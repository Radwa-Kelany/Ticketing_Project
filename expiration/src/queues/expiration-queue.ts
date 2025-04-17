import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface payload {
  orderId: string;
}

export const expirationQueue = new Queue<payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(job.data.orderId);
  // Emit expiration complete publisher
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    id: job.data.orderId,
  });
});

// The Goal of Bull and its queue is to create a channel(queue) that receives a data,
// sends to DB (Redis), then after a period , it call it again from DB and process it.
// So data here called job, to be done.
// when we call add method and pass the data to it, there is another argument that act as a timer for waiting period.
