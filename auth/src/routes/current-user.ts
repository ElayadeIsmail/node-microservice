import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', async (req, res) => {
  console.log('Daaata', req.body);
  res.send('Hi there');
});

export { router as currentUserRouter };
