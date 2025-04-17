import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validationRequest,
} from '@rktick/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import Order from '../models/order.model';
import { OrderStatus } from '../events/basics/orderStatus';
import stripe from '../stripe';
import Payment from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { PaymentCreatedPublisher } from '../events/publishers/create-payment-publisher';

const router = Router();

router.post(
  '/',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Must provide valid value'),
    body('orderId').not().isEmpty().withMessage('Must provide valid value'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId != req.currentUser.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('something went wrong with this order');
    }
    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'usd',
      source: token,
    });
    const payment = Payment.build({
      orderId: order.id,
      stripId: charge.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId:order.id,
      stripeId:charge.id
    });

    res.status(201).send({ id:payment.id });
  
  }
);

export { router as createPaymentRouter };
