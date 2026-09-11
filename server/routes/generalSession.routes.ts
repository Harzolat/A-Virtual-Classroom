import { Router } from 'express';
import { GeneralSessionController } from '../controllers/generalSession.controller.js';
import { authenticateUser, requireLecturerOrAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// All general session routes require authentication
router.use(authenticateUser);

// Read routes accessible to all authenticated roles
router.get('/', GeneralSessionController.getGeneralSessions);
router.get('/:id', GeneralSessionController.getGeneralSessionById);

// Write routes restricted to lecturer and admin (with service-level organizer ownership check)
router.post('/', requireLecturerOrAdmin, GeneralSessionController.createGeneralSession);
router.patch('/:id', requireLecturerOrAdmin, GeneralSessionController.updateGeneralSession);
router.delete('/:id', requireLecturerOrAdmin, GeneralSessionController.deleteGeneralSession);

export default router;
