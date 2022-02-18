import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', signin()).send({
    title: 'Concert',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  await Promise.all([createTicket(), createTicket(), createTicket()]);
  const { body } = await request(app).get('/api/tickets').send({}).expect(200);

  expect(body.length).toEqual(3);
});
