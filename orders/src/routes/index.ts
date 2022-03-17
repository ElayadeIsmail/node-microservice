import express, { Request, Response } from 'express';

const router = express();

router.get('/orders', async (req: Request, res: Response) => {});

export { router as indexOrderRouter };
