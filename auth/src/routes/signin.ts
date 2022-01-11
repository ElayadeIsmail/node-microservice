import express from 'express';

const router = express.Router();

router.post('/api/users/signin', async (req, res) => {
  console.log('Daaata', req.body);
  res.send('Hi there');
});

export { router as signInRouter };
