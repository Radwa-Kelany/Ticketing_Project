import Order from '../../models/order.model';
import { Listener } from '../basics/base-listener';
import { OrderCreatedEvent } from '../basics/order-create-event';
import { OrderStatus } from '../basics/orderStatus';
import { Subjects } from '../basics/subjects';
import { Message, Stan } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
