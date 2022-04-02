import { Listener, OrderCreatedEvent, Subjects } from '@eitickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      version: data.version,
      price: data.ticket.price,
      status: data.status,
    });
    await order.save();
    msg.ack();
  }
}
