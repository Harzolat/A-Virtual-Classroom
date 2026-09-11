import { Response } from 'express';
import mongoose, { Types } from 'mongoose';
import { Lecture } from '../models/Lecture.js';
import { Course } from '../models/Course.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class LectureController {
  static async getLectures(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      let query: any = {};

      if (role === 'student') {
        const enrolled = await Course.find({ enrolledStudents: new Types.ObjectId(userId) }).select('_id');
        const courseIds = enrolled.map((c) => c._id);
        query = courseIds.length > 0 ? { course: { $in: courseIds } } : {};
      } else if (role === 'lecturer') {
        const assigned = await Course.find({ lecturer: new Types.ObjectId(userId) }).select('_id');
        const courseIds = assigned.map((c) => c._id);
        query = {
          $or: [
            { course: { $in: courseIds } },
            { lecturer: new Types.ObjectId(userId) },
          ],
        };
      } else if (role === 'admin') {
        query = {};
      }

      const lectures = await Lecture.find(query)
        .populate('course', 'code title department creditUnit semester description')
        .populate('lecturer', 'name email department avatar status staffId designation office')
        .sort({ scheduledDate: 1, startTime: 1 });

      res.status(200).json({ success: true, data: lectures });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch lectures' });
    }
  }

  static async getLectureById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { lectureId } = req.params;
      let query: any = {};
      if (mongoose.Types.ObjectId.isValid(lectureId)) {
        query = { _id: lectureId };
      } else {
        query = { meetingId: lectureId };
      }

      const lecture = await Lecture.findOne(query)
        .populate('course', 'code title department creditUnit semester description')
        .populate('lecturer', 'name email department avatar status staffId designation office');

      if (!lecture) {
        res.status(404).json({ success: false, message: 'Lecture not found' });
        return;
      }

      res.status(200).json({ success: true, data: lecture });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch lecture' });
    }
  }

  static async createLecture(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';

      if (role === 'student') {
        res.status(403).json({ success: false, message: 'Forbidden: Students cannot schedule lectures' });
        return;
      }

      const {
        course: courseIdentifier,
        title,
        description,
        scheduledDate,
        startTime,
        endTime,
        type = 'Video',
        meetingId: customMeetingId,
        roomPasscode = '',
        maxCapacity = 150,
        allowStudentScreenShare = true,
        recordSession = true,
        autoAttendance = true,
        resources = [],
      } = req.body;

      if (!courseIdentifier || !title || !scheduledDate || !startTime || !endTime) {
        res.status(400).json({
          success: false,
          message: 'course, title, scheduledDate, startTime, and endTime are required',
        });
        return;
      }

      // Find course
      let targetCourse;
      if (mongoose.Types.ObjectId.isValid(courseIdentifier)) {
        targetCourse = await Course.findById(courseIdentifier);
      } else {
        targetCourse = await Course.findOne({ code: courseIdentifier.toUpperCase() });
      }

      if (!targetCourse) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      // Check lecturer assignment
      if (role === 'lecturer' && targetCourse.lecturer.toString() !== userId.toString()) {
        res.status(403).json({
          success: false,
          message: 'Forbidden: You are not assigned as the lecturer for this course',
        });
        return;
      }

      const assignedLecturerId = targetCourse.lecturer;
      const meetingId = customMeetingId
        ? customMeetingId.trim()
        : `mtg-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Check duplicate meetingId
      const existing = await Lecture.findOne({ meetingId });
      if (existing) {
        res.status(409).json({ success: false, message: 'Meeting ID already exists' });
        return;
      }

      const newLecture = await Lecture.create({
        course: targetCourse._id,
        lecturer: assignedLecturerId,
        title: title.trim(),
        description: description ? description.trim() : '',
        scheduledDate: new Date(scheduledDate),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        durationMinutes: 120,
        type: type === 'Voice' ? 'Voice' : 'Video',
        status: 'Scheduled',
        meetingId,
        roomPasscode,
        maxCapacity,
        allowStudentScreenShare,
        recordSession,
        autoAttendance,
        resources,
      });

      const populated = await Lecture.findById(newLecture._id)
        .populate('course', 'code title department creditUnit semester description')
        .populate('lecturer', 'name email department avatar status staffId designation office');

      res.status(201).json({
        success: true,
        message: 'Lecture scheduled successfully',
        data: populated,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create lecture' });
    }
  }

  static async updateLectureStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { lectureId } = req.params;
      const { status } = req.body;
      const validStatuses = ['Scheduled', 'Live Now', 'Completed', 'Cancelled'];

      if (!status || !validStatuses.includes(status)) {
        res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        return;
      }

      let query: any = {};
      if (mongoose.Types.ObjectId.isValid(lectureId)) {
        query = { _id: lectureId };
      } else {
        query = { meetingId: lectureId };
      }

      const updated = await Lecture.findOneAndUpdate(query, { status }, { new: true })
        .populate('course', 'code title department creditUnit semester description')
        .populate('lecturer', 'name email department avatar status staffId designation office');

      if (!updated) {
        res.status(404).json({ success: false, message: 'Lecture not found' });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update lecture status' });
    }
  }
}
