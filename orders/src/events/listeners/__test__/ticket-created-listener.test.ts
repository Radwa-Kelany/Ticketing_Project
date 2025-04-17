import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '../../basics/ticket-create-event';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket_model';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: id,
    title: 'concert',
    price: 200,
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
  };
};
it('returns ticket created in tickets db', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(msg.ack).toHaveBeenCalled();
});
