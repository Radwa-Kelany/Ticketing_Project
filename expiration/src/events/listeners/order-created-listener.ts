import { OrderCreatedEvent } from '../basics/order-create-event';
import { Subjects } from '../basics/subjects';
import { Listener } from '../basics/base-listener';
import { Message, Stan } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = 'expiration-service';
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('waiting', delay);
    expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
