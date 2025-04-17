import { Router, Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import { BadRequestError } from '@rktick/common';

const router = Router();

router.get('/', async(req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId:undefined
  });
  
  if(!tickets){
    throw new BadRequestError("No tickets available")
  }
  res.status(200).send( tickets );
});

export { router as listTicketsRouter };
