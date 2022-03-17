import express, { Request, Response } from 'express';

const router = express();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {});

export { router as showOrderRouter };
