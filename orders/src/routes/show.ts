import express, { Request, Response } from 'express';

const router = express();

router.get('/orders/:id', async (req: Request, res: Response) => {});

export { router as showOrderRouter };
