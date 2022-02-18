import request from 'supertest';
import { app } from '../../app';

it('response with details about current user', async () => {
  const cookie = await signin();
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('response with null if not authorized', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
