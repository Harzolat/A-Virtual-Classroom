import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User, GeneralSession } from '../models/index.js';
import { GeneralSessionService, ALLOWED_SESSION_CATEGORIES, ALLOWED_SESSION_MODES } from '../services/generalSession.service.js';
import { seedDatabase } from './seed.js';

async function runVerification() {
  console.log('=== STARTING PHASE 1G GENERAL SESSIONS API & MONGODB VERIFICATION ===');
  await connectDB();
  await seedDatabase();

  try {
    const student = await User.findOne({ role: 'student' });
    const lecturer1 = await User.findOne({ role: 'lecturer', email: 'lecturer1@nd2classroom.test' });
    const lecturer2 = await User.findOne({ role: 'lecturer', email: 'lecturer2@nd2classroom.test' });
    const admin = await User.findOne({ role: 'admin' });

    if (!student || !lecturer1 || !lecturer2 || !admin) {
      throw new Error('Test users missing from database');
    }

    console.log('✔ Test users loaded: student, lecturer1, lecturer2, admin');

    // 1. GET /api/general-sessions for all roles
    const studentSessions = await GeneralSessionService.getGeneralSessionsForUser(
      student._id.toString(),
      'student'
    );
    console.log(`✔ Student fetched ${studentSessions.length} general sessions`);

    const lecturerSessions = await GeneralSessionService.getGeneralSessionsForUser(
      lecturer1._id.toString(),
      'lecturer'
    );
    console.log(`✔ Lecturer fetched ${lecturerSessions.length} general sessions`);

    const adminSessions = await GeneralSessionService.getGeneralSessionsForUser(
      admin._id.toString(),
      'admin'
    );
    console.log(`✔ Admin fetched ${adminSessions.length} general sessions`);

    // 2. GET by ID & Safe Organizer Population
    if (studentSessions.length > 0) {
      const sampleSession = await GeneralSessionService.getGeneralSessionById(
        studentSessions[0]._id.toString(),
        student._id.toString(),
        'student'
      );
      console.log(`✔ Get by ID verified: "${sampleSession.title}"`);
      const org: any = sampleSession.organizer;
      if (org && org.passwordHash) {
        throw new Error('FAILED: Organizer passwordHash exposed!');
      }
      console.log(`✔ Safe organizer populated: ${org?.name} (${org?.email}) - passwordHash is hidden`);
    }

    // 3. Student attempting to create session -> 403 Forbidden
    try {
      await GeneralSessionService.createGeneralSession(
        {
          title: 'Student Hackathon Discussion',
          category: 'Project Discussion',
          scheduledDate: new Date(),
          startTime: '04:00 PM',
          endTime: '05:00 PM',
          mode: 'Video',
        },
        student._id.toString(),
        'student'
      );
      throw new Error('FAILED: Student should not be able to create session');
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('✔ Student session creation rejected with 403 Forbidden');
      } else {
        throw err;
      }
    }

    // 4. Missing required fields -> 400 Bad Request
    try {
      await GeneralSessionService.createGeneralSession(
        { title: 'Incomplete Session' },
        lecturer1._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Incomplete session creation should fail with 400');
    } catch (err: any) {
      if (err.statusCode === 400) {
        console.log('✔ Incomplete session rejected with 400 Bad Request');
      } else {
        throw err;
      }
    }

    // 5. Invalid Category -> 400 Bad Request
    try {
      await GeneralSessionService.createGeneralSession(
        {
          title: 'Invalid Category Session',
          category: 'Invalid Category Name Here',
          scheduledDate: new Date(),
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          mode: 'Video',
        },
        lecturer1._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Invalid category should fail with 400');
    } catch (err: any) {
      if (err.statusCode === 400) {
        console.log('✔ Invalid category rejected with 400 Bad Request');
      } else {
        throw err;
      }
    }

    // 6. Invalid Mode -> 400 Bad Request
    try {
      await GeneralSessionService.createGeneralSession(
        {
          title: 'Invalid Mode Session',
          category: 'Seminar',
          scheduledDate: new Date(),
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          mode: 'Telepathic',
        },
        lecturer1._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Invalid mode should fail with 400');
    } catch (err: any) {
      if (err.statusCode === 400) {
        console.log('✔ Invalid mode rejected with 400 Bad Request');
      } else {
        throw err;
      }
    }

    // 7. Lecturer creates session with auto-generated meetingId -> 201 Created
    const createdSession = await GeneralSessionService.createGeneralSession(
      {
        title: 'Algorithms Research Group Discussion',
        category: 'Project Discussion',
        description: 'Deep dive into graph search and dynamic programming optimization.',
        scheduledDate: new Date('2026-04-15'),
        startTime: '03:00 PM',
        endTime: '04:30 PM',
        mode: 'Video',
        maxCapacity: 60,
      },
      lecturer1._id.toString(),
      'lecturer'
    );
    console.log(`✔ Lecturer created session: "${createdSession.title}"`);
    console.log(`✔ Auto-generated meetingId: ${createdSession.meetingId}`);

    // 8. Duplicate meetingId -> 400 Bad Request
    try {
      await GeneralSessionService.createGeneralSession(
        {
          title: 'Duplicate Meeting ID Session',
          category: 'Seminar',
          scheduledDate: new Date('2026-04-16'),
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          mode: 'Video',
          meetingId: createdSession.meetingId,
        },
        lecturer2._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Duplicate meetingId should fail with 400');
    } catch (err: any) {
      if (err.statusCode === 400) {
        console.log('✔ Duplicate meetingId rejected with 400 Bad Request');
      } else {
        throw err;
      }
    }

    // 9. Student updating session -> 403 Forbidden
    try {
      await GeneralSessionService.updateGeneralSession(
        createdSession._id.toString(),
        { title: 'Hacked Title' },
        student._id.toString(),
        'student'
      );
      throw new Error('FAILED: Student should not update sessions');
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('✔ Student update rejected with 403 Forbidden');
      } else {
        throw err;
      }
    }

    // 10. Non-organizer lecturer updating session -> 403 Forbidden
    try {
      await GeneralSessionService.updateGeneralSession(
        createdSession._id.toString(),
        { title: 'Lecturer 2 Hijack' },
        lecturer2._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Non-organizer lecturer should not update session');
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('✔ Non-organizer lecturer update rejected with 403 Forbidden');
      } else {
        throw err;
      }
    }

    // 11. Organizer lecturer updating session -> 200 OK
    const updatedByOrganizer = await GeneralSessionService.updateGeneralSession(
      createdSession._id.toString(),
      {
        title: 'Algorithms Research Group Discussion (Updated)',
        category: 'Seminar',
        durationMinutes: 100,
      },
      lecturer1._id.toString(),
      'lecturer'
    );
    console.log(`✔ Organizer lecturer updated session: "${updatedByOrganizer.title}" (Category: ${updatedByOrganizer.category})`);

    // 12. Admin updating session -> 200 OK
    const updatedByAdmin = await GeneralSessionService.updateGeneralSession(
      createdSession._id.toString(),
      {
        description: 'Admin reviewed and approved agenda.',
      },
      admin._id.toString(),
      'admin'
    );
    console.log(`✔ Admin updated session successfully: "${updatedByAdmin.description}"`);

    // 13. Student deleting session -> 403 Forbidden
    try {
      await GeneralSessionService.deleteGeneralSession(
        createdSession._id.toString(),
        student._id.toString(),
        'student'
      );
      throw new Error('FAILED: Student should not delete sessions');
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('✔ Student delete rejected with 403 Forbidden');
      } else {
        throw err;
      }
    }

    // 14. Non-organizer lecturer deleting session -> 403 Forbidden
    try {
      await GeneralSessionService.deleteGeneralSession(
        createdSession._id.toString(),
        lecturer2._id.toString(),
        'lecturer'
      );
      throw new Error('FAILED: Non-organizer lecturer should not delete session');
    } catch (err: any) {
      if (err.statusCode === 403) {
        console.log('✔ Non-organizer lecturer delete rejected with 403 Forbidden');
      } else {
        throw err;
      }
    }

    // 15. Organizer lecturer deleting session -> 200 OK
    await GeneralSessionService.deleteGeneralSession(
      createdSession._id.toString(),
      lecturer1._id.toString(),
      'lecturer'
    );
    console.log('✔ Organizer lecturer deleted session successfully');

    // 16. Verify deletion
    try {
      await GeneralSessionService.getGeneralSessionById(
        createdSession._id.toString(),
        admin._id.toString(),
        'admin'
      );
      throw new Error('FAILED: Deleted session should return 404');
    } catch (err: any) {
      if (err.statusCode === 404) {
        console.log('✔ Verified session deletion returns 404');
      } else {
        throw err;
      }
    }

    console.log('=== ALL PHASE 1G VERIFICATION CHECKS PASSED WITH 100% SUCCESS ===');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    await disconnectDB();
    process.exit(1);
  }
}

runVerification();
