import { TicketCreatedEvent } from '../basics/ticket-create-event';
import { Listener } from '../basics/base-listener';
import { Subjects } from '../basics/subjects';
import { Message, Stan } from 'node-nats-streaming';
import Ticket from '../../models/ticket_model';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    
    msg.ack();
  }
}
