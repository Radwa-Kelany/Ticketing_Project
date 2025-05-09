import { Router, Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import { NotFoundError } from '@rktick/common';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.status(200).send( ticket );
});

export { router as getSingleTicketRouter };
