import { Listener } from '../basics/base-listener';
import { OrderCancelledEvent } from '../basics/order-cancelled-event';
import { Subjects } from '../basics/subjects';
import { Stan, Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket.model';
import { NotFoundError } from '@rktick/common';
import TicketUpdatePublisher from '../publishers/ticket-update-publisher';
import { queueGroupName } from './queue-group-name';
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    // The ticket in tickets service will be updated by
    ticket.set({ orderId: undefined});
    await ticket.save();
    await new TicketUpdatePublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        orderId:ticket.orderId
      });
    msg.ack();
  }
}
