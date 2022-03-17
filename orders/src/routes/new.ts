import express, { Request, Response } from 'express';

const router = express();

router.post('/api/orders', async (req: Request, res: Response) => {});

export { router as createOrderRouter };
