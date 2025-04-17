import { PaymentCreatedEvent } from '../basics/payment-create-event';
import { Listener } from '../basics/base-listener';
import { Stan, Message } from 'node-nats-streaming';
import { Subjects } from '../basics/subjects';
import Order from '../../models/order_model';
import { OrderStatus } from '../basics/orderStatus';
import { NotFoundError } from '@rktick/common';
import { OrderCompletePublisher } from '../publishers/order-complete-publisher';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    await new OrderCompletePublisher(this.client).publish({
      orderId: order.id,
      version: order.version,
    });
    msg.ack();
  }
}
