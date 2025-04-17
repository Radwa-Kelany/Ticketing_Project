import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
// is Route works
it('has route handler listening to /api/v1/tickets for post requests', async () => {
  const response = await request(app).post('/api/v1/tickets').send({});
  expect(response.status).not.toEqual(404);
});

// user isn't login in
it('returns 401 if user is not sign in', async () => {
  const response = await request(app)
    .post('/api/v1/tickets')
    .send({})
    .expect(401);
  expect(response.status).toEqual(401);
});
// is user login
it('returns rather than 401 if user is login', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({});
  expect(response.status).not.toEqual(401);
});

// validation input

it('returns 400 if input is invalid', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: '100',
    })
    .expect(400);
});

// successful create ticket
it('returns 201 if successful creation', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);
});

it('publishes an event', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
