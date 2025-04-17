import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Ticket from '../../models/ticket_model';
import Order from '../../models/order_model';
import { OrderStatus } from '../../events/basics/orderStatus';
import { natsWrapper } from '../../nats-wrapper';

// test user is login
it('returns 401 if user is not login', async () => {
  await request(app).post('/api/v1/orders').send({}).expect(401);
});

// test input validation
it('returns 400 if input is invalid', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({})
    .expect(400);
  await request(app)
    .post('/api/v1/orders')
    .set({ Cookie: cookie })
    .send({ ticketId: '123456789' })
    .expect(400);
});

// test ticket not found in db === 404 error
it('returns 404 if ticket is not found', async () => {
  const cookie = await global.signup();
  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({ ticketId: '123456789' })
    .expect(400);
});

// test ticket is reserved === 400 error
it('returns 404 if ticket is reserved', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: 'movie', price: 20, id });
  await ticket.save();
  const order = Order.build({
    userId: '12356',
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});

// test  success order creation
it('returns 201 if order is successfully created', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({ title: 'movie', price: 20, id });
  await ticket.save();
  const cookie = await global.signup();
  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

// test order created event publish

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
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
