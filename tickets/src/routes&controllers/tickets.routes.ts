import { Router } from 'express';
import { listTicketsRouter } from './listTickets.route';
import { createTicketRouter } from './postTicket.route';
import { getSingleTicketRouter } from './getTicket';
import { updateTicketRouter} from './updateTicket';

const ticketsRouter = Router();
ticketsRouter.use('/', listTicketsRouter);
ticketsRouter.use('/', createTicketRouter);
ticketsRouter.use('/', getSingleTicketRouter);
ticketsRouter.use('/', updateTicketRouter);

export default ticketsRouter;
