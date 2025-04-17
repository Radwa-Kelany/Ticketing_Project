import Publisher from '../basics/base-publisher';
import { Subjects } from '../basics/subjects';
import { OrderCreatedEvent } from '../basics/order-create-event';
import { Stan } from 'node-nats-streaming';
class orderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  constructor(client: Stan) {
    super(client);
  }
}

export default orderCreatedPublisher;
