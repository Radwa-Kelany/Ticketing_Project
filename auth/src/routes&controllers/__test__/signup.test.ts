import request from 'supertest';
import { app } from '../../app';

// request validation
it('returns a 400 on invalid input', async () => {
  return request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'ra',
      email: 'testtest.com',
      password: 'pd',
    })
    .expect(400);
});
// non-existed email in DB
it('returns a 400 on non-existed email', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});
// return cookie
it('returns cookie in request header', async () => {
  const response = await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
// successful sign up
it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
