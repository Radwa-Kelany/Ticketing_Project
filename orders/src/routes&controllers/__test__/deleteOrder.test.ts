import request from 'supertest';
import { app } from '../../app';

import Ticket from '../../models/ticket_model';
import mongoose from 'mongoose';
import { OrderStatus } from '../../events/basics/orderStatus';
import Order from '../../models/order_model';
import { natsWrapper } from '../../nats-wrapper';

const ticketCreated = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'movie',
    price: 35,
    id,
  });
  await ticket.save();
  return ticket;
};

it('returns 401 user not login', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).get(`/api/v1/orders/${id}`).send().expect(401);
});

it('returns 404 order not found', async () => {
  const id = new mongoose.Types.ObjectId();

  const cookie = await global.signup();

  await request(app)
    .get(`/api/v1/orders/${id}`)
    .set('Cookie', cookie)
    .send()
    .expect(404);
});

it('returns 401 user is not the owner of order', async () => {
  const ticket = await ticketCreated();
  const userOne = await global.signup();
  const userTwo = await global.signup();
  const response = await request(app)
    .post('/api/v1/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/v1/orders/${response.body.order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('returns 200  if order cancelled', async () => {
  const ticket = await ticketCreated();
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/v1/orders/${response.body.order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
  const updatedOrder = await Order.findById(response.body.order.id);
  expect(response.body.order.status).not.toEqual(OrderStatus.Cancelled);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

// test publish event
it('publish an event', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: 'movie', price: 20, id });
  await ticket.save();
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .delete(`/api/v1/orders/${response.body.order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
