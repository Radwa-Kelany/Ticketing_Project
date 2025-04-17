import Publisher from '../basics/base-publisher';
import { OrderCompleteEvent } from '../basics/order-complete-event';
import { Subjects } from '../basics/subjects';
import { Stan } from 'node-nats-streaming';

export class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
  readonly subject = Subjects.OrderUpdated;
  constructor(client: Stan) {
    super(client);
  }
}
