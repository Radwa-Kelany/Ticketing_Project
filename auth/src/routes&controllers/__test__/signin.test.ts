import request from 'supertest';
import { app } from '../../app';

// request validation
it('returns 400 on invalid input', async () => {
  await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'trrtr',
      password: 'password',
    })
    .expect(400);
  await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
});
// existed user email in DB to avoid doubled email
it('returns 400 on existed user', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'test123@test.com',
      password: 'password',
    })
    .expect(400);
});

// match password
it('returns 400 on unmatched password', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'test@test.com',
      password: 'password123',
    })
    .expect(400);
});

// return cookie
it('returns cookie in request header', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  const response = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  expect(response.get('Set-Cookie')).toBeDefined();
});
// successful signin
it('returns  201 in successful sign in', async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      username: 'radwa',
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  const response = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
