import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidatorError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must provide a password'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }
    res.send('Hi there');
  }
);

export { router as signInRouter };
