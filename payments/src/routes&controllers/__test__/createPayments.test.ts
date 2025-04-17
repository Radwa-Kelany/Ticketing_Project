import request from 'supertest';

import stripe from '../../stripe';
import Order from '../../models/order.model';
import { app } from '../../app';
import mongoose from 'mongoose';
import { OrderStatus } from '../../events/basics/orderStatus';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if order not found in db', async () => {
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signup())
    .send({
      token: '1236',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns 401 if user is not authorized', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 120,
    userId: '123',
  });
  await order.save();
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signup())
    .send({
      token: '1236',
      orderId: order.id,
    })
    .expect(401);
});
it('returns 400 if order status is cancelled', async () => {
  const userIdOrder = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    price: 120,
    userId: userIdOrder,
  });
  await order.save();
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signup(userIdOrder))
    .send({
      token: '1236',
      orderId: order.id,
    })
    .expect(400);
});

it('returns success if stripe charges create evoke', async () => {});

it('returns 200 if payment success', async () => {
  let price = Math.floor(Math.random() * 100000);
  const userIdOrder = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: price,
    userId: userIdOrder,
  });
  await order.save();
  await request(app)
    .post('/api/v1/payments')
    .set('Cookie', global.signup(userIdOrder))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);
  const list = await stripe.charges.list({ limit: 10 });
  const stripeCharge = list.data.find((charge) => {
    return charge.amount === price * 100;
  });
  const updatedPrice = price * 100;
  expect(stripeCharge?.currency).toEqual('usd');
  expect(stripeCharge?.amount).toEqual(updatedPrice);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
