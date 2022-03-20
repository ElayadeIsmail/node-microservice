import { OrderCreatedEvent, Publisher, Subjects } from '@eitickets/common';

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
