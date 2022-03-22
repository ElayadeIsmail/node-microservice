import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@eitickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { price, title, id } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
