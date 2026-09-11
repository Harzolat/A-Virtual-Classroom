import { Router } from 'express';
import { LectureController } from '../controllers/lecture.controller.js';
import { authenticateUser, requireLecturerOrAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateUser, LectureController.getLectures);
router.get('/:lectureId', authenticateUser, LectureController.getLectureById);
router.post('/', authenticateUser, requireLecturerOrAdmin, LectureController.createLecture);
router.patch('/:lectureId/status', authenticateUser, requireLecturerOrAdmin, LectureController.updateLectureStatus);

export default router;
