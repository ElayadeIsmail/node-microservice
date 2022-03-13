import { requireAuth, validateRequest } from '@eitickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../model/Ticket';
// import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ price, title, userId: req.currentUser!.id });
    await ticket.save();
    // new TicketCreatedPublisher(client).publish({

    // })
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
