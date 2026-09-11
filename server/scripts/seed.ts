import bcrypt from 'bcryptjs';
import { User, Course, Lecture, Material, GeneralSession, Attendance } from '../models/index.js';

export async function seedDatabase(): Promise<void> {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already populated with users.');
      // Check if attendance needs seeding in existing database
      const attendanceCount = await Attendance.countDocuments();
      if (attendanceCount === 0) {
        console.log('[Seed] Seeding initial attendance records for existing dataset...');
        const student1 = await User.findOne({ email: 'student1@nd2classroom.test' });
        const student2 = await User.findOne({ email: 'student2@nd2classroom.test' });
        const lectures = await Lecture.find().limit(5);
        const sessions = await GeneralSession.find().limit(3);

        if (student1 && student2 && lectures.length > 0) {
          const records: any[] = [];
          if (lectures[0]) {
            records.push({
              student: student1._id,
              course: lectures[0].course,
              lecture: lectures[0]._id,
              date: new Date('2026-03-20'),
              timeJoined: new Date('2026-03-20T10:01:00'),
              timeLeft: new Date('2026-03-20T11:58:00'),
              durationMinutes: 117,
              status: 'Present',
            });
            records.push({
              student: student2._id,
              course: lectures[0].course,
              lecture: lectures[0]._id,
              date: new Date('2026-03-20'),
              timeJoined: new Date('2026-03-20T10:18:00'),
              timeLeft: new Date('2026-03-20T11:55:00'),
              durationMinutes: 97,
              status: 'Late',
              reason: 'Network connectivity delay',
            });
          }
          if (lectures[1]) {
            records.push({
              student: student1._id,
              course: lectures[1].course,
              lecture: lectures[1]._id,
              date: new Date('2026-03-21'),
              timeJoined: new Date('2026-03-21T14:00:00'),
              timeLeft: new Date('2026-03-21T16:00:00'),
              durationMinutes: 120,
              status: 'Present',
            });
          }
          if (lectures[2]) {
            records.push({
              student: student1._id,
              course: lectures[2].course,
              lecture: lectures[2]._id,
              date: new Date('2026-03-22'),
              timeJoined: new Date('2026-03-22T09:02:00'),
              timeLeft: new Date('2026-03-22T10:55:00'),
              durationMinutes: 113,
              status: 'Present',
            });
          }
          if (sessions[1]) {
            records.push({
              student: student1._id,
              generalSession: sessions[1]._id,
              date: new Date('2026-03-25'),
              timeJoined: new Date('2026-03-25T14:00:00'),
              timeLeft: new Date('2026-03-25T15:30:00'),
              durationMinutes: 90,
              status: 'Present',
            });
            records.push({
              student: student2._id,
              generalSession: sessions[1]._id,
              date: new Date('2026-03-25'),
              timeJoined: new Date('2026-03-25T14:05:00'),
              timeLeft: new Date('2026-03-25T15:25:00'),
              durationMinutes: 80,
              status: 'Present',
            });
          }

          for (const rec of records) {
            try {
              await Attendance.create(rec);
            } catch {
              // ignore duplicate or index error
            }
          }
          console.log('[Seed] Attendance records successfully initialized for existing dataset.');
        }
      }
      return;
    }

    console.log('[Seed] Seeding initial users, courses, lectures, materials, and general sessions...');

    // Hash Passwords
    const studentPasswordHash = await bcrypt.hash('Student@12345', 10);
    const lecturerPasswordHash = await bcrypt.hash('Lecturer@12345', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);

    // 1. Create Users
    const student1 = await User.create({
      role: 'student',
      name: 'Oluwaseun Adebayo',
      email: 'student1@nd2classroom.test',
      passwordHash: studentPasswordHash,
      department: 'Computer Science',
      matricNo: 'ND2/CS/2026/001',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ND2/CS/2026/001',
      status: 'Active',
    });

    const student2 = await User.create({
      role: 'student',
      name: 'Fatima Abubakar',
      email: 'student2@nd2classroom.test',
      passwordHash: studentPasswordHash,
      department: 'Computer Science',
      matricNo: 'ND2/CS/2026/002',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ND2/CS/2026/002',
      status: 'Active',
    });

    const lecturer1 = await User.create({
      role: 'lecturer',
      name: 'Dr. Babatunde Lawal',
      email: 'lecturer1@nd2classroom.test',
      passwordHash: lecturerPasswordHash,
      department: 'Computer Science',
      staffId: 'STAFF/CS/001',
      designation: 'Senior Lecturer',
      office: 'Block B Room 12',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      status: 'Active',
    });

    const lecturer2 = await User.create({
      role: 'lecturer',
      name: 'Engr. Grace Adebayo',
      email: 'lecturer2@nd2classroom.test',
      passwordHash: lecturerPasswordHash,
      department: 'Computer Science',
      staffId: 'STAFF/CS/002',
      designation: 'Lecturer I',
      office: 'Block B Room 14',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      status: 'Active',
    });

    const lecturer3 = await User.create({
      role: 'lecturer',
      name: 'Dr. Emmanuel Okonkwo',
      email: 'lecturer3@nd2classroom.test',
      passwordHash: lecturerPasswordHash,
      department: 'Computer Science',
      staffId: 'STAFF/CS/003',
      designation: 'Principal Lecturer',
      office: 'Block A Room 05',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      status: 'Active',
    });

    const adminUser = await User.create({
      role: 'admin',
      name: 'Prof. Anthony Johnson',
      email: 'admin@nd2classroom.test',
      passwordHash: adminPasswordHash,
      department: 'Computer Science',
      staffId: 'STAFF/ADM/001',
      designation: 'HOD & Portal Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      status: 'Active',
    });

    // 2. Create Courses
    const course1 = await Course.create({
      code: 'COM 221',
      title: 'Data Structures & Algorithms',
      department: 'Computer Science',
      creditUnit: 3,
      semester: 'ND II 2nd Semester',
      description: 'Study of linear and non-linear data structures, searching, sorting, and algorithmic complexity.',
      lecturer: lecturer1._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'Introduction to Data Structures & Abstract Data Types', description: 'Overview of arrays, records, and abstract data type concepts.', status: 'Completed', learningObjectives: ['Understand ADTs', 'Review primitive vs non-primitive structures'] },
        { moduleNumber: 2, title: 'Stacks and Queues Implementation', description: 'LIFO and FIFO data structures with push, pop, enqueue, and dequeue operations.', status: 'Current', learningObjectives: ['Implement array-based stack', 'Implement circular queue'] },
        { moduleNumber: 3, title: 'Singly and Doubly Linked Lists', description: 'Dynamic memory allocation, pointer manipulation, and node insertion/deletion.', status: 'Upcoming', learningObjectives: ['Node traversal', 'Reversing a linked list'] },
      ],
    });

    const course2 = await Course.create({
      code: 'COM 222',
      title: 'Web Technology II (Backend)',
      department: 'Computer Science',
      creditUnit: 3,
      semester: 'ND II 2nd Semester',
      description: 'Server-side programming, RESTful API design, database connection, and asynchronous Node.js.',
      lecturer: lecturer1._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'Node.js Runtime & Asynchronous JavaScript', description: 'Event loop, non-blocking I/O, and EventEmitter patterns.', status: 'Completed', learningObjectives: ['Understand libuv event loop', 'Use async/await with promises'] },
        { moduleNumber: 2, title: 'Express Framework & Middleware Architecture', description: 'Route handling, request lifecycle, custom middleware, and error handling.', status: 'Current', learningObjectives: ['Create modular routers', 'Build authentication middleware'] },
      ],
    });

    const course3 = await Course.create({
      code: 'COM 223',
      title: 'Operating Systems & System Programming',
      department: 'Computer Science',
      creditUnit: 3,
      semester: 'ND II 2nd Semester',
      description: 'Process management, memory allocation, storage systems, concurrency, and Linux system calls.',
      lecturer: lecturer2._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'Operating System Architecture & Kernel Models', description: 'Monolithic vs microkernels, system calls, and dual-mode operation.', status: 'Completed', learningObjectives: ['Trace system calls in Linux', 'Understand user vs kernel mode'] },
        { moduleNumber: 2, title: 'CPU Scheduling Algorithms', description: 'Round Robin, Shortest Job First, and Priority scheduling algorithms.', status: 'Current', learningObjectives: ['Calculate turnaround and waiting times', 'Simulate Gantt charts'] },
      ],
    });

    const course4 = await Course.create({
      code: 'COM 224',
      title: 'Database Design & Management II',
      department: 'Computer Science',
      creditUnit: 3,
      semester: 'ND II 2nd Semester',
      description: 'Advanced relational modeling, SQL indexing, normalization (1NF-3NF), transaction control, and NoSQL fundamentals.',
      lecturer: lecturer2._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'Advanced SQL Querying & Subqueries', description: 'Complex joins, correlated subqueries, and window functions.', status: 'Completed', learningObjectives: ['Write nested subqueries', 'Optimize join operations'] },
        { moduleNumber: 2, title: 'Database Normalization to 3NF and BCNF', description: 'Functional dependencies, lossless joins, and dependency preservation.', status: 'Current', learningObjectives: ['Decompose unnormalized relations', 'Identify partial and transitive dependencies'] },
      ],
    });

    const course5 = await Course.create({
      code: 'COM 225',
      title: 'Computer Architecture & Assembly Language',
      department: 'Computer Science',
      creditUnit: 3,
      semester: 'ND II 2nd Semester',
      description: 'Instruction set architecture, register transfer, CPU arithmetic logic units, and x86/ARM assembly programming.',
      lecturer: lecturer3._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'x86 Processor Architecture & Registers', description: 'General purpose registers, segment registers, and CPU flags.', status: 'Completed', learningObjectives: ['Identify 32-bit and 64-bit registers', 'Understand CPU flags register'] },
        { moduleNumber: 2, title: 'Data Transfer & Arithmetic Instructions', description: 'MOV, ADD, SUB, MUL, and pointer manipulation.', status: 'Current', learningObjectives: ['Write assembly arithmetic subroutines', 'Trace stack pointer operations'] },
      ],
    });

    const course6 = await Course.create({
      code: 'COM 226',
      title: 'Research Methodology & Technical Writing',
      department: 'Computer Science',
      creditUnit: 2,
      semester: 'ND II 2nd Semester',
      description: 'Scientific inquiry, technical documentation, literature review, and academic referencing.',
      lecturer: lecturer3._id,
      enrolledStudents: [student1._id, student2._id],
      syllabus: [
        { moduleNumber: 1, title: 'Problem Formulation & Literature Review', description: 'Identifying research gaps and conducting systematic academic reviews.', status: 'Completed', learningObjectives: ['Formulate testable hypotheses', 'Structure citations using IEEE format'] },
      ],
    });

    // 3. Create Lectures
    const createdLectures = await Lecture.create([
      {
        course: course1._id,
        lecturer: lecturer1._id,
        title: 'Stacks & Queues Implementation in C++',
        description: 'Comprehensive live lecture covering LIFO and FIFO structures with memory allocation.',
        scheduledDate: new Date('2026-03-20'),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        durationMinutes: 120,
        type: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-com221-01',
        roomPasscode: '22101',
        maxCapacity: 150,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
        resources: [{ name: 'Stacks_and_Queues_Slide.pdf', size: '2.4 MB', url: '#' }],
      },
      {
        course: course2._id,
        lecturer: lecturer1._id,
        title: 'Building Express Middleware & Authentication',
        description: 'Live coding session on custom Express middlewares, request validation, and JWT verification.',
        scheduledDate: new Date('2026-03-21'),
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        durationMinutes: 120,
        type: 'Video',
        status: 'Live Now',
        meetingId: 'mtg-com222-01',
        roomPasscode: '22201',
        maxCapacity: 150,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
        resources: [{ name: 'Express_Middleware_Architecture.pdf', size: '3.1 MB', url: '#' }],
      },
      {
        course: course3._id,
        lecturer: lecturer2._id,
        title: 'CPU Scheduling Algorithms & Concurrency',
        description: 'Round Robin, SJF, and Priority Scheduling calculation walkthroughs.',
        scheduledDate: new Date('2026-03-22'),
        startTime: '09:00 AM',
        endTime: '11:00 AM',
        durationMinutes: 120,
        type: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-com223-01',
        roomPasscode: '22301',
        maxCapacity: 150,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
        resources: [],
      },
      {
        course: course4._id,
        lecturer: lecturer2._id,
        title: 'SQL Joins, Aggregation & Subqueries',
        description: 'Complex relational database queries, inner/outer joins, and query optimization.',
        scheduledDate: new Date('2026-03-23'),
        startTime: '11:00 AM',
        endTime: '01:00 PM',
        durationMinutes: 120,
        type: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-com224-01',
        roomPasscode: '22401',
        maxCapacity: 150,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
        resources: [],
      },
      {
        course: course5._id,
        lecturer: lecturer3._id,
        title: 'x86 Register Layout & Subroutine Calls',
        description: 'Registers, instruction formats, and stack usage for assembly procedures.',
        scheduledDate: new Date('2026-03-24'),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        durationMinutes: 120,
        type: 'Voice',
        status: 'Scheduled',
        meetingId: 'mtg-com225-01',
        roomPasscode: '22501',
        maxCapacity: 150,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
        resources: [],
      },
    ]);

    // 4. Create Materials
    await Material.create([
      {
        course: course1._id,
        uploadedBy: lecturer1._id,
        title: 'Data Structures Notes.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '2.4 MB',
        fileUrl: 'https://example.com/materials/com221-notes.pdf',
        description: 'Complete lecture notes on arrays, stacks, queues, and tree traversal algorithms.',
        downloads: 42,
        uploadedDate: new Date('2026-03-10'),
      },
      {
        course: course1._id,
        uploadedBy: lecturer1._id,
        title: 'Linked Lists Lab Manual.pdf',
        category: 'Lab Manual',
        format: 'PDF',
        size: '1.8 MB',
        fileUrl: 'https://example.com/materials/com221-lab.pdf',
        description: 'Practical lab instructions and exercises for singly and doubly linked list manipulation.',
        downloads: 38,
        uploadedDate: new Date('2026-03-12'),
      },
      {
        course: course2._id,
        uploadedBy: lecturer1._id,
        title: 'Express Middleware Guide.pdf',
        category: 'Handout',
        format: 'PDF',
        size: '3.1 MB',
        fileUrl: 'https://example.com/materials/com222-middleware.pdf',
        description: 'Architecture diagram and sample code for building custom authentication middleware in Express.',
        downloads: 56,
        uploadedDate: new Date('2026-03-14'),
      },
      {
        course: course3._id,
        uploadedBy: lecturer2._id,
        title: 'CPU Scheduling Slides.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '4.2 MB',
        fileUrl: 'https://example.com/materials/com223-scheduling.pdf',
        description: 'Visual slides covering Gantt charts, Round Robin, and Priority Scheduling calculations.',
        downloads: 29,
        uploadedDate: new Date('2026-03-15'),
      },
      {
        course: course4._id,
        uploadedBy: lecturer2._id,
        title: 'SQL Normalization Notes.pdf',
        category: 'Reference Guide',
        format: 'PDF',
        size: '1.5 MB',
        fileUrl: 'https://example.com/materials/com224-normalization.pdf',
        description: 'Reference guide for normalizing database tables from 1NF to BCNF with worked examples.',
        downloads: 34,
        uploadedDate: new Date('2026-03-16'),
      },
      {
        course: course5._id,
        uploadedBy: lecturer3._id,
        title: 'Assembly Programming Handout.pdf',
        category: 'Handout',
        format: 'PDF',
        size: '2.9 MB',
        fileUrl: 'https://example.com/materials/com225-assembly.pdf',
        description: 'Registers reference and cheat sheet for x86/ARM assembly programming.',
        downloads: 21,
        uploadedDate: new Date('2026-03-17'),
      },
      {
        course: course6._id,
        uploadedBy: lecturer3._id,
        title: 'Research Methods Guide.pdf',
        category: 'Reference Guide',
        format: 'PDF',
        size: '2.1 MB',
        fileUrl: 'https://example.com/materials/com226-research.pdf',
        description: 'Guide to academic writing, referencing, and scientific study formulation.',
        downloads: 19,
        uploadedDate: new Date('2026-03-18'),
      },
    ]);

    // 5. Create General Sessions
    const createdSessions = await GeneralSession.create([
      {
        organizer: adminUser._id,
        title: 'Academic Calendar Review & Departmental Planning',
        category: 'Department Meeting',
        description: 'Comprehensive review of continuous assessment milestones, lab exam schedules, and holiday adjustments for ND2 semester.',
        scheduledDate: new Date('2026-04-02'),
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        durationMinutes: 90,
        mode: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-dept-academic-review-2026',
        maxCapacity: 120,
        allowStudentScreenShare: false,
        recordSession: true,
        autoAttendance: true,
      },
      {
        organizer: lecturer1._id,
        title: 'ND2 Final Year Project Kickoff & Methodology Briefing',
        category: 'Project Discussion',
        description: 'Interactive session outlining software engineering lifecycle expectations, UML diagram submissions, and weekly supervisor consultations.',
        scheduledDate: new Date('2026-03-25'),
        startTime: '02:00 PM',
        endTime: '03:30 PM',
        durationMinutes: 90,
        mode: 'Video',
        status: 'Live Now',
        meetingId: 'mtg-project-kickoff-nd2-2026',
        maxCapacity: 100,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: true,
      },
      {
        organizer: lecturer2._id,
        title: 'Cybersecurity Awareness & Zero Trust Architecture',
        category: 'Seminar',
        description: 'Guest lecture and live demonstration on modern attack vectors, phishing prevention, authentication tokens, and secure network boundaries.',
        scheduledDate: new Date('2026-04-10'),
        startTime: '01:00 PM',
        endTime: '03:00 PM',
        durationMinutes: 120,
        mode: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-seminar-cybersecurity-2026',
        maxCapacity: 200,
        allowStudentScreenShare: false,
        recordSession: true,
        autoAttendance: true,
      },
      {
        organizer: lecturer1._id,
        title: 'Office Hour Consultation with Dr. Babatunde Lawal',
        category: 'Student Consultation',
        description: 'One-on-one and small group academic consultation on tree rotations, dynamic programming challenges, and upcoming practical assessments.',
        scheduledDate: new Date('2026-03-28'),
        startTime: '11:00 AM',
        endTime: '01:00 PM',
        durationMinutes: 120,
        mode: 'Video',
        status: 'Scheduled',
        meetingId: 'mtg-consult-lawal-2026',
        maxCapacity: 30,
        allowStudentScreenShare: true,
        recordSession: false,
        autoAttendance: true,
      },
      {
        organizer: adminUser._id,
        title: 'ICT Centre Maintenance Notice & Server Migration Briefing',
        category: 'General',
        description: 'Important departmental announcement regarding scheduled network upgrades, cloud repository backups, and laboratory workstation downtime.',
        scheduledDate: new Date('2026-03-15'),
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        durationMinutes: 60,
        mode: 'Voice',
        status: 'Completed',
        meetingId: 'mtg-general-ict-maintenance-2026',
        maxCapacity: 150,
        allowStudentScreenShare: false,
        recordSession: true,
        autoAttendance: false,
      },
    ]);

    // 6. Create Initial Seed Attendance Records
    await Attendance.create([
      {
        student: student1._id,
        course: course1._id,
        lecture: createdLectures[0]._id,
        date: new Date('2026-03-20'),
        timeJoined: new Date('2026-03-20T10:01:00'),
        timeLeft: new Date('2026-03-20T11:58:00'),
        durationMinutes: 117,
        status: 'Present',
      },
      {
        student: student2._id,
        course: course1._id,
        lecture: createdLectures[0]._id,
        date: new Date('2026-03-20'),
        timeJoined: new Date('2026-03-20T10:18:00'),
        timeLeft: new Date('2026-03-20T11:55:00'),
        durationMinutes: 97,
        status: 'Late',
        reason: 'Network connectivity delay',
      },
      {
        student: student1._id,
        course: course2._id,
        lecture: createdLectures[1]._id,
        date: new Date('2026-03-21'),
        timeJoined: new Date('2026-03-21T14:00:00'),
        timeLeft: new Date('2026-03-21T16:00:00'),
        durationMinutes: 120,
        status: 'Present',
      },
      {
        student: student1._id,
        course: course3._id,
        lecture: createdLectures[2]._id,
        date: new Date('2026-03-22'),
        timeJoined: new Date('2026-03-22T09:02:00'),
        timeLeft: new Date('2026-03-22T10:55:00'),
        durationMinutes: 113,
        status: 'Present',
      },
      {
        student: student1._id,
        course: course4._id,
        lecture: createdLectures[3]._id,
        date: new Date('2026-03-23'),
        timeJoined: new Date('2026-03-23T11:00:00'),
        timeLeft: new Date('2026-03-23T13:00:00'),
        durationMinutes: 120,
        status: 'Present',
      },
      {
        student: student1._id,
        course: course5._id,
        lecture: createdLectures[4]._id,
        date: new Date('2026-03-24'),
        timeJoined: new Date('2026-03-24T10:05:00'),
        timeLeft: new Date('2026-03-24T12:00:00'),
        durationMinutes: 115,
        status: 'Present',
      },
      {
        student: student1._id,
        generalSession: createdSessions[1]._id,
        date: new Date('2026-03-25'),
        timeJoined: new Date('2026-03-25T14:00:00'),
        timeLeft: new Date('2026-03-25T15:30:00'),
        durationMinutes: 90,
        status: 'Present',
      },
      {
        student: student2._id,
        generalSession: createdSessions[1]._id,
        date: new Date('2026-03-25'),
        timeJoined: new Date('2026-03-25T14:05:00'),
        timeLeft: new Date('2026-03-25T15:25:00'),
        durationMinutes: 80,
        status: 'Present',
      },
    ]);

    console.log('[Seed] Database successfully seeded with ND2 Computer Science dataset!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
}
