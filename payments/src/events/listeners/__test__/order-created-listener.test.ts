import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent } from '../../basics/order-create-event';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import Order from '../../../models/order.model';
import mongoose from 'mongoose';
import { OrderStatus } from '../../basics/orderStatus';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id:  new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: '123',
    ticket: {
      id: '123',
      price: 120,
    },
  };
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('returns success order creation in Payments db', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order= await Order.findById(data.id);
    
  expect (order!.price).toEqual(data.ticket.price)

  expect(msg.ack).toHaveBeenCalled();
});
