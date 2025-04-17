import { Listener } from '../basics/base-listener';
import { OrderCancelledEvent } from '../basics/order-cancelled-event';
import { Subjects } from '../basics/subjects';
import { Stan, Message } from 'node-nats-streaming';
import Order from '../../models/order.model';
import { queueGroupName } from './queue-group-name';

import { NotFoundError } from '@rktick/common';
import { OrderStatus } from '../basics/orderStatus';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new NotFoundError();
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
