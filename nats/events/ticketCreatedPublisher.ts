import Publisher  from './basics/base-publisher';
import { Subjects } from './basics/subjects';

import { TicketCreatedEvent } from './basics/ticket-create-event';
import { Stan } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  constructor(client: Stan) {
    super(client);
  }
}
