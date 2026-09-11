import { Types } from 'mongoose';
import { Lecture, ILecture } from '../models/Lecture.js';
import { GeneralSession, IGeneralSession } from '../models/GeneralSession.js';
import { Course, ICourse } from '../models/Course.js';
import { User, IUser } from '../models/User.js';
import { Attendance, IAttendance, AttendanceStatus } from '../models/Attendance.js';
import type { AuthUserContext } from './attendance.service.js';
export type { AuthUserContext } from './attendance.service.js';

export type SessionType = 'lecture' | 'general-session';

export interface ResolvedSession {
  session: ILecture | IGeneralSession;
  sessionType: 'lecture' | 'generalSession';
  courseId?: Types.ObjectId;
}

export interface JoinSessionInput {
  status?: AttendanceStatus;
  reason?: string;
  timeJoined?: Date | string;
}

export interface LeaveSessionInput {
  timeLeft?: Date | string;
  status?: AttendanceStatus;
  reason?: string;
}

export interface SanitizedParticipant {
  attendanceId: string;
  studentId: string;
  name: string;
  email: string;
  matricNo?: string;
  avatar?: string;
  department: string;
  status: AttendanceStatus;
  timeJoined: Date;
  timeLeft?: Date;
  durationMinutes: number;
  isActive: boolean;
}

const SAFE_USER_FIELDS = 'name email avatar matricNo staffId department designation';

export class SessionService {
  /**
   * Helper to check valid Mongo ObjectId
   */
  public static isValidId(id: string): boolean {
    return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
  }

  /**
   * Normalize session type string ('lecture' | 'general-session' and common variations)
   */
  public static normalizeSessionType(rawType: string): 'lecture' | 'generalSession' {
    const lower = (rawType || '').toLowerCase().trim();
    if (lower === 'lecture' || lower === 'lectures') {
      return 'lecture';
    }
    if (
      lower === 'general-session' ||
      lower === 'general-sessions' ||
      lower === 'general_session' ||
      lower === 'generalsession' ||
      lower === 'session' ||
      lower === 'sessions'
    ) {
      return 'generalSession';
    }

    const err = new Error("Invalid session type. Must be 'lecture' or 'general-session'.");
    (err as any).statusCode = 400;
    throw err;
  }

  /**
   * Resolves a lecture or general-session by Mongo ObjectId OR meetingId
   */
  public static async resolveSession(rawType: string, identifier: string): Promise<ResolvedSession> {
    if (!identifier || typeof identifier !== 'string') {
      const err = new Error('Session identifier is required.');
      (err as any).statusCode = 400;
      throw err;
    }

    const sessionType = this.normalizeSessionType(rawType);
    const isMongoId = this.isValidId(identifier);

    if (sessionType === 'lecture') {
      const query = isMongoId ? { _id: identifier } : { meetingId: identifier };
      const lecture = await Lecture.findOne(query);

      if (!lecture) {
        const err = new Error('Lecture session not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      return {
        session: lecture,
        sessionType: 'lecture',
        courseId: lecture.course as Types.ObjectId,
      };
    } else {
      const query = isMongoId ? { _id: identifier } : { meetingId: identifier };
      const session = await GeneralSession.findOne(query);

      if (!session) {
        const err = new Error('General session not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      return {
        session,
        sessionType: 'generalSession',
      };
    }
  }

  /**
   * Validate whether a session is currently joinable based on status and scheduled timings
   */
  public static validateSessionJoinability(session: ILecture | IGeneralSession): void {
    if (session.status === 'Cancelled') {
      const err = new Error('Session has been cancelled.');
      (err as any).statusCode = 400;
      throw err;
    }

    if (session.status === 'Completed') {
      const err = new Error('Session has already ended.');
      (err as any).statusCode = 400;
      throw err;
    }

    if (session.status === 'Scheduled') {
      // In the ND2 virtual classroom, a session marked as 'Scheduled' has not been launched live by the lecturer/host yet.
      const err = new Error('Session has not started yet.');
      (err as any).statusCode = 400;
      throw err;
    }

    // Status 'Live Now' is the active joinable state
    if (session.status !== 'Live Now') {
      const err = new Error('Session is not currently active.');
      (err as any).statusCode = 400;
      throw err;
    }
  }

  /**
   * Validate if the user is authorized to join this session
   */
  public static async validateStudentAuthorization(
    studentId: string,
    resolved: ResolvedSession
  ): Promise<void> {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      const err = new Error('Student account not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (student.status !== 'Active') {
      const err = new Error('Student account is not active.');
      (err as any).statusCode = 403;
      throw err;
    }

    // If lecture, student MUST be enrolled in the course
    if (resolved.sessionType === 'lecture' && resolved.courseId) {
      const course = await Course.findById(resolved.courseId);
      if (!course) {
        const err = new Error('Course for this lecture not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      const isEnrolled = course.enrolledStudents.some(
        (enrolledId) => enrolledId.toString() === studentId
      );

      if (!isEnrolled) {
        const err = new Error('Forbidden: You are not authorized to join this session. You are not enrolled in this course.');
        (err as any).statusCode = 403;
        throw err;
      }
    }
  }

  /**
   * Determine initial attendance status (e.g. Present vs Late)
   */
  public static calculateInitialAttendanceStatus(
    session: ILecture | IGeneralSession,
    timeJoined: Date,
    explicitStatus?: AttendanceStatus
  ): AttendanceStatus {
    if (explicitStatus) {
      return explicitStatus;
    }

    // Check if join time is substantially after scheduled startTime
    try {
      if (session.scheduledDate && session.startTime) {
        const scheduledDate = new Date(session.scheduledDate);
        const timeParts = session.startTime.match(/(\d+):(\d+)(?:\s*(AM|PM))?/i);

        if (timeParts) {
          let hours = parseInt(timeParts[1], 10);
          const minutes = parseInt(timeParts[2], 10);
          const modifier = timeParts[3]?.toUpperCase();

          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;

          const scheduledStart = new Date(scheduledDate);
          scheduledStart.setHours(hours, minutes, 0, 0);

          // If student joined more than 15 minutes past start time, mark as Late
          const diffMinutes = (timeJoined.getTime() - scheduledStart.getTime()) / 60000;
          if (diffMinutes > 15) {
            return 'Late';
          }
        }
      }
    } catch {
      // fallback to Present
    }

    return 'Present';
  }

  /**
   * Student joins an active lecture or general session
   * Automatically creates or retrieves attendance record with duplicate protection
   */
  public static async joinSession(
    rawType: string,
    identifier: string,
    user: AuthUserContext,
    input: JoinSessionInput = {}
  ): Promise<{ attendance: IAttendance; alreadyJoined: boolean }> {
    // 1. Authenticate user & check student role
    if (!user || !user.userId) {
      const err = new Error('Authentication required.');
      (err as any).statusCode = 401;
      throw err;
    }

    if (user.role !== 'student' && user.role !== 'admin') {
      const err = new Error('Forbidden: Only students record session attendance.');
      (err as any).statusCode = 403;
      throw err;
    }

    const studentId = user.userId;

    // 2. Resolve requested session
    const resolved = await this.resolveSession(rawType, identifier);
    const { session, sessionType, courseId } = resolved;

    // 3. Confirm student authorization (e.g. course enrollment)
    await this.validateStudentAuthorization(studentId, resolved);

    // 4. Confirm session is currently joinable
    this.validateSessionJoinability(session);

    // 5. Duplicate active participation check
    const query =
      sessionType === 'lecture'
        ? { student: studentId, lecture: session._id }
        : { student: studentId, generalSession: session._id };

    const existingAttendance = await Attendance.findOne(query);

    if (existingAttendance) {
      // If student previously left and is re-entering, clear timeLeft so they are active again
      if (existingAttendance.timeLeft) {
        existingAttendance.timeLeft = undefined;
        await existingAttendance.save();
      }

      const populated = await Attendance.findById(existingAttendance._id)
        .populate('student', SAFE_USER_FIELDS)
        .populate('course', 'code title department creditUnit')
        .populate('lecture', 'title scheduledDate startTime endTime durationMinutes type meetingId status')
        .populate('generalSession', 'title category scheduledDate startTime endTime durationMinutes mode meetingId status');

      return {
        attendance: populated!,
        alreadyJoined: true,
      };
    }

    // 6. Create student's Attendance record
    const timeJoined = input.timeJoined ? new Date(input.timeJoined) : new Date();
    const status = this.calculateInitialAttendanceStatus(session, timeJoined, input.status);

    const newAttendance = await Attendance.create({
      student: new Types.ObjectId(studentId),
      course: courseId,
      lecture: sessionType === 'lecture' ? session._id : undefined,
      generalSession: sessionType === 'generalSession' ? session._id : undefined,
      date: session.scheduledDate || new Date(),
      timeJoined,
      timeLeft: undefined,
      durationMinutes: 0,
      status,
      reason: input.reason || '',
    });

    const populated = await Attendance.findById(newAttendance._id)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', 'code title department creditUnit')
      .populate('lecture', 'title scheduledDate startTime endTime durationMinutes type meetingId status')
      .populate('generalSession', 'title category scheduledDate startTime endTime durationMinutes mode meetingId status');

    return {
      attendance: populated!,
      alreadyJoined: false,
    };
  }

  /**
   * Student leaves an active lecture or general session
   * Updates timeLeft and calculates durationMinutes consistently
   */
  public static async leaveSession(
    rawType: string,
    identifier: string,
    user: AuthUserContext,
    input: LeaveSessionInput = {}
  ): Promise<IAttendance> {
    if (!user || !user.userId) {
      const err = new Error('Authentication required.');
      (err as any).statusCode = 401;
      throw err;
    }

    const studentId = user.userId;

    // 1. Resolve requested session
    const resolved = await this.resolveSession(rawType, identifier);
    const { session, sessionType } = resolved;

    // 2. Locate active attendance record
    const query =
      sessionType === 'lecture'
        ? { student: studentId, lecture: session._id }
        : { student: studentId, generalSession: session._id };

    const attendance = await Attendance.findOne(query);

    if (!attendance) {
      const err = new Error('No active attendance record was found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // 3. Repeated leave protection: if already left, preserve existing duration
    if (attendance.timeLeft && attendance.durationMinutes > 0 && !input.timeLeft) {
      const populated = await Attendance.findById(attendance._id)
        .populate('student', SAFE_USER_FIELDS)
        .populate('course', 'code title department creditUnit')
        .populate('lecture', 'title scheduledDate startTime endTime durationMinutes type meetingId status')
        .populate('generalSession', 'title category scheduledDate startTime endTime durationMinutes mode meetingId status');
      return populated!;
    }

    // 4. Update timeLeft and durationMinutes
    const timeLeft = input.timeLeft ? new Date(input.timeLeft) : new Date();
    const timeJoined = new Date(attendance.timeJoined || attendance.createdAt);

    const durationMinutes = Math.max(
      0,
      Math.round((timeLeft.getTime() - timeJoined.getTime()) / 60000)
    );

    attendance.timeLeft = timeLeft;
    attendance.durationMinutes = durationMinutes;

    if (input.status) {
      attendance.status = input.status;
    }

    if (input.reason) {
      attendance.reason = input.reason;
    }

    await attendance.save();

    const populated = await Attendance.findById(attendance._id)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', 'code title department creditUnit')
      .populate('lecture', 'title scheduledDate startTime endTime durationMinutes type meetingId status')
      .populate('generalSession', 'title category scheduledDate startTime endTime durationMinutes mode meetingId status');

    return populated!;
  }

  /**
   * Get active participants for a session (Lecturer of session/course or Admin only)
   */
  public static async getSessionParticipants(
    rawType: string,
    identifier: string,
    user: AuthUserContext
  ): Promise<{
    session: any;
    sessionType: string;
    totalParticipants: number;
    activeCount: number;
    participants: SanitizedParticipant[];
  }> {
    if (!user || !user.userId) {
      const err = new Error('Authentication required.');
      (err as any).statusCode = 401;
      throw err;
    }

    // RBAC: Students must not receive the complete participant list
    if (user.role === 'student') {
      const err = new Error('Forbidden: Students must not receive the complete participant list.');
      (err as any).statusCode = 403;
      throw err;
    }

    // 1. Resolve session
    const resolved = await this.resolveSession(rawType, identifier);
    const { session, sessionType } = resolved;

    // 2. Lecturer authorization check
    if (user.role === 'lecturer') {
      if (sessionType === 'lecture') {
        const lecture = session as ILecture;
        let authorized = lecture.lecturer.toString() === user.userId;

        if (!authorized && lecture.course) {
          const course = await Course.findById(lecture.course);
          if (course && course.lecturer.toString() === user.userId) {
            authorized = true;
          }
        }

        if (!authorized) {
          const err = new Error('Forbidden: You are not authorized to view participants for this lecture.');
          (err as any).statusCode = 403;
          throw err;
        }
      } else {
        const genSession = session as IGeneralSession;
        if (genSession.organizer.toString() !== user.userId) {
          const err = new Error('Forbidden: You are not authorized to view participants for this session.');
          (err as any).statusCode = 403;
          throw err;
        }
      }
    }

    // 3. Query attendance records
    const query =
      sessionType === 'lecture'
        ? { lecture: session._id }
        : { generalSession: session._id };

    const records = await Attendance.find(query)
      .sort({ timeJoined: -1 })
      .populate('student', SAFE_USER_FIELDS);

    // 4. Sanitize participant records
    let activeCount = 0;
    const sanitizedList: SanitizedParticipant[] = [];

    for (const rec of records) {
      const studentObj = rec.student as any;
      if (!studentObj) continue;

      const isActive = !rec.timeLeft;
      if (isActive) {
        activeCount++;
      }

      sanitizedList.push({
        attendanceId: rec._id.toString(),
        studentId: studentObj._id?.toString() || studentObj.toString(),
        name: studentObj.name || 'Student',
        email: studentObj.email || '',
        matricNo: studentObj.matricNo,
        avatar: studentObj.avatar,
        department: studentObj.department || 'Computer Science',
        status: rec.status,
        timeJoined: rec.timeJoined,
        timeLeft: rec.timeLeft,
        durationMinutes: rec.durationMinutes,
        isActive,
      });
    }

    return {
      session: {
        id: session._id,
        title: session.title,
        status: session.status,
        meetingId: session.meetingId,
        scheduledDate: session.scheduledDate,
        startTime: session.startTime,
        endTime: session.endTime,
      },
      sessionType,
      totalParticipants: sanitizedList.length,
      activeCount,
      participants: sanitizedList,
    };
  }

  /**
   * Get current user's attendance status for a specific session
   */
  public static async getMySessionStatus(
    rawType: string,
    identifier: string,
    user: AuthUserContext
  ): Promise<{ joined: boolean; attendance: IAttendance | null }> {
    if (!user || !user.userId) {
      const err = new Error('Authentication required.');
      (err as any).statusCode = 401;
      throw err;
    }

    const resolved = await this.resolveSession(rawType, identifier);
    const { session, sessionType } = resolved;

    const query =
      sessionType === 'lecture'
        ? { student: user.userId, lecture: session._id }
        : { student: user.userId, generalSession: session._id };

    const attendance = await Attendance.findOne(query)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', 'code title department')
      .populate('lecture', 'title scheduledDate startTime endTime meetingId status')
      .populate('generalSession', 'title category scheduledDate startTime endTime meetingId status');

    return {
      joined: Boolean(attendance),
      attendance,
    };
  }
}
