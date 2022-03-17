import express, { Request, Response } from 'express';

const router = express();

router.post('/orders', async (req: Request, res: Response) => {});

export { router as createOrderRouter };
