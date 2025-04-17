require('dotenv').config();
import express from 'express';
import { Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import ticketsRouter from './routes&controllers/tickets.routes';
// import { NotFoundError } from './src/errors/customError';
import { NotFoundError } from '@rktick/common';
// import { errorHandler } from './src/middlewares/errorHandlerMiddleware'
import { errorHandler, authenticateUser } from '@rktick/common';
import cookieParser from 'cookie-parser';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV != 'test'
    secure:false
  })
);

app.use(authenticateUser)
app.use('/api/v1/tickets',ticketsRouter)
app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
