import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@eitickets/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/Order';

const router = express();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
