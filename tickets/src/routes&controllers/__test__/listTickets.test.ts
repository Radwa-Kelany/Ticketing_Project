import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/v1/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 100,
    });
};

//
it('return 200 if tickets are retrieved from db', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app)
    .get(`/api/v1/tickets/`)
    .send()
    .expect(200);
});

// No tickets
it('return 200 if tickets are retrieved from db', async () => {
  const response = await request(app)
    .get(`/api/v1/tickets/`)
    .send()
    expect(400)
    expect(response.body.tickets).not.toBeDefined()

});

