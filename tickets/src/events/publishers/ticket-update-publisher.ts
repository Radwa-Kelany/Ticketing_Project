import Publisher from '../basics/base-publisher';
import { Subjects } from '../basics/subjects';
import { TicketUpdateEvent } from '../basics/ticket-update-event';
import { Stan } from 'node-nats-streaming';
class TicketUpdatePublisher extends Publisher<TicketUpdateEvent> {
  readonly subject = Subjects.TicketUpdated;
  constructor(client: Stan) {
    super(client);
  }
}

export default TicketUpdatePublisher;
