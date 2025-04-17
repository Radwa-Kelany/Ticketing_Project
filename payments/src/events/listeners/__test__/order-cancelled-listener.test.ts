import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import Order from '../../../models/order.model';
import mongoose from 'mongoose';
import { OrderStatus } from '../../basics/orderStatus';
import { OrderCancelledEvent } from '../../basics/order-cancelled-event';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    price: 120,
    userId: '123',
  });
  await order.save();
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: '123',
    },
  };
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('returns success order cancelled', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);


  expect(order?.status).toEqual(OrderStatus.Cancelled)

  expect(msg.ack).toHaveBeenCalled();
});
