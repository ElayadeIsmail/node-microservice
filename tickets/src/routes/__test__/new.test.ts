import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../model/Ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('only can access if the user is not signed in', () => {
  return request(app).post('/api/tickets').send({}).expect(401);
});
it('returns status other that 401 if user signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if the user provide invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '', price: 10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if the user provide invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'first ticket', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'first ticket' })
    .expect(400);
});

it('creates a tickets with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title = 'first ticket';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price: 20 })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

it('publisher an event', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title = 'first ticket';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price: 20 })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
