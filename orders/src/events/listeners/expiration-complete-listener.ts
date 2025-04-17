import { Listener } from '../basics/base-listener';
import { ExpirationCompleteEvent } from '../basics/expiration-complete-event';
import { Stan, Message } from 'node-nats-streaming';
import { Subjects } from '../basics/subjects';
import Order from '../../models/order_model';
import mongoose from 'mongoose';
import { NotFoundError } from '@rktick/common';
import { OrderStatus } from '../basics/orderStatus';
import orderCancelledPublisher from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';
import { version } from 'os';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order_array = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.id),
        },
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'ticket',
          foreignField: '_id',
          as: 'ticket',
        },
      },
      {
        $unwind: '$ticket',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          expiresAt: 1,
          createdAt: 1,
          userId: 1,
          version: 1,
          'ticket.title': 1,
          'ticket.id': 1,
        },
      },
    ]);
    const order = order_array[0];

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new orderCancelledPublisher(this.client).publish({
      id: order._id,
      version: order.version,
      ticket: {
        id: order?.ticket.id,
      },
    });
    msg.ack();
  }
}
