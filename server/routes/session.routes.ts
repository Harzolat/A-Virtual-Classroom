import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { SessionController } from '../controllers/session.controller.js';

const router = Router();

// All session participation and engine routes require JWT authentication
router.post('/:type/:id/join', authenticateUser, SessionController.joinSession);
router.post('/:type/:id/leave', authenticateUser, SessionController.leaveSession);
router.get('/:type/:id/participants', authenticateUser, SessionController.getSessionParticipants);
router.get('/:type/:id/my-status', authenticateUser, SessionController.getMySessionStatus);

export default router;
