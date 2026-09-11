import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import apiRouter from '../routes/index.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { User, Course, Lecture, GeneralSession, Attendance } from '../models/index.js';

async function runPhase1iHttpTests() {
  console.log('=== Phase 1I Session Engine HTTP Endpoints Integration Test ===\n');

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

    // Student 2
    const s2Res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student2@nd2classroom.test', password: 'Student@12345' }),
    });
    const s2Data = await s2Res.json();
    if (!s2Res.ok || !s2Data.token) throw new Error('Student 2 login failed');
    const s2Token = s2Data.token;

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

    console.log('✓ All 5 test accounts authenticated.\n');

    // Retrieve active seed lecture and general session
    const liveLecture = await Lecture.findOne({ status: 'Live Now' });
    if (!liveLecture) throw new Error('Live lecture not found in seed data');
    const liveGeneral = await GeneralSession.findOne({ status: 'Live Now' });
    if (!liveGeneral) throw new Error('Live general session not found in seed data');

    console.log('--- 2. LECTURE JOIN / LEAVE HTTP ENDPOINTS ---');

    // Clean any prior attendance for student1 in liveLecture
    const student1User = await User.findOne({ email: 'student1@nd2classroom.test' });
    await Attendance.deleteMany({ lecture: liveLecture._id, student: student1User!._id });

    // HTTP Test 2.1: POST /api/sessions/lecture/:id/join (Unauthenticated -> 401)
    console.log('HTTP Test 2.1: Joining session without auth token (401 expected)...');
    const unauthJoin = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (unauthJoin.status !== 401) throw new Error(`Expected 401, got ${unauthJoin.status}`);
    console.log('✓ Unauthenticated join safely rejected with 401.');

    // HTTP Test 2.2: POST /api/sessions/lecture/:id/join (Student joins live lecture)
    console.log('HTTP Test 2.2: Student 1 joins live lecture via ID...');
    const joinRes1 = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
    });
    const joinData1 = await joinRes1.json();
    if (!joinRes1.ok || !joinData1.success || !joinData1.data?._id) {
      throw new Error(`Student 1 join failed: ${JSON.stringify(joinData1)}`);
    }
    console.log(`✓ Student 1 joined live lecture. Attendance Record ID: ${joinData1.data._id}.`);

    // HTTP Test 2.3: POST /api/sessions/lecture/:id/join (Duplicate join idempotent)
    console.log('HTTP Test 2.3: Student 1 duplicates join via meetingId...');
    const joinRes2 = await fetch(`${baseUrl}/sessions/lecture/${liveLecture.meetingId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
    });
    const joinData2 = await joinRes2.json();
    if (!joinRes2.ok || !joinData2.alreadyJoined || joinData2.data?._id !== joinData1.data._id) {
      throw new Error(`Duplicate join mismatch: ${JSON.stringify(joinData2)}`);
    }
    console.log('✓ Idempotent duplicate join returned alreadyJoined: true and matched existing record.');

    // HTTP Test 2.4: GET /api/sessions/lecture/:id/my-status
    console.log('HTTP Test 2.4: Student 1 verifies my-status...');
    const statusRes = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/my-status`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    const statusData = await statusRes.json();
    if (!statusRes.ok || !statusData.data?.joined || !statusData.data.attendance) {
      throw new Error(`my-status failed: ${JSON.stringify(statusData)}`);
    }
    console.log(`✓ my-status confirmed: joined = ${statusData.data.joined}, status = ${statusData.data.attendance.status}.`);

    // HTTP Test 2.5: GET /api/sessions/lecture/:id/participants (Lecturer retrieves roster)
    console.log('HTTP Test 2.5: Lecturer retrieves session participants roster...');
    const partRes = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/participants`, {
      headers: { Authorization: `Bearer ${l1Token}` },
    });
    const partData = await partRes.json();
    if (!partRes.ok || !Array.isArray(partData.data?.participants)) {
      throw new Error(`Participants retrieval failed: ${JSON.stringify(partData)}`);
    }
    console.log(`✓ Lecturer retrieved roster: ${partData.data.totalParticipants} total participants.`);

    // HTTP Test 2.6: GET /api/sessions/lecture/:id/participants (Student denied -> 403)
    console.log('HTTP Test 2.6: Student requests participant roster (403 expected)...');
    const studPartRes = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/participants`, {
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    if (studPartRes.status !== 403) throw new Error(`Expected 403, got ${studPartRes.status}`);
    console.log('✓ Student denied full participant roster with 403.');

    // HTTP Test 2.7: POST /api/sessions/lecture/:id/leave
    console.log('HTTP Test 2.7: Student 1 leaves live lecture...');
    const leaveRes = await fetch(`${baseUrl}/sessions/lecture/${liveLecture._id}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
      body: JSON.stringify({ timeLeft: new Date() }),
    });
    const leaveData = await leaveRes.json();
    if (!leaveRes.ok || !leaveData.data?.timeLeft) {
      throw new Error(`Leave session failed: ${JSON.stringify(leaveData)}`);
    }
    console.log(`✓ Student 1 left lecture: status = ${leaveData.data.status}, duration = ${leaveData.data.durationMinutes} min.`);

    console.log('\n--- 3. GENERAL VIRTUAL SESSIONS JOIN / LEAVE HTTP ENDPOINTS ---');

    // Clean student1 attendance in liveGeneral
    await Attendance.deleteMany({ generalSession: liveGeneral._id, student: student1User!._id });

    // HTTP Test 3.1: POST /api/sessions/general-session/:id/join
    console.log('HTTP Test 3.1: Student 1 joins live general session via meetingId...');
    const genJoinRes = await fetch(`${baseUrl}/sessions/general-session/${liveGeneral.meetingId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
    });
    const genJoinData = await genJoinRes.json();
    if (!genJoinRes.ok || !genJoinData.data?.generalSession) {
      throw new Error(`General session join failed: ${JSON.stringify(genJoinData)}`);
    }
    console.log(`✓ Student 1 joined general session: attendance record ${genJoinData.data._id}.`);

    // HTTP Test 3.2: POST /api/sessions/general-session/:id/leave
    console.log('HTTP Test 3.2: Student 1 leaves live general session...');
    const genLeaveRes = await fetch(`${baseUrl}/sessions/general-session/${liveGeneral.meetingId}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s1Token}`,
      },
    });
    const genLeaveData = await genLeaveRes.json();
    if (!genLeaveRes.ok || !genLeaveData.data?.timeLeft) {
      throw new Error(`General session leave failed: ${JSON.stringify(genLeaveData)}`);
    }
    console.log('✓ Student 1 successfully left general session.');

    console.log('\n--- 4. EDGE CASES & INVALID REQUESTS ---');

    // HTTP Test 4.1: Invalid session type (400)
    console.log('HTTP Test 4.1: Invalid session type (400 expected)...');
    const invalidTypeRes = await fetch(`${baseUrl}/sessions/seminar/${liveLecture._id}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    if (invalidTypeRes.status !== 400) throw new Error(`Expected 400, got ${invalidTypeRes.status}`);
    console.log('✓ Invalid session type returned 400.');

    // HTTP Test 4.2: Non-existent session ID (404)
    console.log('HTTP Test 4.2: Non-existent session ID (404 expected)...');
    const notFoundRes = await fetch(`${baseUrl}/sessions/lecture/507f1f77bcf86cd799439011/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${s1Token}` },
    });
    if (notFoundRes.status !== 404) throw new Error(`Expected 404, got ${notFoundRes.status}`);
    console.log('✓ Non-existent session returned 404.');

    console.log('\n=== ALL PHASE 1I HTTP INTEGRATION TESTS PASSED SUCCESSFULLY! ===\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runPhase1iHttpTests().catch((err) => {
  console.error('\n❌ Phase 1I HTTP Test Failed:', err);
  process.exit(1);
});
