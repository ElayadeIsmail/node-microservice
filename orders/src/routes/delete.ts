import express, { Request, Response } from 'express';

const router = express();

router.delete('/orders/:id', async (req: Request, res: Response) => {});

export { router as deleteOrderRouter };
