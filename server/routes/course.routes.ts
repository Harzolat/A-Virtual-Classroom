import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateUser, CourseController.getCourses);
router.get('/:courseId', authenticateUser, CourseController.getCourseById);

export default router;
