require('dotenv').config()
import express from 'express';
import { Request, Response } from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import authRouter from './routes&controllers/auth.routes';
// import { NotFoundError } from './src/errors/customError';
import { NotFoundError } from '@rktick/common';
// import { errorHandler } from './src/middlewares/errorHandlerMiddleware'
import { errorHandler } from '@rktick/common'
import cookieParser from 'cookie-parser';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    // secure:process.env.NODE_ENV != "test"
    secure:false
  })
);

app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.post('/api/v1/auth/test', (req, res) => {
  res.send('success to server');
});

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
