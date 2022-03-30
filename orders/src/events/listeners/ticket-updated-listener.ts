import { Listener, Subjects, TicketUpdatedEvent } from '@eitickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { price, title, id, version, orderId } = data;
    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({
      title,
      price,
      orderId,
    });
    await ticket.save();
    msg.ack();
  }
}
