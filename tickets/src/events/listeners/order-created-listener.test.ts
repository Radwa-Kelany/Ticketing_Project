import { OrderCreatedListener } from './order-created-listener';
import { OrderCreatedEvent } from '../basics/order-create-event';
import { natsWrapper } from '../../nats-wrapper';
import { OrderStatus } from '../basics/orderStatus';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket.model';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 120,
    userId: '123',
  });
  await ticket.save();
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: '1-1-2001',
    ticket: {
      id: ticket.id,
      price: ticket.price,
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

it('returns success if order-created listener works', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
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
