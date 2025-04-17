import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  NotAuthorizedError,
  validationRequest,
  NotFoundError,
  BadRequestError,
} from '@rktick/common';

import Ticket from '../models/ticket.model';
import { natsWrapper } from '../nats-wrapper';
import TicketUpdatePublisher from '../events/publishers/ticket-update-publisher';

const router = Router();
router.put(
  '/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Must provide a title'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.orderId) {
      throw new BadRequestError('Can not update reserved ticket ');
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    await new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(200).send( ticket );
  }
);

export { router as updateTicketRouter };
