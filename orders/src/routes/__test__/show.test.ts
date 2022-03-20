import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('fetches an order', async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'concert',
  });
  await ticket.save();
  const cookie = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id,
    })
    .set('Cookie', cookie)
    .expect(201);
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .expect(200);
  expect(response.body.id).toEqual(order.id);
});
it('returns 401 if user tried to fetch order that belongs to another user', async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'concert',
  });
  await ticket.save();
  const cookie = signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id,
    })
    .set('Cookie', cookie)
    .expect(201);
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .expect(401);
});
