import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { AttendanceService } from '../services/attendance.service.js';

export async function recordAttendance(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      studentId,
      courseId,
      lectureId,
      generalSessionId,
      date,
      timeJoined,
      timeLeft,
      durationMinutes,
      status,
      reason,
    } = req.body;

    const attendance = await AttendanceService.recordAttendance(
      {
        studentId,
        courseId,
        lectureId,
        generalSessionId,
        date,
        timeJoined,
        timeLeft,
        durationMinutes,
        status,
        reason,
      },
      req.user
    );

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully.',
      data: attendance,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to record attendance.',
    });
  }
}

export async function getAttendanceById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const attendance = await AttendanceService.getAttendanceById(id, req.user);

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve attendance record.',
    });
  }
}

export async function leaveAttendance(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { id } = req.params;
    const { timeLeft, status, reason } = req.body;

    const updated = await AttendanceService.leaveAttendance(
      id,
      { timeLeft, status, reason },
      req.user
    );

    res.status(200).json({
      success: true,
      message: 'Leave time recorded successfully.',
      data: updated,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to record leave time.',
    });
  }
}

export async function getAttendanceForLecture(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { lectureId } = req.params;
    const records = await AttendanceService.getAttendanceForLecture(lectureId, req.user);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve lecture attendance.',
    });
  }
}

export async function getAttendanceForGeneralSession(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { sessionId } = req.params;
    const records = await AttendanceService.getAttendanceForGeneralSession(sessionId, req.user);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve session attendance.',
    });
  }
}

export async function getAttendanceForStudent(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { studentId } = req.params;
    const { courseId } = req.query;

    const records = await AttendanceService.getAttendanceForStudent(
      studentId,
      req.user,
      typeof courseId === 'string' ? courseId : undefined
    );

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve student attendance history.',
    });
  }
}

export async function getAttendanceForCourse(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { courseId } = req.params;
    const records = await AttendanceService.getAttendanceForCourse(courseId, req.user);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to retrieve course attendance.',
    });
  }
}

export async function getStudentAttendanceStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { studentId } = req.params;
    const stats = await AttendanceService.getStudentAttendanceStats(studentId, req.user);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to compute student attendance statistics.',
    });
  }
}

export async function getCourseAttendanceStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { courseId } = req.params;
    const stats = await AttendanceService.getCourseAttendanceStats(courseId, req.user);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to compute course attendance statistics.',
    });
  }
}

export async function getAdminAttendanceAudit(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const audit = await AttendanceService.getAdminAttendanceAudit(req.user);

    res.status(200).json({
      success: true,
      data: audit,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to generate institutional attendance audit.',
    });
  }
}
