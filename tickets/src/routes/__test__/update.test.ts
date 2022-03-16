import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if provided id does not exit', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'Concert',
      price: 20,
    })
    .expect(404);
});
it('returns a 401 if user not authenticate', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Concert',
      price: 20,
    })
    .expect(401);
});
it('returns a 401 if user does not owen the ticket', async () => {
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
      title: 'Concert',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', signin())
    .send({
      title: 'Concert',
      price: 15,
    })
    .expect(401);
});
it('returns a 400 if user provide invalid title or price', async () => {
  const cookie = signin();
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: -10,
    })
    .expect(400);
});
it('updates tickets ', async () => {
  const cookie = signin();
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 15,
    })
    .expect(200);
  const { body: ticket } = await request(app)
    .get(`/api/tickets/${body.id}`)
    .send();
  expect(ticket.title).toEqual('new title');
  expect(ticket.price).toEqual(15);
});

it('published an event', async () => {
  const cookie = signin();
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Concert',
      price: 20,
    });
  await request(app)
    .put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 15,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
