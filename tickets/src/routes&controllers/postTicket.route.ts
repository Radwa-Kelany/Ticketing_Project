import { Router, Request, Response } from 'express';
import {
  requireAuth,
  validationRequest,
  NotAuthorizedError,
} from '@rktick/common';
import { body } from 'express-validator';
import Ticket from '../models/ticket.model';
import TicketCreatedPublisher from '../events/publishers/ticket-create-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = Router();
router.post(
  '/',
  requireAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4, max: 50 })
      .withMessage('Title must be at least 10 characters'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must positive'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket );
  }
);

export { router as createTicketRouter };
