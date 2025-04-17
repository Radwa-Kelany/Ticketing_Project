import { Router, Request, Response } from 'express';
import {
  requireAuth,
  validationRequest,
  BadRequestError,
  NotFoundError,
} from '@rktick/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import Ticket from '../models/ticket_model';
import Order from '../models/order_model';
import { OrderStatus } from '../events/basics/orderStatus';
import { natsWrapper } from '../nats-wrapper';
import orderCreatedPublisher from '../events/publishers/order-create-publisher';
const router = Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
  '/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket Id must be provided'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    await new orderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        title: ticket.title,
        id: ticket.id,
        price: ticket.price,
        // isReserved: ticket.isReserved(),
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrder };
