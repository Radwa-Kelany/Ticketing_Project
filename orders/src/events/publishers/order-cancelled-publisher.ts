import Publisher from '../basics/base-publisher';
import { Subjects } from '../basics/subjects';
import { OrderCancelledEvent } from '../basics/order-cancelled-event';
import { Stan } from 'node-nats-streaming';
class orderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  constructor(client: Stan) {
    super(client);
  }
}

export default orderCancelledPublisher;
