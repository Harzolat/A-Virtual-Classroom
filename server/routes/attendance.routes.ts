import { Router } from 'express';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';
import {
  recordAttendance,
  getAttendanceById,
  leaveAttendance,
  getAttendanceForLecture,
  getAttendanceForGeneralSession,
  getAttendanceForStudent,
  getAttendanceForCourse,
  getStudentAttendanceStats,
  getCourseAttendanceStats,
  getAdminAttendanceAudit,
} from '../controllers/attendance.controller.js';

const router = Router();

// 1. Record student attendance (Students and Admin)
router.post('/', authenticateUser, requireRole(['student', 'admin']), recordAttendance);

// 2. Admin institutional compliance audit
router.get('/audit', authenticateUser, requireRole(['admin']), getAdminAttendanceAudit);

// 3. Student attendance statistics and history
router.get('/student/:studentId/stats', authenticateUser, getStudentAttendanceStats);
router.get('/student/:studentId', authenticateUser, getAttendanceForStudent);

// 4. Course attendance and stats (Lecturer & Admin)
router.get('/course/:courseId/stats', authenticateUser, requireRole(['lecturer', 'admin']), getCourseAttendanceStats);
router.get('/course/:courseId', authenticateUser, requireRole(['lecturer', 'admin']), getAttendanceForCourse);

// 5. Lecture attendance (Course Lecturer & Admin)
router.get('/lecture/:lectureId', authenticateUser, requireRole(['lecturer', 'admin']), getAttendanceForLecture);

// 6. General Session attendance (Organizer & Admin)
router.get('/session/:sessionId', authenticateUser, requireRole(['lecturer', 'admin']), getAttendanceForGeneralSession);

// 7. Leave attendance (Record student departure time & duration)
router.patch('/:id/leave', authenticateUser, leaveAttendance);

// 8. Single attendance record by ID
router.get('/:id', authenticateUser, getAttendanceById);

export default router;
