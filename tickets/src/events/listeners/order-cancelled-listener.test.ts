import { OrderCancelledListener } from './order-cancelled-listener';
import { OrderCancelledEvent } from '../basics/order-cancelled-event';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '../basics/orderStatus';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket.model';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 120,
    userId: '123',
  });
  ticket.set({ orderId });
  await ticket.save();
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return {
    ticket,
    listener,
    data,
    msg,
  };
};

it('returns success if order-cancelled listener works', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toEqual(data.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});

it('returns failure if ticket not at DB', async () => {
  const { listener, ticket, data, msg } = await setup();
  const id = new mongoose.Types.ObjectId().toHexString();
  data.ticket.id = id;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
