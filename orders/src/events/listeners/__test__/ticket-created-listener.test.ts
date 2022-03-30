import { TicketCreatedEvent } from '@eitickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create an instance for the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message };
};

it('creates and saves a ticket', async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + object message
  await listener.onMessage(data, message);
  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('ACKs the message', async () => {
  const { listener, data, message } = await setup();
  // call the onMessage function with the data object + object message
  await listener.onMessage(data, message);
  // write assertion to make sure a ticket was created
  expect(message.ack).toHaveBeenCalled();
});
