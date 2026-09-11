import { Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export class CourseController {
  static async getCourses(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courses = await Course.find()
        .populate('lecturer', 'name email avatar department designation office staffId')
        .populate('enrolledStudents', 'name email avatar matricNo')
        .sort({ code: 1 });

      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch courses' });
    }
  }

  static async getCourseById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      let query: any = {};
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        query = { _id: courseId };
      } else {
        query = { code: courseId.toUpperCase() };
      }

      const course = await Course.findOne(query)
        .populate('lecturer', 'name email avatar department designation office staffId')
        .populate('enrolledStudents', 'name email avatar matricNo');

      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      res.status(200).json({ success: true, data: course });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch course' });
    }
  }
}
