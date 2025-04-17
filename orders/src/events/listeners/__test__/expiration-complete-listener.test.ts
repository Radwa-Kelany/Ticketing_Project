import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { ExpirationCompleteEvent } from '../../basics/expiration-complete-event';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import Ticket from '../../../models/ticket_model';
import Order from '../../../models/order_model';
import mongoose from 'mongoose';
import { OrderStatus } from '../../basics/orderStatus';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'movie',
    price: 12,
  });
  await ticket.save();

  const order = Order.build({
    userId: '123',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    id: order.id,
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
    order,
  };
};

it('returns success when order status is cancelled', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  const updateOrder = await Order.findById(order.id);
  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});
