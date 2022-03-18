import { requireAuth, validateRequest } from '@eitickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express();

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
    res.send({});
  }
);

export { router as createOrderRouter };
