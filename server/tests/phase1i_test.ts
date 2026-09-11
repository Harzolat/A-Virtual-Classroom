import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import { SessionService, type AuthUserContext } from '../services/session.service.js';
import { AttendanceService } from '../services/attendance.service.js';
import { Attendance, User, Course, Lecture, GeneralSession } from '../models/index.js';
import { Types } from 'mongoose';

async function runPhase1iTests() {
  console.log('=== Phase 1I Virtual Classroom Session Engine & Join/Leave Tests ===\n');

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

  console.log('--- 1. SESSION RESOLUTION ENGINE ---');

  // Find live lecture
  const liveLecture = await Lecture.findOne({ status: 'Live Now' });
  if (!liveLecture) throw new Error('Seed live lecture not found');

  // Test 1.1: Resolve lecture by ID
  console.log('Test 1.1: Resolving lecture by Mongo ID...');
  const resById = await SessionService.resolveSession('lecture', liveLecture._id.toString());
  if (resById.sessionType !== 'lecture' || resById.session._id.toString() !== liveLecture._id.toString()) {
    throw new Error('Failed to resolve lecture by ID');
  }
  console.log('✓ Lecture resolved by Mongo ID.');

  // Test 1.2: Resolve lecture by meetingId
  console.log('Test 1.2: Resolving lecture by meetingId...');
  const resByMeetingId = await SessionService.resolveSession('lecture', liveLecture.meetingId);
  if (resByMeetingId.session._id.toString() !== liveLecture._id.toString()) {
    throw new Error('Failed to resolve lecture by meetingId');
  }
  console.log('✓ Lecture resolved by meetingId.');

  // Test 1.3: Resolve general session by ID and meetingId
  const liveGeneralSession = await GeneralSession.findOne({ status: 'Live Now' });
  if (!liveGeneralSession) throw new Error('Seed live general session not found');

  console.log('Test 1.3: Resolving general session by Mongo ID and meetingId...');
  const resGenById = await SessionService.resolveSession('general-session', liveGeneralSession._id.toString());
  const resGenByMeetingId = await SessionService.resolveSession('general-session', liveGeneralSession.meetingId);
  if (resGenById.sessionType !== 'generalSession' || resGenByMeetingId.session._id.toString() !== liveGeneralSession._id.toString()) {
    throw new Error('Failed to resolve general session');
  }
  console.log('✓ General session resolved by Mongo ID and meetingId.');

  // Test 1.4: Reject invalid session type
  console.log('Test 1.4: Rejecting invalid session type...');
  try {
    await SessionService.resolveSession('invalid-type' as any, liveLecture._id.toString());
    throw new Error('Should have failed on invalid session type');
  } catch (err: any) {
    if (err.statusCode !== 400) throw err;
    console.log('✓ Invalid session type rejected with 400.');
  }

  // Test 1.5: 404 for non-existent session
  console.log('Test 1.5: 404 for non-existent session...');
  try {
    await SessionService.resolveSession('lecture', new Types.ObjectId().toString());
    throw new Error('Should have failed on non-existent session');
  } catch (err: any) {
    if (err.statusCode !== 404) throw err;
    console.log('✓ Non-existent session rejected with 404.');
  }

  console.log('\n--- 2. JOIN SESSION LIFECYCLE & DUPLICATE PROTECTION ---');

  // Clean any pre-existing attendance for student1 in liveLecture
  await Attendance.deleteMany({ lecture: liveLecture._id, student: student1._id });

  // Test 2.1: Student 1 joins live lecture
  console.log('Test 2.1: Student 1 joins live lecture...');
  const joinResult1 = await SessionService.joinSession('lecture', liveLecture._id.toString(), student1Context);
  if (joinResult1.alreadyJoined) {
    throw new Error('Should not be already joined on first attempt');
  }
  const attLectureId = (joinResult1.attendance.lecture as any)?._id?.toString() || joinResult1.attendance.lecture?.toString();
  if (attLectureId !== liveLecture._id.toString()) {
    throw new Error('Attendance record lecture ID mismatch');
  }
  console.log('✓ Student 1 successfully joined live lecture.');

  // Test 2.2: Idempotent duplicate join prevention
  console.log('Test 2.2: Idempotent duplicate join attempt...');
  const joinResult2 = await SessionService.joinSession('lecture', liveLecture.meetingId, student1Context);
  if (!joinResult2.alreadyJoined) {
    throw new Error('Should be detected as already joined');
  }
  if (joinResult2.attendance._id.toString() !== joinResult1.attendance._id.toString()) {
    throw new Error('Should return existing attendance record on duplicate join');
  }
  console.log('✓ Duplicate join safely returned alreadyJoined: true without creating duplicates.');

  // Test 2.3: Rejects joining non-live lecture (e.g. Scheduled)
  console.log('Test 2.3: Rejects joining scheduled lecture...');
  const scheduledLecture = await Lecture.findOne({ status: 'Scheduled' });
  if (scheduledLecture) {
    try {
      await SessionService.joinSession('lecture', scheduledLecture._id.toString(), student1Context);
      throw new Error('Should reject joining scheduled lecture');
    } catch (err: any) {
      if (err.statusCode !== 400) throw err;
      console.log('✓ Joining scheduled lecture rejected with 400.');
    }
  }

  // Test 2.4: Student joins live general session
  console.log('Test 2.4: Student 1 joins live general session...');
  await Attendance.deleteMany({ generalSession: liveGeneralSession._id, student: student1._id });
  const genJoinResult = await SessionService.joinSession('general-session', liveGeneralSession._id.toString(), student1Context);
  if (genJoinResult.alreadyJoined || !genJoinResult.attendance.generalSession) {
    throw new Error('Failed to join live general session');
  }
  console.log('✓ Student 1 successfully joined live general session.');

  console.log('\n--- 3. LEAVE SESSION LIFECYCLE & DURATION CALCULATION ---');

  // Test 3.1: Student 1 leaves live lecture
  console.log('Test 3.1: Student 1 leaves live lecture...');
  const leaveTime = new Date(Date.now() + 25 * 60 * 1000); // 25 mins later
  const leaveResult = await SessionService.leaveSession(
    'lecture',
    liveLecture._id.toString(),
    student1Context,
    { timeLeft: leaveTime }
  );
  if (!leaveResult.timeLeft) {
    throw new Error('Leave session did not update timeLeft');
  }
  if (typeof leaveResult.durationMinutes !== 'number' || leaveResult.durationMinutes <= 0) {
    throw new Error('Duration minutes calculation failed');
  }
  console.log(`✓ Student 1 left lecture: duration = ${leaveResult.durationMinutes} mins, status = ${leaveResult.status}.`);

  // Test 3.2: Error when leaving a session never joined
  console.log('Test 3.2: Rejects leave for session never joined...');
  await Attendance.deleteMany({ lecture: liveLecture._id, student: student2._id });
  try {
    await SessionService.leaveSession('lecture', liveLecture._id.toString(), student2Context);
    throw new Error('Should have failed for unjoined session');
  } catch (err: any) {
    if (err.statusCode !== 404) throw err;
    console.log('✓ Leaving unjoined session rejected with 404.');
  }

  console.log('\n--- 4. SESSION PARTICIPANTS & RBAC PERMISSIONS ---');

  // Ensure student1 has a record in liveLecture
  await SessionService.joinSession('lecture', liveLecture._id.toString(), student1Context);

  // Test 4.1: Assigned lecturer retrieves session participants
  console.log('Test 4.1: Assigned lecturer retrieves participants...');
  const lecturerParticipants = await SessionService.getSessionParticipants(
    'lecture',
    liveLecture._id.toString(),
    lecturer1Context
  );
  if (lecturerParticipants.totalParticipants === undefined || !Array.isArray(lecturerParticipants.participants)) {
    throw new Error('Participants format invalid');
  }
  console.log(`✓ Lecturer retrieved ${lecturerParticipants.participants.length} participants (Active: ${lecturerParticipants.activeCount}).`);

  // Test 4.2: Admin retrieves session participants
  console.log('Test 4.2: Admin retrieves participants...');
  const adminParticipants = await SessionService.getSessionParticipants(
    'lecture',
    liveLecture._id.toString(),
    adminContext
  );
  if (!Array.isArray(adminParticipants.participants)) {
    throw new Error('Admin participants format invalid');
  }
  console.log('✓ Admin successfully retrieved session participants.');

  // Test 4.3: Student denied access to full participant roster
  console.log('Test 4.3: Student denied access to participant roster...');
  try {
    await SessionService.getSessionParticipants('lecture', liveLecture._id.toString(), student1Context);
    throw new Error('Student should be forbidden from reading participant roster');
  } catch (err: any) {
    if (err.statusCode !== 403) throw err;
    console.log('✓ Student access to participant roster rejected with 403.');
  }

  // Test 4.4: Unassigned lecturer denied access
  console.log('Test 4.4: Unassigned lecturer denied access...');
  try {
    await SessionService.getSessionParticipants('lecture', liveLecture._id.toString(), lecturer2Context);
    throw new Error('Unassigned lecturer should be forbidden from lecture participants');
  } catch (err: any) {
    if (err.statusCode !== 403) throw err;
    console.log('✓ Unassigned lecturer access rejected with 403.');
  }

  console.log('\n--- 5. PERSONAL SESSION STATUS (MY-STATUS) ---');

  // Test 5.1: Student 1 gets my-status for joined session
  console.log('Test 5.1: Student 1 retrieves personal session status...');
  const myStatus = await SessionService.getMySessionStatus('lecture', liveLecture._id.toString(), student1Context);
  if (!myStatus.joined || !myStatus.attendance) {
    throw new Error('Student should be marked as joined');
  }
  console.log(`✓ Student 1 session status: joined = ${myStatus.joined}, status = ${myStatus.attendance.status}.`);

  // Test 5.2: Student 2 gets my-status for unjoined session
  console.log('Test 5.2: Student 2 retrieves personal status for unjoined session...');
  const student2Status = await SessionService.getMySessionStatus('lecture', liveLecture._id.toString(), student2Context);
  if (student2Status.joined !== false || student2Status.attendance !== null) {
    throw new Error('Student 2 should be marked as not joined');
  }
  console.log('✓ Student 2 correctly reported as not joined.');

  console.log('\n=== ALL PHASE 1I MODEL/SERVICE/RBAC TESTS PASSED SUCCESSFULLY! ===\n');
  await disconnectDB();
}

runPhase1iTests().catch((err) => {
  console.error('\n❌ Phase 1I Tests Failed:', err);
  process.exit(1);
});
