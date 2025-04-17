import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import Ticket from '../../models/ticket.model';

// if user is not login
it('returns 401 if user is not login', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/v1/tickets/${id}`).send({});
  expect(response.status).toEqual(401);
});

// validate ticket input
it('returns 400 if input is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.signup();
  await request(app)
    .put(`/api/v1/tickets/${id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
  await request(app)
    .put(`/api/v1/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
    })
    .expect(400);
  await request(app)
    .put(`/api/v1/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fgtr',
      price: -320,
    })
    .expect(400);
});
// is ticket id found in DB
it('returns 404 if ticket id is not in DB', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.signup();
  const response = await request(app)
    .put(`/api/v1/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(404);
});

// if user is not authorized
it('returns 401 if user is not authorized', async () => {
  const cookie1 = await global.signup();
  const cookie2 = await global.signup();
  const createResponse = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie1)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/v1/tickets/${createResponse.body.ticket.id}`)
    .set('Cookie', cookie2)
    .send({
      title: 'movie',
      price: 500,
    })
    .expect(401);
});
// if ticket is reserved
it('returns 400 if ticket is reserved', async () => {
  const cookie1 = await global.signup();
  const createResponse = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie1)
    .send({
      title: 'concert',
      price: 100,
    });
  const ticket = await Ticket.findById(createResponse.body.ticket.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();
  await request(app)
    .put(`/api/v1/tickets/${createResponse.body.ticket.id}`)
    .set('Cookie', cookie1)
    .send({
      title: 'movie',
      price: 500,
    })
    .expect(400);
});

// successful update
it('returns success ticket update ', async () => {
  const cookie = await global.signup();
  const createResponse = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/v1/tickets/${createResponse.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 500,
    })
    .expect(200);
  const getResponse = await request(app)
    .get(`/api/v1/tickets/${createResponse.body.ticket.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(getResponse.body.ticket.title).toEqual('movie');
  expect(getResponse.body.ticket.price).toEqual(500);
});

it('Published an event', async () => {
  const cookie = await global.signup();
  const createResponse = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);

  const updateResponse = await request(app)
    .put(`/api/v1/tickets/${createResponse.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'movie',
      price: 500,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
