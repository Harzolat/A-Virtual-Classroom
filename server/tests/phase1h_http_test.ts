import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import apiRouter from '../routes/index.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { User, Course, Lecture, GeneralSession, Attendance } from '../models/index.js';

async function runHttpTests() {
  console.log('=== Phase 1H HTTP Endpoints & Integration Test ===\n');

  await connectDB();
  await seedDatabase();

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api', apiRouter);
  app.use(errorHandler);

  const server = app.listen(0);
  const address: any = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api`;

  try {
    // 1. Logins
    console.log('HTTP Test 1: Authenticating test accounts...');
    // Student 1
    const s1Res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student1@nd2classroom.test', password: 'Student@12345' }),
    });
    const s1Data = await s1Res.json();
    if (!s1Res.ok || !s1Data.token) throw new Error('Student 1 login failed');
    const s1Token = s1Data.token;
    const s1User = s1Data.user;

    // Student 2
    const s2Res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student2@nd2classroom.test', password: 'Student@12345' }),
    });
    const s2Data = await s2Res.json();
    if (!s2Res.ok || !s2Data.token) throw new Error('Student 2 login failed');
    const s2Token = s2Data.token;
    const s2User = s2Data.user;

    // Lecturer 1
    const l1Res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'lecturer1@nd2classroom.test', password: 'Lecturer@12345' }),
    });
    const l1Data = await l1Res.json();
    if (!l1Res.ok || !l1Data.token) throw new Error('Lecturer 1 login failed');
    const l1Token = l1Data.token;

    // Lecturer 2
    const l2Res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'lecturer2@nd2classroom.test', password: 'Lecturer@12345' }),
    });
    const l2Data = await l2Res.json();
    if (!l2Res.ok || !l2Data.token) throw new Error('Lecturer 2 login failed');
    const l2Token = l2Data.token;

    // Admin
    const adminRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nd2classroom.test', password: 'Admin@12345' }),
    });
    const adminData = await adminRes.json();
    if (!adminRes.ok || !adminData.token) throw new Error('Admin login failed');
    const adminToken = adminData.token;

    console.log('✓ All role authentication tokens issued successfully.');

    const lectures = await Lecture.find();
    const courses = await Course.find();
    const sessions = await GeneralSession.find();

    const lec1Lecture = lectures.find((l) => l.lecturer.toString() === l1Data.user.id);
    const lec2Lecture = lectures.find((l) => l.lecturer.toString() === l2Data.user.id);

    if (!lec1Lecture) throw new Error('No lecture for Lecturer 1');

    // HTTP Test 2: Unauthenticated POST /api/attendance -> 401
    console.log('\nHTTP Test 2: Unauthenticated POST /api/attendance -> 401 Unauthorized...');
    const unauthRes = await fetch(`${baseUrl}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lectureId: lec1Lecture._id.toString() }),
    });
    if (unauthRes.status !== 401) {
      throw new Error(`Expected 401, got ${unauthRes.status}`);
    }
    console.log('✓ Unauthenticated request rejected with 401 Unauthorized.');

    // HTTP Test 3: Student records attendance for a fresh lecture session
    console.log('\nHTTP Test 3: Student records attendance for unrecorded lecture -> 201 Created...');
    // Create a temporary lecture to avoid seed duplicate conflicts
    const tempLecture = await Lecture.create({
      course: courses[0]._id,
      lecturer: courses[0].lecturer,
      title: 'HTTP Test Temporary Lecture',
      scheduledDate: new Date(),
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      durationMinutes: 120,
      type: 'Video',
      status: 'Live Now',
      meetingId: `test-mtg-${Date.now()}`,
    });

    const recordRes = await fetch(`${baseUrl}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
      body: JSON.stringify({
        lectureId: tempLecture._id.toString(),
        timeJoined: new Date(),
      }),
    });
    const recordData = await recordRes.json();
    if (recordRes.status !== 201 || !recordData.data?._id) {
      throw new Error(`Expected 201 Created, got ${recordRes.status}: ${JSON.stringify(recordData)}`);
    }
    const createdAttendanceId = recordData.data._id;
    console.log(`✓ Attendance recorded successfully (ID: ${createdAttendanceId}) with 201 Created.`);

    // HTTP Test 4: Duplicate attendance attempt -> 400 Bad Request
    console.log('\nHTTP Test 4: Duplicate attendance attempt -> 400 Bad Request...');
    const dupRes = await fetch(`${baseUrl}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
      body: JSON.stringify({
        lectureId: tempLecture._id.toString(),
      }),
    });
    const dupData = await dupRes.json();
    if (dupRes.status !== 400) {
      throw new Error(`Expected 400 Bad Request, got ${dupRes.status}: ${JSON.stringify(dupData)}`);
    }
    console.log('✓ Duplicate attendance rejected with 400 Bad Request.');

    // HTTP Test 5: Student attempts to record for another student -> 403 Forbidden
    console.log('\nHTTP Test 5: Student impersonation -> 403 Forbidden...');
    const impRes = await fetch(`${baseUrl}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
      body: JSON.stringify({
        studentId: s2User.id,
        lectureId: tempLecture._id.toString(),
      }),
    });
    if (impRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${impRes.status}`);
    }
    console.log('✓ Student impersonation rejected with 403 Forbidden.');

    // HTTP Test 6: Student views own attendance record -> 200 OK
    console.log('\nHTTP Test 6: Student views own attendance record -> 200 OK...');
    const viewOwnRes = await fetch(`${baseUrl}/attendance/${createdAttendanceId}`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    const viewOwnData = await viewOwnRes.json();
    if (viewOwnRes.status !== 200 || !viewOwnData.data) {
      throw new Error(`Expected 200, got ${viewOwnRes.status}`);
    }
    console.log('✓ Student successfully retrieved own record with 200 OK.');

    // HTTP Test 7: Student attempts to view another student record -> 403 Forbidden
    console.log('\nHTTP Test 7: Student views another student record -> 403 Forbidden...');
    const viewOtherRes = await fetch(`${baseUrl}/attendance/${createdAttendanceId}`, {
      headers: { Authorization: `Bearer ${s2Token}` },
    });
    if (viewOtherRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${viewOtherRes.status}`);
    }
    console.log('✓ Cross-student record viewing blocked with 403 Forbidden.');

    // HTTP Test 8: Student leaves classroom / records leave time -> 200 OK
    console.log('\nHTTP Test 8: Student leaves session via PATCH /api/attendance/:id/leave -> 200 OK...');
    const leaveRes = await fetch(`${baseUrl}/attendance/${createdAttendanceId}/leave`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
      body: JSON.stringify({
        timeLeft: new Date(),
        reason: 'Regular session conclusion',
      }),
    });
    const leaveData = await leaveRes.json();
    if (leaveRes.status !== 200 || !leaveData.data?.timeLeft) {
      throw new Error(`Expected 200 OK with timeLeft, got ${leaveRes.status}: ${JSON.stringify(leaveData)}`);
    }
    console.log(`✓ Leave time and duration (${leaveData.data.durationMinutes} mins) recorded with 200 OK.`);

    // HTTP Test 9: Student gets own stats -> 200 OK
    console.log('\nHTTP Test 9: GET /api/attendance/student/:id/stats -> 200 OK...');
    const statsRes = await fetch(`${baseUrl}/attendance/student/${s1User.id}/stats`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    const statsData = await statsRes.json();
    if (statsRes.status !== 200 || statsData.data?.overallAttendanceRate === undefined) {
      throw new Error(`Expected 200 with stats, got ${statsRes.status}`);
    }
    console.log(`✓ Overall Attendance Rate: ${statsData.data.overallAttendanceRate}% (200 OK).`);

    // HTTP Test 10: Student attempts to get another student stats -> 403 Forbidden
    console.log('\nHTTP Test 10: Student attempts to access another student stats -> 403 Forbidden...');
    const badStatsRes = await fetch(`${baseUrl}/attendance/student/${s2User.id}/stats`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    if (badStatsRes.status !== 403) {
      throw new Error(`Expected 403, got ${badStatsRes.status}`);
    }
    console.log('✓ Access to other student stats rejected with 403 Forbidden.');

    // HTTP Test 11: Lecturer views assigned lecture attendance -> 200 OK
    console.log('\nHTTP Test 11: Lecturer views assigned lecture attendance -> 200 OK...');
    const lecAttRes = await fetch(`${baseUrl}/attendance/lecture/${lec1Lecture._id}`, {
      headers: { Authorization: `Bearer ${l1Token}` },
    });
    const lecAttData = await lecAttRes.json();
    if (lecAttRes.status !== 200 || !Array.isArray(lecAttData.data)) {
      throw new Error(`Expected 200, got ${lecAttRes.status}`);
    }
    console.log(`✓ Lecturer received ${lecAttData.data.length} attendance records with 200 OK.`);

    // HTTP Test 12: Student attempts to view complete lecture attendance roster -> 403 Forbidden
    console.log('\nHTTP Test 12: Student attempts to view lecture attendance roster -> 403 Forbidden...');
    const studLecAttRes = await fetch(`${baseUrl}/attendance/lecture/${lec1Lecture._id}`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    if (studLecAttRes.status !== 403) {
      throw new Error(`Expected 403, got ${studLecAttRes.status}`);
    }
    console.log('✓ Student forbidden from accessing lecture roster with 403 Forbidden.');

    // HTTP Test 13: Admin institutional compliance audit -> 200 OK
    console.log('\nHTTP Test 13: Admin GET /api/attendance/audit -> 200 OK...');
    const auditRes = await fetch(`${baseUrl}/attendance/audit`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const auditData = await auditRes.json();
    if (auditRes.status !== 200 || !Array.isArray(auditData.data?.students)) {
      throw new Error(`Expected 200, got ${auditRes.status}`);
    }
    console.log(`✓ Admin audit returned ${auditData.data.students.length} student records (200 OK).`);

    // HTTP Test 14: Non-admin attempts to access audit -> 403 Forbidden
    console.log('\nHTTP Test 14: Lecturer attempts to access /api/attendance/audit -> 403 Forbidden...');
    const badAuditRes = await fetch(`${baseUrl}/attendance/audit`, {
      headers: { Authorization: `Bearer ${l1Token}` },
    });
    if (badAuditRes.status !== 403) {
      throw new Error(`Expected 403, got ${badAuditRes.status}`);
    }
    console.log('✓ Non-admin access to audit rejected with 403 Forbidden.');

    // HTTP Test 15: Health check regression test -> 200 OK
    console.log('\nHTTP Test 15: Regression check GET /api/health -> 200 OK...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    if (healthRes.status !== 200 || healthData.success !== true) {
      throw new Error(`Expected 200 OK with success: true, got ${healthRes.status}`);
    }
    console.log('✓ GET /api/health verified healthy with 200 OK.');

    // Clean up temporary lecture and attendance
    await Attendance.deleteMany({ lecture: tempLecture._id });
    await Lecture.findByIdAndDelete(tempLecture._id);

    console.log('\n=== ALL HTTP INTEGRATION TESTS PASSED SUCCESSFULLY! ===\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runHttpTests().catch((err) => {
  console.error('\n❌ HTTP Integration Test Failed:', err);
  process.exit(1);
});
