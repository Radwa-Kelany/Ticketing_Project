import Publisher from '../basics/base-publisher';
import { ExpirationCompleteEvent } from '../basics/expiration-complete-event';

import { Stan } from 'node-nats-streaming';
import { Subjects } from '../basics/subjects';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  constructor(client: Stan) {
    super(client);
  }
}
