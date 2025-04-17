import { TicketUpdateEvent } from '../basics/ticket-update-event';
import { Listener } from '../basics/base-listener';
import { Subjects } from '../basics/subjects';
import { Message, Stan } from 'node-nats-streaming';
import Ticket from '../../models/ticket_model';
import { NotFoundError } from '@rktick/common';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdateEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: TicketUpdateEvent['data'], msg: Message) {
    const {  title, price, } = data;
    const ticket = await Ticket.findByEvent(data);
    
    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
