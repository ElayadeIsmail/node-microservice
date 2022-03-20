import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

it('should return 401 if user not authorized', () => {
  return request(app)
    .post('/api/orders')
    .send({
      ticketId: new mongoose.Types.ObjectId(),
    })
    .expect(401);
});
it('should return 400 if ticketId id not provided', () => {
  return request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId: '',
    })
    .expect(400);
});
it('should return 400 if ticketId not mongodb id', () => {
  return request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId: '123',
    })
    .expect(400);
});
it('should return 404 if ticket not found', async () => {
  const cookie = signin();
  return request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('should return 400 if ticket was reserved', async () => {
  const ticket = Ticket.build({ price: 20, title: 'concert' });
  await ticket.save();
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket: ticket,
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('should return 201 if Order was created', async () => {
  const cookie = signin();
  const ticket = Ticket.build({ price: 20, title: 'concert' });
  await ticket.save();
  return request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it('emits an order created event', async () => {
  const cookie = signin();
  const ticket = Ticket.build({ price: 20, title: 'concert' });
  await ticket.save();
  return request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
