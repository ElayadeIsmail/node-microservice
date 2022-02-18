import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns 404 if tickets not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it('returns ticket if tickets found', async () => {
  const title = 'Concert';
  const price = 20;
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title,
      price,
    })
    .expect(201);
  const { body: ticket } = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send()
    .expect(200);

  expect(ticket.title).toEqual(title);
  expect(ticket.price).toEqual(price);
});
