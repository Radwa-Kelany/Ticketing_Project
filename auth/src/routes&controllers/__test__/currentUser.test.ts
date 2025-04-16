import request from 'supertest';
import { app } from '../../app';

// check req.currentUser

it('returns req.currentUser with username', async () => {
const cookie= await global.signup()

  const response = await request(app)
    .get('/api/v1/auth/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.username).toEqual('radwa');
});


it('returns  req.currentUser == null', async()=>{
    const response = await request(app)
    .get('/api/v1/auth/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
})