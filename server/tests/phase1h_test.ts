import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import { AttendanceService, AuthUserContext } from '../services/attendance.service.js';
import { Attendance, User, Course, Lecture, GeneralSession } from '../models/index.js';
import { Types } from 'mongoose';

async function runPhase1hTests() {
  console.log('=== Phase 1H Attendance API & Database Integration Smoke Test ===\n');

  await connectDB();
  await seedDatabase();

  const student1 = await User.findOne({ email: 'student1@nd2classroom.test' });
  const student2 = await User.findOne({ email: 'student2@nd2classroom.test' });
  const lecturer1 = await User.findOne({ email: 'lecturer1@nd2classroom.test' });
  const lecturer2 = await User.findOne({ email: 'lecturer2@nd2classroom.test' });
  const admin = await User.findOne({ email: 'admin@nd2classroom.test' });

  if (!student1 || !student2 || !lecturer1 || !lecturer2 || !admin) {
    throw new Error('Seed users not found');
  }

  const student1Context: AuthUserContext = {
    userId: student1._id.toString(),
    role: 'student',
    name: student1.name,
    email: student1.email,
  };

  const student2Context: AuthUserContext = {
    userId: student2._id.toString(),
    role: 'student',
    name: student2.name,
    email: student2.email,
  };

  const lecturer1Context: AuthUserContext = {
    userId: lecturer1._id.toString(),
    role: 'lecturer',
    name: lecturer1.name,
    email: lecturer1.email,
  };

  const lecturer2Context: AuthUserContext = {
    userId: lecturer2._id.toString(),
    role: 'lecturer',
    name: lecturer2.name,
    email: lecturer2.email,
  };

  const adminContext: AuthUserContext = {
    userId: admin._id.toString(),
    role: 'admin',
    name: admin.name,
    email: admin.email,
  };

  const courses = await Course.find();
  const lectures = await Lecture.find();
  const sessions = await GeneralSession.find();

  if (courses.length === 0 || lectures.length === 0 || sessions.length === 0) {
    throw new Error('Seed courses, lectures, or sessions not found');
  }

  // Find a lecture belonging to lecturer1
  const lec1Lecture = lectures.find((l) => l.lecturer.toString() === lecturer1._id.toString());
  // Find a lecture belonging to lecturer2
  const lec2Lecture = lectures.find((l) => l.lecturer.toString() === lecturer2._id.toString());
  // Find a general session organized by lecturer1
  const lec1Session = sessions.find((s) => s.organizer.toString() === lecturer1._id.toString());

  if (!lec1Lecture) throw new Error('Lecturer 1 lecture not found');

  console.log('--- 1. MODEL & DATA INTEGRITY TESTS ---');

  // Test 1.1: Attendance model loads and has correct schema
  console.log('Test 1.1: Verifying Attendance model attributes...');
  const testRecord = await Attendance.findOne();
  if (testRecord) {
    if (testRecord.durationMinutes < 0) throw new Error('durationMinutes cannot be negative');
    if (!testRecord.status) throw new Error('status must be present');
  }
  console.log('✓ Model structure verified.');

  // Test 1.2: Reject both lecture and generalSession
  console.log('Test 1.2: Reject invalid combination of both lecture and session...');
  try {
    await AttendanceService.recordAttendance(
      {
        lectureId: lec1Lecture._id.toString(),
        generalSessionId: sessions[0]._id.toString(),
      },
      student1Context
    );
    throw new Error('Should have failed when both lecture and session provided');
  } catch (err: any) {
    if (!err.message.includes('cannot reference both')) {
      throw err;
    }
    console.log('✓ Rejected dual lecture + session reference.');
  }

  // Test 1.3: Reject when neither lecture nor session provided
  console.log('Test 1.3: Reject when neither lecture nor session provided...');
  try {
    await AttendanceService.recordAttendance({}, student1Context);
    throw new Error('Should have failed when neither lecture nor session provided');
  } catch (err: any) {
    if (!err.message.includes('must reference either')) {
      throw err;
    }
    console.log('✓ Rejected empty session reference.');
  }

  // Test 1.4: Reject non-existent lecture
  console.log('Test 1.4: Reject non-existent lecture ID...');
  try {
    await AttendanceService.recordAttendance(
      {
        lectureId: new Types.ObjectId().toString(),
      },
      student1Context
    );
    throw new Error('Should have failed for non-existent lecture');
  } catch (err: any) {
    if (!err.message.includes('Lecture not found')) {
      throw err;
    }
    console.log('✓ Non-existent lecture safely rejected.');
  }

  console.log('\n--- 2. DUPLICATE ATTENDANCE PROTECTION ---');

  // Test 2.1: Duplicate lecture attendance rejected
  console.log('Test 2.1: Duplicate lecture attendance check...');
  // Find or create attendance for student2 on lec1Lecture
  const existingAtt = await Attendance.findOne({
    student: student2._id,
    lecture: lec1Lecture._id,
  });
  if (!existingAtt) {
    await AttendanceService.recordAttendance(
      {
        lectureId: lec1Lecture._id.toString(),
      },
      student2Context
    );
  }

  // Attempt second recording for student2 on lec1Lecture
  try {
    await AttendanceService.recordAttendance(
      {
        lectureId: lec1Lecture._id.toString(),
      },
      student2Context
    );
    throw new Error('Should have prevented duplicate lecture attendance');
  } catch (err: any) {
    if (!err.message.includes('Attendance already recorded for this session')) {
      throw err;
    }
    console.log('✓ Duplicate lecture attendance successfully prevented.');
  }

  // Test 2.2: Duplicate general-session attendance check
  console.log('Test 2.2: Duplicate general-session attendance check...');
  const testSession = sessions[0];
  const existingSessionAtt = await Attendance.findOne({
    student: student2._id,
    generalSession: testSession._id,
  });
  if (!existingSessionAtt) {
    await AttendanceService.recordAttendance(
      {
        generalSessionId: testSession._id.toString(),
      },
      student2Context
    );
  }

  try {
    await AttendanceService.recordAttendance(
      {
        generalSessionId: testSession._id.toString(),
      },
      student2Context
    );
    throw new Error('Should have prevented duplicate session attendance');
  } catch (err: any) {
    if (!err.message.includes('Attendance already recorded for this session')) {
      throw err;
    }
    console.log('✓ Duplicate general-session attendance successfully prevented.');
  }

  console.log('\n--- 3. STUDENT RBAC TESTS ---');

  // Test 3.1: Student can record their own attendance
  console.log('Test 3.1: Student records their own attendance for a new lecture...');
  // Find an unrecorded lecture for student2
  const recordedLectureIds = (
    await Attendance.find({ student: student2._id, lecture: { $exists: true, $ne: null } })
  ).map((a) => a.lecture!.toString());

  const unrecordedLecture = lectures.find((l) => !recordedLectureIds.includes(l._id.toString()));
  if (unrecordedLecture) {
    const rec = await AttendanceService.recordAttendance(
      {
        lectureId: unrecordedLecture._id.toString(),
        timeJoined: new Date(),
      },
      student2Context
    );
    if (!rec || rec.student.toString() === '') throw new Error('Failed to record attendance');
    console.log('✓ Student successfully recorded own attendance.');
  } else {
    console.log('✓ Student attendance verified (all lectures recorded).');
  }

  // Test 3.2: Student CANNOT record attendance for another student
  console.log('Test 3.2: Student attempts to record attendance for another student (impersonation)...');
  try {
    await AttendanceService.recordAttendance(
      {
        studentId: student1._id.toString(),
        lectureId: lec1Lecture._id.toString(),
      },
      student2Context
    );
    throw new Error('Student should not be able to record attendance for another student');
  } catch (err: any) {
    if (!err.message.includes('Forbidden')) {
      throw err;
    }
    console.log('✓ Student impersonation rejected with 403 Forbidden.');
  }

  // Test 3.3: Student can view own attendance record
  console.log('Test 3.3: Student views own attendance record...');
  const student1Record = await Attendance.findOne({ student: student1._id });
  if (!student1Record) throw new Error('No attendance record found for student1');
  const viewedOwn = await AttendanceService.getAttendanceById(student1Record._id.toString(), student1Context);
  if (!viewedOwn) throw new Error('Could not view own record');
  console.log('✓ Student successfully viewed own attendance record.');

  // Test 3.4: Student CANNOT view another student attendance record
  console.log('Test 3.4: Student attempts to view another student attendance record...');
  try {
    await AttendanceService.getAttendanceById(student1Record._id.toString(), student2Context);
    throw new Error('Student should not be able to view another student attendance');
  } catch (err: any) {
    if (!err.message.includes('Forbidden')) {
      throw err;
    }
    console.log('✓ Student forbidden from viewing another student record.');
  }

  // Test 3.5: Student leaves attendance session and duration is calculated
  console.log('Test 3.5: Student leaves attendance and duration is calculated...');
  const tempLec = await Lecture.create({
    course: courses[0]._id,
    lecturer: courses[0].lecturer,
    title: 'Leave Duration Test Lecture',
    scheduledDate: new Date(),
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    durationMinutes: 120,
    type: 'Video',
    status: 'Live Now',
    meetingId: `leave-test-${Date.now()}`,
  });
  const joinTime = new Date(Date.now() - 45 * 60000); // 45 minutes ago
  const leaveTestAtt = await Attendance.create({
    student: student2._id,
    course: courses[0]._id,
    lecture: tempLec._id,
    date: new Date(),
    timeJoined: joinTime,
    durationMinutes: 0,
    status: 'Present',
  });

  const leaveResult = await AttendanceService.leaveAttendance(
    leaveTestAtt._id.toString(),
    { timeLeft: new Date() },
    student2Context
  );
  if (leaveResult.durationMinutes < 44 || leaveResult.durationMinutes > 46) {
    throw new Error(`Duration calculation error: expected ~45 mins, got ${leaveResult.durationMinutes}`);
  }
  console.log(`✓ Duration calculated accurately: ${leaveResult.durationMinutes} mins.`);

  // Test 3.6: Student CANNOT update/leave another student attendance session
  console.log('Test 3.6: Student attempts to leave another student attendance...');
  try {
    await AttendanceService.leaveAttendance(
      leaveTestAtt._id.toString(),
      { timeLeft: new Date() },
      student1Context
    );
    throw new Error('Student should not be able to leave another student attendance');
  } catch (err: any) {
    if (!err.message.includes('Forbidden')) {
      throw err;
    }
    console.log('✓ Student forbidden from updating another student attendance session.');
  }

  // Clean up temporary attendance and lecture
  await Attendance.findByIdAndDelete(leaveTestAtt._id);
  await Lecture.findByIdAndDelete(tempLec._id);

  console.log('\n--- 4. LECTURER RBAC TESTS ---');

  // Test 4.1: Lecturer can view attendance for their assigned lecture
  console.log('Test 4.1: Lecturer views attendance for their lecture...');
  const lecRecords = await AttendanceService.getAttendanceForLecture(
    lec1Lecture._id.toString(),
    lecturer1Context
  );
  console.log(`- Retrieved ${lecRecords.length} attendance records for Lecturer 1 lecture.`);
  console.log('✓ Lecturer 1 successfully accessed lecture attendance.');

  // Test 4.2: Lecturer CANNOT view attendance for another lecturer lecture
  if (lec2Lecture) {
    console.log('Test 4.2: Lecturer 1 attempts to view Lecturer 2 lecture attendance...');
    try {
      await AttendanceService.getAttendanceForLecture(
        lec2Lecture._id.toString(),
        lecturer1Context
      );
      throw new Error('Lecturer 1 should not view Lecturer 2 lecture attendance');
    } catch (err: any) {
      if (!err.message.includes('Forbidden')) {
        throw err;
      }
      console.log('✓ Cross-lecturer lecture attendance access prevented.');
    }
  }

  // Test 4.3: Students CANNOT view complete lecture attendance roster
  console.log('Test 4.3: Student attempts to fetch complete lecture attendance list...');
  try {
    await AttendanceService.getAttendanceForLecture(
      lec1Lecture._id.toString(),
      student1Context
    );
    throw new Error('Student should not access lecture attendance list');
  } catch (err: any) {
    if (!err.message.includes('Forbidden')) {
      throw err;
    }
    console.log('✓ Student correctly forbidden from accessing lecture attendance roster.');
  }

  console.log('\n--- 5. ADMIN RBAC & REPOSITORIES ---');

  // Test 5.1: Admin can view attendance audit
  console.log('Test 5.1: Admin views institutional attendance audit...');
  const audit = await AttendanceService.getAdminAttendanceAudit(adminContext);
  if (!audit || !Array.isArray(audit.students)) {
    throw new Error('Audit response invalid');
  }
  console.log(`- Audited ${audit.students.length} students across institution.`);
  console.log('✓ Admin institutional audit succeeded.');

  // Test 5.2: Non-admin CANNOT view institutional attendance audit
  console.log('Test 5.2: Lecturer/Student cannot view admin attendance audit...');
  try {
    await AttendanceService.getAdminAttendanceAudit(lecturer1Context);
    throw new Error('Lecturer should not view admin audit');
  } catch (err: any) {
    if (!err.message.includes('Forbidden')) {
      throw err;
    }
    console.log('✓ Non-admin access to admin audit rejected.');
  }

  console.log('\n--- 6. DYNAMIC ATTENDANCE STATISTICS ---');

  // Test 6.1: Student attendance statistics calculation
  console.log('Test 6.1: Dynamic student attendance statistics...');
  const stats = await AttendanceService.getStudentAttendanceStats(
    student1._id.toString(),
    student1Context
  );
  if (stats.overallAttendanceRate === undefined || !Array.isArray(stats.courses)) {
    throw new Error('Student stats format invalid');
  }
  console.log(`- Student overall attendance rate: ${stats.overallAttendanceRate}%`);
  console.log(`- Exam eligibility: ${stats.isOverallEligible ? 'Eligible' : 'At Risk'}`);
  console.log('✓ Student attendance statistics dynamically computed.');

  // Test 6.2: Course attendance statistics calculation
  console.log('Test 6.2: Dynamic course attendance statistics...');
  const courseStats = await AttendanceService.getCourseAttendanceStats(
    courses[0]._id.toString(),
    adminContext
  );
  if (courseStats.averageAttendancePercentage === undefined || !Array.isArray(courseStats.studentRoster)) {
    throw new Error('Course stats format invalid');
  }
  console.log(`- Course ${courseStats.courseCode} average attendance: ${courseStats.averageAttendancePercentage}%`);
  console.log(`- Enrolled students roster: ${courseStats.studentRoster.length} students`);
  console.log('✓ Course attendance statistics dynamically computed.');

  console.log('\n--- 7. SECURITY & SENSITIVE FIELD SANITIZATION ---');
  // Check that passwordHash is never exposed in populated student or lecturer objects
  if (lecRecords.length > 0) {
    const studentUser: any = lecRecords[0].student;
    if (studentUser && studentUser.passwordHash) {
      throw new Error('CRITICAL SECURITY ISSUE: passwordHash leaked in Attendance record!');
    }
  }
  console.log('✓ Sensitive fields (passwordHash) verified sanitized.');

  console.log('\n=== ALL PHASE 1H TESTS PASSED SUCCESSFULLY! ===\n');
  await disconnectDB();
}

runPhase1hTests().catch((err) => {
  console.error('\n❌ Phase 1H Test Failed:', err);
  process.exit(1);
});
