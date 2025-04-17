import { Listener } from '../basics/base-listener';
import { OrderCreatedEvent } from '../basics/order-create-event';
import { Subjects } from '../basics/subjects';
import { Stan, Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket.model';
import { NotFoundError } from '@rktick/common';
import TicketUpdatePublisher from '../publishers/ticket-update-publisher';
import { queueGroupName } from './queue-group-name';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    // The ticket in tickets service will be updated by
    ticket.set({ orderId: data.id });
    await ticket.save();
    console.log(ticket)
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
