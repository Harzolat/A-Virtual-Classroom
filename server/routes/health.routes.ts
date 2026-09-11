import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ND2 Virtual Classroom API is running'
  });
});

export default router;
