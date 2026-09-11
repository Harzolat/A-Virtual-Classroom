import mongoose, { Types } from 'mongoose';
import { GeneralSession, IGeneralSession } from '../models/GeneralSession.js';

export const ALLOWED_SESSION_CATEGORIES = [
  'Project Discussion',
  'Department Meeting',
  'Student Consultation',
  'Seminar',
  'General',
];

export const ALLOWED_SESSION_MODES = ['Video', 'Voice'];

export class GeneralSessionService {
  /**
   * Retrieve general virtual sessions accessible to the user
   */
  static async getGeneralSessionsForUser(
    _userId: string,
    _role: 'student' | 'lecturer' | 'admin'
  ): Promise<IGeneralSession[]> {
    return GeneralSession.find({})
      .populate('organizer', 'name email avatar designation department staffId')
      .sort({ scheduledDate: -1, createdAt: -1 });
  }

  /**
   * Retrieve a specific general session by ID
   */
  static async getGeneralSessionById(
    sessionId: string,
    _userId: string,
    _role: 'student' | 'lecturer' | 'admin'
  ): Promise<IGeneralSession> {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      const error: any = new Error('Invalid session ID');
      error.statusCode = 400;
      throw error;
    }

    const session = await GeneralSession.findById(sessionId).populate(
      'organizer',
      'name email avatar designation department staffId'
    );

    if (!session) {
      const error: any = new Error('General session not found');
      error.statusCode = 404;
      throw error;
    }

    return session;
  }

  /**
   * Create a new general virtual session
   */
  static async createGeneralSession(
    data: any,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IGeneralSession> {
    if (role === 'student') {
      const error: any = new Error(
        'Forbidden: Students are not authorized to create general sessions'
      );
      error.statusCode = 403;
      throw error;
    }

    const {
      title,
      category,
      description,
      scheduledDate,
      startTime,
      endTime,
      durationMinutes,
      mode,
      status,
      meetingId: customMeetingId,
      maxCapacity,
      allowStudentScreenShare,
      recordSession,
      autoAttendance,
    } = data;

    // Validate required fields
    if (!title || !category || !scheduledDate || !startTime || !endTime || !mode) {
      const error: any = new Error(
        'Validation error: title, category, scheduledDate, startTime, endTime, and mode are required'
      );
      error.statusCode = 400;
      throw error;
    }

    // Validate category
    if (!ALLOWED_SESSION_CATEGORIES.includes(category)) {
      const error: any = new Error(
        `Invalid category. Allowed categories are: ${ALLOWED_SESSION_CATEGORIES.join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Normalize and validate mode
    const normalizedMode =
      mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
    if (!ALLOWED_SESSION_MODES.includes(normalizedMode)) {
      const error: any = new Error(
        `Invalid mode. Allowed modes are: ${ALLOWED_SESSION_MODES.join(', ')}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Generate or validate meetingId
    const finalMeetingId =
      customMeetingId && customMeetingId.trim()
        ? customMeetingId.trim()
        : `mtg-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const existingMeeting = await GeneralSession.findOne({
      meetingId: finalMeetingId,
    });
    if (existingMeeting) {
      const error: any = new Error(
        'Duplicate meetingId: A session with this meeting ID already exists'
      );
      error.statusCode = 400;
      throw error;
    }

    // Calculate duration in minutes if not explicitly provided
    let calculatedDuration = Number(durationMinutes);
    if (!calculatedDuration || isNaN(calculatedDuration)) {
      calculatedDuration = 90;
    }

    const parsedDate = new Date(scheduledDate);
    if (isNaN(parsedDate.getTime())) {
      const error: any = new Error('Invalid scheduledDate format');
      error.statusCode = 400;
      throw error;
    }

    const newSession = await GeneralSession.create({
      organizer: new Types.ObjectId(userId),
      title: title.trim(),
      category,
      description: description ? description.trim() : '',
      scheduledDate: parsedDate,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      durationMinutes: calculatedDuration,
      mode: normalizedMode as 'Video' | 'Voice',
      status: status || 'Scheduled',
      meetingId: finalMeetingId,
      maxCapacity: maxCapacity ? Number(maxCapacity) : 100,
      allowStudentScreenShare:
        allowStudentScreenShare !== undefined
          ? Boolean(allowStudentScreenShare)
          : true,
      recordSession:
        recordSession !== undefined ? Boolean(recordSession) : true,
      autoAttendance:
        autoAttendance !== undefined ? Boolean(autoAttendance) : true,
    });

    return (await GeneralSession.findById(newSession._id).populate(
      'organizer',
      'name email avatar designation department staffId'
    )) as IGeneralSession;
  }

  /**
   * Update an existing general virtual session
   */
  static async updateGeneralSession(
    sessionId: string,
    data: any,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<IGeneralSession> {
    if (role === 'student') {
      const error: any = new Error(
        'Forbidden: Students cannot update general sessions'
      );
      error.statusCode = 403;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      const error: any = new Error('Invalid session ID');
      error.statusCode = 400;
      throw error;
    }

    const session = await GeneralSession.findById(sessionId);
    if (!session) {
      const error: any = new Error('General session not found');
      error.statusCode = 404;
      throw error;
    }

    // Role check: Lecturer can only update sessions they organized
    if (role === 'lecturer') {
      if (session.organizer.toString() !== userId.toString()) {
        const error: any = new Error(
          'Forbidden: You are not authorized to update this general session'
        );
        error.statusCode = 403;
        throw error;
      }
    }

    // Validate category if updating
    if (data.category) {
      if (!ALLOWED_SESSION_CATEGORIES.includes(data.category)) {
        const error: any = new Error(
          `Invalid category. Allowed categories are: ${ALLOWED_SESSION_CATEGORIES.join(', ')}`
        );
        error.statusCode = 400;
        throw error;
      }
      session.category = data.category;
    }

    // Validate mode if updating
    if (data.mode) {
      const normalizedMode =
        data.mode.charAt(0).toUpperCase() + data.mode.slice(1).toLowerCase();
      if (!ALLOWED_SESSION_MODES.includes(normalizedMode)) {
        const error: any = new Error(
          `Invalid mode. Allowed modes are: ${ALLOWED_SESSION_MODES.join(', ')}`
        );
        error.statusCode = 400;
        throw error;
      }
      session.mode = normalizedMode as 'Video' | 'Voice';
    }

    // Check meetingId uniqueness if changed
    if (data.meetingId && data.meetingId.trim() !== session.meetingId) {
      const trimmedMeetingId = data.meetingId.trim();
      const existing = await GeneralSession.findOne({
        meetingId: trimmedMeetingId,
        _id: { $ne: session._id },
      });
      if (existing) {
        const error: any = new Error(
          'Duplicate meetingId: A session with this meeting ID already exists'
        );
        error.statusCode = 400;
        throw error;
      }
      session.meetingId = trimmedMeetingId;
    }

    if (data.title) session.title = data.title.trim();
    if (data.description !== undefined) session.description = data.description.trim();
    if (data.scheduledDate) {
      const parsedDate = new Date(data.scheduledDate);
      if (isNaN(parsedDate.getTime())) {
        const error: any = new Error('Invalid scheduledDate format');
        error.statusCode = 400;
        throw error;
      }
      session.scheduledDate = parsedDate;
    }
    if (data.startTime) session.startTime = data.startTime.trim();
    if (data.endTime) session.endTime = data.endTime.trim();
    if (data.durationMinutes !== undefined) session.durationMinutes = Number(data.durationMinutes);
    if (data.status) session.status = data.status;
    if (data.maxCapacity !== undefined) session.maxCapacity = Number(data.maxCapacity);
    if (data.allowStudentScreenShare !== undefined)
      session.allowStudentScreenShare = Boolean(data.allowStudentScreenShare);
    if (data.recordSession !== undefined)
      session.recordSession = Boolean(data.recordSession);
    if (data.autoAttendance !== undefined)
      session.autoAttendance = Boolean(data.autoAttendance);

    await session.save();

    return (await GeneralSession.findById(session._id).populate(
      'organizer',
      'name email avatar designation department staffId'
    )) as IGeneralSession;
  }

  /**
   * Delete an existing general virtual session
   */
  static async deleteGeneralSession(
    sessionId: string,
    userId: string,
    role: 'student' | 'lecturer' | 'admin'
  ): Promise<void> {
    if (role === 'student') {
      const error: any = new Error(
        'Forbidden: Students cannot delete general sessions'
      );
      error.statusCode = 403;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      const error: any = new Error('Invalid session ID');
      error.statusCode = 400;
      throw error;
    }

    const session = await GeneralSession.findById(sessionId);
    if (!session) {
      const error: any = new Error('General session not found');
      error.statusCode = 404;
      throw error;
    }

    // Role check: Lecturer can only delete sessions they organized
    if (role === 'lecturer') {
      if (session.organizer.toString() !== userId.toString()) {
        const error: any = new Error(
          'Forbidden: You are not authorized to delete this general session'
        );
        error.statusCode = 403;
        throw error;
      }
    }

    await GeneralSession.findByIdAndDelete(sessionId);
  }
}
