import {
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '@rktick/common';
import { Router, Request, Response } from 'express';
import Order from '../models/order_model';
import Ticket from '../models/ticket_model';
import { OrderStatus } from '../events/basics/orderStatus';
import orderCancelledPublisher from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  const ticket = await Ticket.findById(order?.ticket.id);
  if (!order) {
    throw new NotFoundError();
  }
  if (!ticket) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  await new orderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: ticket.id,
    },
  });
  res.status(204).send({ order });
});

export { router as deleteOrder };
