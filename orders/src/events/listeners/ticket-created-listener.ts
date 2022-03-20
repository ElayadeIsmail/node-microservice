import { Listener, Subjects, TicketCreatedEvent } from '@eitickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { price, title } = data;
    const ticket = Ticket.build({
      price,
      title,
    });
    await ticket.save;
    msg.ack();
  }
}
