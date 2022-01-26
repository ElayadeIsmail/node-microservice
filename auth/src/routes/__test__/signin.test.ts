import request from 'supertest';
import { app } from '../../app';

it('fails when signin with email that does not exist', () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(400);
});
it('it fails when signin with invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(201);
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'sam@gmail.com', password: 'passw' })
    .expect(400);
});
it('it response with a cookie when valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(201);
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
