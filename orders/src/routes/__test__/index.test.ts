import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

it('fetches orders for a particular user', async () => {
  // create three tickets
  const [ticketOne, ticketTwo, ticketThree] = await Promise.all([
    buildTicket(),
    buildTicket(),
    buildTicket(),
  ]);
  // create one order as user number one
  const userOne = signin();
  const userTwo = signin();

  await request(app).post('/api/orders').set('Cookie', userOne).send({
    ticketId: ticketOne.id,
  });

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketTwo.id,
    });
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({
      ticketId: ticketThree.id,
    });
  const { body } = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);
  // create two orders os user number two
  expect(body.length).toEqual(2);
  expect(body[0].id).toEqual(orderOne.id);
  expect(body[1].id).toEqual(orderTwo.id);
  expect(body[0].ticket.id).toEqual(ticketTwo.id);
  expect(body[1].ticket.id).toEqual(ticketThree.id);
});
