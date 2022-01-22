import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/User';
import { PasswordManager } from '../services/password';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }
    const isMatch = await PasswordManager.compare(user.password, password);
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    req.session = {
      jwt: jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      ),
    };
    res.send(user);
  }
);

export { router as signInRouter };
