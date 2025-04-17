import request from 'supertest';
import { app } from '../../app';

import Ticket from '../../models/ticket_model';
import mongoose from 'mongoose';
const id = new mongoose.Types.ObjectId().toHexString();
const ticketCreated = async () => {
  const ticket = Ticket.build({
    id: id,
    title: 'movie',
    price: 35,
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

it('returns 200 user is  the owner of order', async () => {
  const ticket = await ticketCreated();
  const userOne = await global.signup();
  const response = await request(app)
    .post('/api/v1/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/v1/orders/${response.body.order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);
});
