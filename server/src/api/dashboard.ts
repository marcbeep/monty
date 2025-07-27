import { Router, Request, Response } from 'express';
import { success } from '../utils/response';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Placeholder for dashboard data
  return success(res, { message: 'Dashboard endpoint' });
});

export default router; 