import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@eitickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order does not exist');
    }
    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  }
}
