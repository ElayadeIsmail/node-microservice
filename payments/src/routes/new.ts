import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@eitickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('orderId').not().isEmpty().withMessage('order id is required'),
    body('token').not().isEmpty().withMessage('token id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('this order was cancelled');
    }
    await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    res.status(201).send({});
  }
);

export { router as createChargeRouter };
