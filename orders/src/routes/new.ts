import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@eitickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCreatePublisher } from '../events/publishers/order-created-publisher';
import { Order } from '../models/Order';
import { Ticket } from '../models/Ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage('ticketID must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // find ticket in database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket Reserved');
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    new OrderCreatePublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
