import request from 'supertest';
import { app } from '../../app';
import Ticket from '../../models/ticket_model';
import mongoose from 'mongoose';

const ticketCreated = async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: id,
    title: 'movie',
    price: 35,
  });
  await ticket.save();
  return ticket;
};

it('fetches orders for particular user', async () => {
  const ticketOne = await ticketCreated();
  const ticketTwo = await ticketCreated();
  const ticketThree = await ticketCreated();

  const userOne = await global.signup();
  const userTwo = await global.signup();

  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  await request(app)
    .post('/api/v1/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/v1/orders')
    .set('Cookie', userTwo)
    .expect(200);
  console.log(response.body);
});
