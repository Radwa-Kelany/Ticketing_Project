import request from 'supertest';
import { app } from '../../app';

it('clears cookie after sign out', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  const response = await request(app)
    .post('/api/v1/auth/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toBeFalsy();
});


