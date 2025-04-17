import { TicketUpdatedListener } from '../ticket-update-listener';
import { TicketUpdateEvent } from '../../basics/ticket-update-event';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket_model';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: id,
    title: 'concert',
    price: 200,
  });
  await ticket.save();
  const data: TicketUpdateEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'New concert',
    price: 300,
    userId: '123',
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return {
    listener,
    data,
    msg,
    ticket,
  };
};
it('returns ticket updated in tickets db', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);
  expect(ticket!.title).not.toEqual(data.title);
  expect(ticket!.price).not.toEqual(data.price);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);

  expect(msg.ack).toHaveBeenCalled();
});
it('returns ticket not found in tickets db', async () => {
  const { listener, data, msg, ticket } = await setup();
  data.version = 100;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
