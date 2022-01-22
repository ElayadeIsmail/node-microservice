import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/currentuser', async (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }
  const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
  res.send('Hi there');
});

export { router as currentUserRouter };
