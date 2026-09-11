import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import courseRouter from './course.routes.js';
import lectureRouter from './lecture.routes.js';
import materialRouter from './material.routes.js';
import generalSessionRouter from './generalSession.routes.js';
import attendanceRouter from './attendance.routes.js';
import sessionRouter from './session.routes.js';

const router = Router();

router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/courses', courseRouter);
router.use('/lectures', lectureRouter);
router.use('/materials', materialRouter);
router.use('/general-sessions', generalSessionRouter);
router.use('/attendance', attendanceRouter);
router.use('/sessions', sessionRouter);

export default router;
