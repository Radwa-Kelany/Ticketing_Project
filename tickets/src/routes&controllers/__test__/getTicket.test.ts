import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

// check no such ticket in DB

it('returns 404 if ticket not found', async () => {
const id= new mongoose.Types.ObjectId().toHexString()
  const response = await request(app)
    .get(`/api/v1/tickets/${id}`)
    .expect(404)
});

// ticket is found

it('returns 200 if ticket found', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    })
    .expect(201);

  await request(app)
    .get(`/api/v1/tickets/${response.body.ticket.id }`).send()
    .expect(200);
});
