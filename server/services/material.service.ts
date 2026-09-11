import mongoose, { Types } from 'mongoose';
import { Material, IMaterial } from '../models/Material.js';
import { Course } from '../models/Course.js';

export const ALLOWED_CATEGORIES = [
  'Lecture Notes',
  'Lab Manual',
  'Handout',
  'Past Questions & Solutions',
  'Reference Guide',
];

export const ALLOWED_FORMATS = ['PDF', 'ZIP', 'DOCX', 'PPTX'];

export class MaterialService {
  /**
   * Get materials accessible to a specific user based on role
   */
  static async getMaterialsForUser(userId: string, role: 'student' | 'lecturer' | 'admin'): Promise<IMaterial[]> {
    let query = {};

    if (role === 'student') {
      const enrolledCourses = await Course.find({
        enrolledStudents: new Types.ObjectId(userId),
      }).select('_id');
      const courseIds = enrolledCourses.map((c) => c._id);

      // If student has courses enrolled, filter by those; otherwise fallback to all if in prototype
      query = courseIds.length > 0 ? { course: { $in: courseIds } } : {};
    } else if (role === 'lecturer') {
      const assignedCourses = await Course.find({
        lecturer: new Types.ObjectId(userId),
      }).select('_id');
      const courseIds = assignedCourses.map((c) => c._id);
      query = {
        $or: [
          { course: { $in: courseIds } },
          { uploadedBy: new Types.ObjectId(userId) },
        ],
      };
    } else if (role === 'admin') {
      query = {};
    }

    return Material.find(query)
      .populate('course', 'code title department semester')
      .populate('uploadedBy', 'name email avatar designation department')
      .sort({ createdAt: -1 });
  }

  /**
   * Get materials for a specific course with authorization checks
   */
  static async getMaterialsByCourse(
    courseIdentifier: string,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IMaterial[]> {
    let courseQuery: any = {};
    if (mongoose.Types.ObjectId.isValid(courseIdentifier)) {
      courseQuery = { _id: courseIdentifier };
    } else {
      courseQuery = { code: courseIdentifier.toUpperCase() };
    }

    const course = await Course.findOne(courseQuery);
    if (!course) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    if (role === 'student') {
      const isEnrolled = course.enrolledStudents.some(
        (id) => id.toString() === userId.toString()
      );
      if (!isEnrolled) {
        const error: any = new Error('Forbidden: You are not enrolled in this course');
        error.statusCode = 403;
        throw error;
      }
    } else if (role === 'lecturer') {
      if (course.lecturer.toString() !== userId.toString()) {
        const error: any = new Error('Forbidden: You are not assigned as the lecturer for this course');
        error.statusCode = 403;
        throw error;
      }
    }

    return Material.find({ course: course._id })
      .populate('course', 'code title department semester')
      .populate('uploadedBy', 'name email avatar designation department')
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single material by ID
   */
  static async getMaterialById(
    materialId: string,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IMaterial> {
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const error: any = new Error('Invalid material ID');
      error.statusCode = 400;
      throw error;
    }

    const material = await Material.findById(materialId)
      .populate('course', 'code title department lecturer enrolledStudents')
      .populate('uploadedBy', 'name email avatar designation department');

    if (!material) {
      const error: any = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    const course: any = material.course;
    if (role === 'student' && course) {
      const isEnrolled = course.enrolledStudents?.some(
        (id: any) => id.toString() === userId.toString()
      );
      if (!isEnrolled) {
        const error: any = new Error('Forbidden: You are not enrolled in the course for this material');
        error.statusCode = 403;
        throw error;
      }
    }

    return material;
  }

  /**
   * Create a new course material
   */
  static async createMaterial(
    data: any,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IMaterial> {
    if (role === 'student') {
      const error: any = new Error('Forbidden: Students are not authorized to upload course materials');
      error.statusCode = 403;
      throw error;
    }

    const { course: courseId, title, category, format, size, fileUrl, description } = data;

    // Validate required fields
    if (!courseId || !title || !category || !format || !size || !fileUrl) {
      const error: any = new Error('Validation error: course, title, category, format, size, and fileUrl are required');
      error.statusCode = 400;
      throw error;
    }

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(category)) {
      const error: any = new Error(`Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    // Validate format
    const normalizedFormat = format.toUpperCase();
    if (!ALLOWED_FORMATS.includes(normalizedFormat)) {
      const error: any = new Error(`Invalid format. Allowed formats are: ${ALLOWED_FORMATS.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    // Resolve course
    let targetCourse;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      targetCourse = await Course.findById(courseId);
    } else {
      targetCourse = await Course.findOne({ code: courseId.toUpperCase() });
    }

    if (!targetCourse) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    // Check lecturer ownership
    if (role === 'lecturer') {
      if (targetCourse.lecturer.toString() !== userId.toString()) {
        const error: any = new Error('Forbidden: You can only upload materials for courses assigned to you');
        error.statusCode = 403;
        throw error;
      }
    }

    const newMaterial = await Material.create({
      course: targetCourse._id,
      uploadedBy: new Types.ObjectId(userId),
      title: title.trim(),
      category,
      format: normalizedFormat,
      size: size.trim(),
      fileUrl: fileUrl.trim(),
      description: description ? description.trim() : '',
      downloads: 0,
      uploadedDate: new Date(),
    });

    return (await Material.findById(newMaterial._id)
      .populate('course', 'code title department semester')
      .populate('uploadedBy', 'name email avatar designation department')) as IMaterial;
  }

  /**
   * Update an existing material
   */
  static async updateMaterial(
    materialId: string,
    data: any,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IMaterial> {
    if (role === 'student') {
      const error: any = new Error('Forbidden: Students cannot edit course materials');
      error.statusCode = 403;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const error: any = new Error('Invalid material ID');
      error.statusCode = 400;
      throw error;
    }

    const material = await Material.findById(materialId);
    if (!material) {
      const error: any = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    const course = await Course.findById(material.course);
    if (!course) {
      const error: any = new Error('Associated course not found');
      error.statusCode = 404;
      throw error;
    }

    if (role === 'lecturer') {
      const isCourseLecturer = course.lecturer.toString() === userId.toString();
      const isUploader = material.uploadedBy.toString() === userId.toString();
      if (!isCourseLecturer && !isUploader) {
        const error: any = new Error('Forbidden: You are not authorized to update this material');
        error.statusCode = 403;
        throw error;
      }
    }

    if (data.category && !ALLOWED_CATEGORIES.includes(data.category)) {
      const error: any = new Error(`Invalid category. Allowed categories are: ${ALLOWED_CATEGORIES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    if (data.format) {
      const normalizedFormat = data.format.toUpperCase();
      if (!ALLOWED_FORMATS.includes(normalizedFormat)) {
        const error: any = new Error(`Invalid format. Allowed formats are: ${ALLOWED_FORMATS.join(', ')}`);
        error.statusCode = 400;
        throw error;
      }
      data.format = normalizedFormat;
    }

    if (data.title) material.title = data.title.trim();
    if (data.category) material.category = data.category;
    if (data.format) material.format = data.format;
    if (data.size) material.size = data.size.trim();
    if (data.fileUrl) material.fileUrl = data.fileUrl.trim();
    if (data.description !== undefined) material.description = data.description.trim();

    await material.save();

    return (await Material.findById(material._id)
      .populate('course', 'code title department semester')
      .populate('uploadedBy', 'name email avatar designation department')) as IMaterial;
  }

  /**
   * Delete a material
   */
  static async deleteMaterial(
    materialId: string,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<void> {
    if (role === 'student') {
      const error: any = new Error('Forbidden: Students cannot delete course materials');
      error.statusCode = 403;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const error: any = new Error('Invalid material ID');
      error.statusCode = 400;
      throw error;
    }

    const material = await Material.findById(materialId);
    if (!material) {
      const error: any = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    const course = await Course.findById(material.course);
    if (role === 'lecturer') {
      const isCourseLecturer = course && course.lecturer.toString() === userId.toString();
      const isUploader = material.uploadedBy.toString() === userId.toString();
      if (!isCourseLecturer && !isUploader) {
        const error: any = new Error('Forbidden: You are not authorized to delete this material');
        error.statusCode = 403;
        throw error;
      }
    }

    await Material.findByIdAndDelete(materialId);
  }

  /**
   * Increment download count atomically
   */
  static async incrementDownload(materialId: string): Promise<IMaterial> {
    if (!mongoose.Types.ObjectId.isValid(materialId)) {
      const error: any = new Error('Invalid material ID');
      error.statusCode = 400;
      throw error;
    }

    const updated = await Material.findByIdAndUpdate(
      materialId,
      { $inc: { downloads: 1 } },
      { new: true }
    )
      .populate('course', 'code title department semester')
      .populate('uploadedBy', 'name email avatar designation department');

    if (!updated) {
      const error: any = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    return updated;
  }
}
