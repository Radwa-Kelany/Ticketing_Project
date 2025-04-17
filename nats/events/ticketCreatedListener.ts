import { TicketCreatedEvent } from './basics/ticket-create-event';
import { Listener } from './basics/base-listener';
import { Subjects } from './basics/subjects';
import { Message,Stan } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';
  constructor(client: Stan) {
    super(client);
  }
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    msg.ack();
  }
}
