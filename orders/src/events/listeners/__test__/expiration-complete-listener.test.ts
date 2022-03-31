import { ExpirationCompleteEvent } from '@eitickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../../models/Order';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    userId: 'qsdqdqs',
    ticket,
  });
  await order.save();
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, order, ticket, data, msg };
};

it('updates order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('emits an Order Cancelled event', async () => {
  const { listener, data, order, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  //   expect(eventsData.id).toEqual(order.id);
});
it('acks the massage', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
