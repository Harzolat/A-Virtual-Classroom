import { Types } from 'mongoose';
import { Attendance, IAttendance, AttendanceStatus } from '../models/Attendance.js';
import { User, IUser } from '../models/User.js';
import { Course, ICourse } from '../models/Course.js';
import { Lecture, ILecture } from '../models/Lecture.js';
import { GeneralSession, IGeneralSession } from '../models/GeneralSession.js';

export interface AuthUserContext {
  userId: string;
  role: 'student' | 'lecturer' | 'admin';
  name?: string;
  email?: string;
}

export interface RecordAttendanceInput {
  studentId?: string;
  courseId?: string;
  lectureId?: string;
  generalSessionId?: string;
  date?: string | Date;
  timeJoined?: string | Date;
  timeLeft?: string | Date;
  durationMinutes?: number;
  status?: AttendanceStatus;
  reason?: string;
}

export interface LeaveAttendanceInput {
  timeLeft?: string | Date;
  status?: AttendanceStatus;
  reason?: string;
}

const SAFE_USER_FIELDS = 'name email avatar matricNo staffId department designation';
const SAFE_COURSE_FIELDS = 'code title creditUnit department semester';
const SAFE_LECTURE_FIELDS = 'title scheduledDate startTime endTime durationMinutes type meetingId status';
const SAFE_SESSION_FIELDS = 'title category scheduledDate startTime endTime durationMinutes mode meetingId status';

export class AttendanceService {
  /**
   * Helper to check valid Mongo ObjectId
   */
  private static isValidId(id: string): boolean {
    return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
  }

  /**
   * Record attendance for a lecture or general session
   */
  public static async recordAttendance(
    input: RecordAttendanceInput,
    user: AuthUserContext
  ): Promise<IAttendance> {
    // 1. Determine student ID
    let targetStudentId = user.userId;
    if (user.role === 'admin' && input.studentId) {
      targetStudentId = input.studentId;
    } else if (user.role === 'student' && input.studentId && input.studentId !== user.userId) {
      const err = new Error('Forbidden: Students cannot record attendance for other students.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (!this.isValidId(targetStudentId)) {
      const err = new Error('Invalid student ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    // Verify student exists and is active student
    const student = await User.findById(targetStudentId);
    if (!student || student.role !== 'student') {
      const err = new Error('Student account not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // 2. Validate session type: either lecture OR generalSession (cannot be both)
    const hasLecture = Boolean(input.lectureId);
    const hasSession = Boolean(input.generalSessionId);

    if (hasLecture && hasSession) {
      const err = new Error('Attendance cannot reference both a lecture and a general session.');
      (err as any).statusCode = 400;
      throw err;
    }

    if (!hasLecture && !hasSession) {
      const err = new Error('Attendance must reference either a lecture or a general session.');
      (err as any).statusCode = 400;
      throw err;
    }

    let courseId: Types.ObjectId | undefined;
    let lectureId: Types.ObjectId | undefined;
    let generalSessionId: Types.ObjectId | undefined;

    // 3. Process Lecture Attendance
    if (hasLecture) {
      if (!this.isValidId(input.lectureId!)) {
        const err = new Error('Invalid lecture ID format.');
        (err as any).statusCode = 400;
        throw err;
      }

      const lecture = await Lecture.findById(input.lectureId);
      if (!lecture) {
        const err = new Error('Lecture not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      lectureId = lecture._id as Types.ObjectId;
      courseId = lecture.course as Types.ObjectId;

      // Duplicate protection: student + lecture
      const existing = await Attendance.findOne({
        student: targetStudentId,
        lecture: lectureId,
      });

      if (existing) {
        const err = new Error('Attendance already recorded for this session');
        (err as any).statusCode = 400;
        throw err;
      }
    }

    // 4. Process General Session Attendance
    if (hasSession) {
      if (!this.isValidId(input.generalSessionId!)) {
        const err = new Error('Invalid general session ID format.');
        (err as any).statusCode = 400;
        throw err;
      }

      const session = await GeneralSession.findById(input.generalSessionId);
      if (!session) {
        const err = new Error('General session not found.');
        (err as any).statusCode = 404;
        throw err;
      }

      generalSessionId = session._id as Types.ObjectId;

      // Duplicate protection: student + generalSession
      const existing = await Attendance.findOne({
        student: targetStudentId,
        generalSession: generalSessionId,
      });

      if (existing) {
        const err = new Error('Attendance already recorded for this session');
        (err as any).statusCode = 400;
        throw err;
      }

      if (input.courseId && this.isValidId(input.courseId)) {
        courseId = new Types.ObjectId(input.courseId);
      }
    }

    // 5. Timestamps and duration
    const timeJoined = input.timeJoined ? new Date(input.timeJoined) : new Date();
    const timeLeft = input.timeLeft ? new Date(input.timeLeft) : undefined;
    let durationMinutes = Number(input.durationMinutes) || 0;

    if (timeLeft && timeJoined && durationMinutes <= 0) {
      durationMinutes = Math.max(0, Math.round((timeLeft.getTime() - timeJoined.getTime()) / 60000));
    }

    const status = input.status || 'Present';

    // 6. Create attendance record
    const attendance = await Attendance.create({
      student: new Types.ObjectId(targetStudentId),
      course: courseId,
      lecture: lectureId,
      generalSession: generalSessionId,
      date: input.date ? new Date(input.date) : new Date(),
      timeJoined,
      timeLeft,
      durationMinutes,
      status,
      reason: input.reason || '',
    });

    const populated = await Attendance.findById(attendance._id)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS)
      .populate('generalSession', SAFE_SESSION_FIELDS);

    return populated!;
  }

  /**
   * Get attendance record by ID with authorization checks
   */
  public static async getAttendanceById(id: string, user: AuthUserContext): Promise<IAttendance> {
    if (!this.isValidId(id)) {
      const err = new Error('Invalid attendance ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const attendance = await Attendance.findById(id)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS)
      .populate('generalSession', SAFE_SESSION_FIELDS);

    if (!attendance) {
      const err = new Error('Attendance record not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student') {
      const studentId = (attendance.student as any)?._id?.toString() || attendance.student.toString();
      if (studentId !== user.userId) {
        const err = new Error('Forbidden: You can only view your own attendance record.');
        (err as any).statusCode = 403;
        throw err;
      }
    } else if (user.role === 'lecturer') {
      // Lecturer must be course lecturer, lecture lecturer, or session organizer
      let authorized = false;

      if (attendance.course) {
        const course = await Course.findById(attendance.course);
        if (course && course.lecturer.toString() === user.userId) {
          authorized = true;
        }
      }

      if (!authorized && attendance.lecture) {
        const lecture = await Lecture.findById(attendance.lecture);
        if (lecture && lecture.lecturer.toString() === user.userId) {
          authorized = true;
        }
      }

      if (!authorized && attendance.generalSession) {
        const session = await GeneralSession.findById(attendance.generalSession);
        if (session && session.organizer.toString() === user.userId) {
          authorized = true;
        }
      }

      if (!authorized) {
        const err = new Error('Forbidden: You are not authorized to view this attendance record.');
        (err as any).statusCode = 403;
        throw err;
      }
    }

    return attendance;
  }

  /**
   * Update attendance when a student leaves (record timeLeft and calculate duration)
   */
  public static async leaveAttendance(
    id: string,
    input: LeaveAttendanceInput,
    user: AuthUserContext
  ): Promise<IAttendance> {
    if (!this.isValidId(id)) {
      const err = new Error('Invalid attendance ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      const err = new Error('Attendance record not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC: Student can only leave their own attendance
    if (user.role === 'student') {
      if (attendance.student.toString() !== user.userId) {
        const err = new Error('Forbidden: You can only update your own attendance session.');
        (err as any).statusCode = 403;
        throw err;
      }
    }

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
    if (input.reason !== undefined) {
      attendance.reason = input.reason;
    }

    await attendance.save();

    const populated = await Attendance.findById(attendance._id)
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS)
      .populate('generalSession', SAFE_SESSION_FIELDS);

    return populated!;
  }

  /**
   * Get all attendance records for a specific lecture (Lecturer of course/lecture or Admin)
   */
  public static async getAttendanceForLecture(
    lectureId: string,
    user: AuthUserContext
  ): Promise<IAttendance[]> {
    if (!this.isValidId(lectureId)) {
      const err = new Error('Invalid lecture ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      const err = new Error('Lecture not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student') {
      const err = new Error('Forbidden: Students must not receive the complete attendance list of other students.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (user.role === 'lecturer') {
      let authorized = lecture.lecturer.toString() === user.userId;
      if (!authorized && lecture.course) {
        const course = await Course.findById(lecture.course);
        if (course && course.lecturer.toString() === user.userId) {
          authorized = true;
        }
      }
      if (!authorized) {
        const err = new Error('Forbidden: You can only view attendance for your assigned lectures.');
        (err as any).statusCode = 403;
        throw err;
      }
    }

    const records = await Attendance.find({ lecture: lectureId })
      .sort({ timeJoined: -1 })
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS);

    return records;
  }

  /**
   * Get all attendance records for a general session (Organizer or Admin)
   */
  public static async getAttendanceForGeneralSession(
    sessionId: string,
    user: AuthUserContext
  ): Promise<IAttendance[]> {
    if (!this.isValidId(sessionId)) {
      const err = new Error('Invalid general session ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const session = await GeneralSession.findById(sessionId);
    if (!session) {
      const err = new Error('General session not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student') {
      const err = new Error('Forbidden: Students cannot access complete session attendance roster.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (user.role === 'lecturer' && session.organizer.toString() !== user.userId) {
      const err = new Error('Forbidden: You can only view attendance for sessions you organize.');
      (err as any).statusCode = 403;
      throw err;
    }

    const records = await Attendance.find({ generalSession: sessionId })
      .sort({ timeJoined: -1 })
      .populate('student', SAFE_USER_FIELDS)
      .populate('generalSession', SAFE_SESSION_FIELDS);

    return records;
  }

  /**
   * Get attendance history for a student (Student themselves, Lecturer of enrolled course, or Admin)
   */
  public static async getAttendanceForStudent(
    studentId: string,
    user: AuthUserContext,
    filterCourseId?: string
  ): Promise<IAttendance[]> {
    if (!this.isValidId(studentId)) {
      const err = new Error('Invalid student ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const targetStudent = await User.findById(studentId);
    if (!targetStudent || targetStudent.role !== 'student') {
      const err = new Error('Student not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student' && user.userId !== studentId) {
      const err = new Error('Forbidden: A student must not be able to request another student attendance history.');
      (err as any).statusCode = 403;
      throw err;
    }

    const query: any = { student: studentId };

    if (user.role === 'lecturer') {
      // Find courses taught by lecturer
      const lecturerCourses = await Course.find({ lecturer: user.userId }).select('_id');
      const lecturerCourseIds = lecturerCourses.map((c) => c._id);

      if (filterCourseId) {
        if (!this.isValidId(filterCourseId)) {
          const err = new Error('Invalid course ID format.');
          (err as any).statusCode = 400;
          throw err;
        }
        if (!lecturerCourseIds.some((id) => id.toString() === filterCourseId)) {
          const err = new Error('Forbidden: You cannot view attendance for unassigned courses.');
          (err as any).statusCode = 403;
          throw err;
        }
        query.course = filterCourseId;
      } else {
        query.course = { $in: lecturerCourseIds };
      }
    } else if (filterCourseId) {
      if (!this.isValidId(filterCourseId)) {
        const err = new Error('Invalid course ID format.');
        (err as any).statusCode = 400;
        throw err;
      }
      query.course = filterCourseId;
    }

    const records = await Attendance.find(query)
      .sort({ timeJoined: -1, createdAt: -1 })
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS)
      .populate('generalSession', SAFE_SESSION_FIELDS);

    return records;
  }

  /**
   * Get attendance for a course (Lecturer of course or Admin)
   */
  public static async getAttendanceForCourse(
    courseId: string,
    user: AuthUserContext
  ): Promise<IAttendance[]> {
    if (!this.isValidId(courseId)) {
      const err = new Error('Invalid course ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      const err = new Error('Course not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student') {
      const err = new Error('Forbidden: Students cannot access course attendance rosters.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (user.role === 'lecturer' && course.lecturer.toString() !== user.userId) {
      const err = new Error('Forbidden: You can only view attendance for your assigned courses.');
      (err as any).statusCode = 403;
      throw err;
    }

    const records = await Attendance.find({ course: courseId })
      .sort({ timeJoined: -1, createdAt: -1 })
      .populate('student', SAFE_USER_FIELDS)
      .populate('course', SAFE_COURSE_FIELDS)
      .populate('lecture', SAFE_LECTURE_FIELDS);

    return records;
  }

  /**
   * Dynamic calculation of student attendance statistics across enrolled courses
   */
  public static async getStudentAttendanceStats(
    studentId: string,
    user: AuthUserContext
  ): Promise<any> {
    if (!this.isValidId(studentId)) {
      const err = new Error('Invalid student ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      const err = new Error('Student not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student' && user.userId !== studentId) {
      const err = new Error('Forbidden: Students can only view their own statistics.');
      (err as any).statusCode = 403;
      throw err;
    }

    // Get all courses student is enrolled in (or all semester courses if enrolledStudents is empty)
    let courses = await Course.find({ enrolledStudents: studentId }).populate('lecturer', 'name');
    if (!courses || courses.length === 0) {
      courses = await Course.find({ department: student.department || 'Computer Science' }).populate('lecturer', 'name');
    }

    let overallTotalLectures = 0;
    let overallAttendedLectures = 0;
    let overallMissedLectures = 0;
    let overallLateLectures = 0;
    let overallExcusedLectures = 0;
    let totalLectureMinutes = 0;

    const courseBreakdown = [];

    for (const c of courses) {
      const totalLecturesInCourse = await Lecture.countDocuments({ course: c._id });
      const attendanceLogs = await Attendance.find({
        student: studentId,
        course: c._id,
        lecture: { $exists: true, $ne: null },
      }).populate('lecture', 'title scheduledDate');

      const attendedCount = attendanceLogs.filter(
        (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'Excused'
      ).length;
      const lateCount = attendanceLogs.filter((a) => a.status === 'Late').length;
      const excusedCount = attendanceLogs.filter((a) => a.status === 'Excused').length;
      const missedCount = Math.max(0, totalLecturesInCourse - attendedCount);

      const percentage = totalLecturesInCourse > 0
        ? Number(((attendedCount / totalLecturesInCourse) * 100).toFixed(1))
        : 0;

      const isEligible = percentage >= 75;
      const statusLabel = isEligible
        ? 'Good Standing'
        : percentage >= 60
        ? 'Warning'
        : 'Defaulter';

      overallTotalLectures += totalLecturesInCourse;
      overallAttendedLectures += attendedCount;
      overallMissedLectures += missedCount;
      overallLateLectures += lateCount;
      overallExcusedLectures += excusedCount;

      attendanceLogs.forEach((a) => {
        totalLectureMinutes += a.durationMinutes || 0;
      });

      courseBreakdown.push({
        courseId: c._id.toString(),
        courseCode: c.code,
        courseTitle: c.title,
        creditUnit: c.creditUnit,
        lecturer: (c.lecturer as any)?.name || 'Department Faculty',
        totalLectures: totalLecturesInCourse,
        attended: attendedCount,
        missed: missedCount,
        late: lateCount,
        excused: excusedCount,
        percentage,
        isEligible,
        status: statusLabel,
        history: attendanceLogs.map((log) => ({
          id: log._id.toString(),
          date: log.date.toISOString().split('T')[0],
          lecture: (log.lecture as any)?.title || 'Virtual Lecture',
          status: log.status,
          duration: `${log.durationMinutes || 0} mins`,
          timeJoined: log.timeJoined ? new Date(log.timeJoined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
          reason: log.reason || '',
        })),
      });
    }

    const overallAttendanceRate = overallTotalLectures > 0
      ? Number(((overallAttendedLectures / overallTotalLectures) * 100).toFixed(1))
      : 0;

    return {
      studentId: student._id.toString(),
      studentName: student.name,
      matricNo: student.matricNo,
      department: student.department,
      overallAttendanceRate,
      overallTotalLectures,
      overallAttendedLectures,
      overallMissedLectures,
      overallLateLectures,
      overallExcusedLectures,
      totalHoursAttended: Math.round(totalLectureMinutes / 60),
      isOverallEligible: overallAttendanceRate >= 75,
      eligibleCoursesCount: courseBreakdown.filter((c) => c.isEligible).length,
      totalCoursesCount: courseBreakdown.length,
      courses: courseBreakdown,
    };
  }

  /**
   * Dynamic calculation of course attendance statistics
   */
  public static async getCourseAttendanceStats(
    courseId: string,
    user: AuthUserContext
  ): Promise<any> {
    if (!this.isValidId(courseId)) {
      const err = new Error('Invalid course ID format.');
      (err as any).statusCode = 400;
      throw err;
    }

    const course = await Course.findById(courseId).populate('lecturer', 'name email');
    if (!course) {
      const err = new Error('Course not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    // RBAC:
    if (user.role === 'student') {
      const err = new Error('Forbidden: Students cannot access course attendance statistics.');
      (err as any).statusCode = 403;
      throw err;
    }

    if (user.role === 'lecturer' && course.lecturer.toString() !== user.userId) {
      const err = new Error('Forbidden: You can only view statistics for your assigned courses.');
      (err as any).statusCode = 403;
      throw err;
    }

    // Enrolled students
    let students = await User.find({ _id: { $in: course.enrolledStudents }, role: 'student' });
    if (students.length === 0) {
      students = await User.find({ role: 'student', department: course.department, status: 'Active' });
    }

    const totalLectures = await Lecture.countDocuments({ course: course._id });
    const attendanceRecords = await Attendance.find({ course: course._id });

    const studentRoster = [];
    let sumPercentage = 0;

    for (const student of students) {
      const logs = attendanceRecords.filter((a) => a.student.toString() === student._id.toString());
      const attended = logs.filter(
        (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'Excused'
      ).length;
      const latestLog = logs[logs.length - 1];

      const rateNum = totalLectures > 0 ? Math.round((attended / totalLectures) * 100) : 0;
      sumPercentage += rateNum;

      studentRoster.push({
        id: student._id.toString(),
        matricNo: student.matricNo || 'ND2/CS/UNREGISTERED',
        name: student.name,
        avatar: student.avatar,
        status: latestLog ? latestLog.status : 'Absent',
        duration: latestLog ? `${latestLog.durationMinutes || 0} mins` : '0 mins',
        attended,
        totalLectures,
        rate: `${rateNum}%`,
        rateNumber: rateNum,
        isEligible: rateNum >= 75,
      });
    }

    const avgAttendancePercentage = students.length > 0
      ? Number((sumPercentage / students.length).toFixed(1))
      : 0;

    return {
      courseId: course._id.toString(),
      courseCode: course.code,
      courseTitle: course.title,
      department: course.department,
      lecturer: (course.lecturer as any)?.name || 'Faculty Lecturer',
      totalEnrolledStudents: students.length,
      totalLectures,
      totalAttendanceRecords: attendanceRecords.length,
      averageAttendancePercentage: avgAttendancePercentage,
      studentRoster,
    };
  }

  /**
   * Admin institutional attendance audit across all students
   */
  public static async getAdminAttendanceAudit(user: AuthUserContext): Promise<any> {
    if (user.role !== 'admin') {
      const err = new Error('Forbidden: Only administrators can access institutional attendance audit.');
      (err as any).statusCode = 403;
      throw err;
    }

    const students = await User.find({ role: 'student', status: 'Active' });
    const totalCourses = await Course.countDocuments();
    const totalLectures = await Lecture.countDocuments();

    const auditList = [];

    for (const s of students) {
      const logs = await Attendance.find({ student: s._id, lecture: { $exists: true, $ne: null } });
      const attended = logs.filter(
        (a) => a.status === 'Present' || a.status === 'Late' || a.status === 'Excused'
      ).length;

      const rateNum = totalLectures > 0 ? Math.round((attended / totalLectures) * 100) : 0;
      const isEligible = rateNum >= 75;

      auditList.push({
        id: s._id.toString(),
        name: s.name,
        email: s.email,
        matricNo: s.matricNo || 'ND2/CS/000',
        department: s.department,
        avatar: s.avatar,
        attendanceRate: `${rateNum}%`,
        rateNumber: rateNum,
        attendedLectures: attended,
        totalLectures,
        isEligible,
        status: isEligible ? 'Approved for Examination' : 'Below 75% Requirement',
      });
    }

    return {
      totalStudents: students.length,
      totalCourses,
      totalLectures,
      students: auditList,
    };
  }
}
export default AttendanceService;
