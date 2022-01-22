import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'qsdqsqdq', password: 'password' })
    .expect(400);
});
it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'qsdqsqdq', password: 'p' })
    .expect(400);
});
it('returns a 400 with messing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'sam@gmail.com', password: '' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ email: '', password: 'password' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  const data = { email: 'sam@gmail.com', password: 'password' };
  await request(app).post('/api/users/signup').send(data).expect(201);

  await request(app).post('/api/users/signup').send(data).expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'sam@gmail.com', password: 'password' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
