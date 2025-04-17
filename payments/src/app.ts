require('dotenv').config();
import express from 'express';
import { Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError } from '@rktick/common';
import { errorHandler, authenticateUser } from '@rktick/common';
import cookieParser from 'cookie-parser';
import { paymentsRouter } from './routes&controllers/payments.routes';

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
app.use('/api/v1/payments', paymentsRouter)
app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
