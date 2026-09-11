import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import apiRouter from '../routes/index.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { User, Course, Material } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.middleware.js';

async function runHttpTests() {
  console.log('=== Phase 1F HTTP Endpoints & Integration Test ===\n');

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
    // 1. Student Login
    console.log('HTTP Test 1: Student Login via /api/auth/login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student1@nd2classroom.test',
        password: 'Student@12345',
      }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok || !loginData.token) throw new Error('Student login failed');
    const studentToken = loginData.token;
    console.log('✓ Student login succeeded with JWT token');

    // 2. Lecturer Login
    console.log('\nHTTP Test 2: Lecturer Login via /api/auth/login...');
    const lecLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'lecturer1@nd2classroom.test',
        password: 'Lecturer@12345',
      }),
    });
    const lecLoginData = await lecLoginRes.json();
    if (!lecLoginRes.ok || !lecLoginData.token) throw new Error('Lecturer login failed');
    const lecturerToken = lecLoginData.token;
    console.log('✓ Lecturer login succeeded with JWT token');

    // 3. Student GET /api/materials
    console.log('\nHTTP Test 3: Student GET /api/materials...');
    const getMatRes = await fetch(`${baseUrl}/materials`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const getMatData = await getMatRes.json();
    if (!getMatRes.ok || !Array.isArray(getMatData.data)) throw new Error('GET /api/materials failed');
    console.log(`✓ Student received ${getMatData.data.length} course materials`);

    // 4. Student GET /api/materials/course/:courseId
    console.log('\nHTTP Test 4: Student GET /api/materials/course/COM%20221...');
    const getCourseMatRes = await fetch(`${baseUrl}/materials/course/COM%20221`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const getCourseMatData = await getCourseMatRes.json();
    if (!getCourseMatRes.ok || !Array.isArray(getCourseMatData.data)) throw new Error('GET by course failed');
    console.log(`✓ Student received ${getCourseMatData.data.length} materials for COM 221`);

    // 5. Student POST /api/materials -> 403
    console.log('\nHTTP Test 5: Student POST /api/materials (Forbidden)...');
    const studentPostRes = await fetch(`${baseUrl}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        course: 'COM 221',
        title: 'Hacked Material.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '1 MB',
        fileUrl: 'https://example.com/hacked.pdf',
      }),
    });
    if (studentPostRes.status !== 403) throw new Error(`Expected 403, got ${studentPostRes.status}`);
    console.log('✓ Student POST rejected with HTTP 403 Forbidden');

    // 6. Lecturer POST /api/materials -> 201
    console.log('\nHTTP Test 6: Lecturer POST /api/materials (Created)...');
    const lecPostRes = await fetch(`${baseUrl}/materials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lecturerToken}`,
      },
      body: JSON.stringify({
        course: 'COM 221',
        title: 'COM 221 Graph Algorithms & BFS/DFS.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '3.8 MB',
        fileUrl: 'https://polytechnic.edu.ng/materials/graphs.pdf',
        description: 'Graph representations, adjacency matrix, list, and traversal.',
      }),
    });
    const lecPostData = await lecPostRes.json();
    if (lecPostRes.status !== 201 || !lecPostData.data?._id) {
      throw new Error(`Expected 201, got ${lecPostRes.status}: ${JSON.stringify(lecPostData)}`);
    }
    const createdId = lecPostData.data._id;
    console.log(`✓ Lecturer created material successfully (ID: ${createdId})`);

    // 7. Student POST /api/materials/:id/download -> 200 & increment
    console.log('\nHTTP Test 7: POST /api/materials/:id/download...');
    const dlRes = await fetch(`${baseUrl}/materials/${createdId}/download`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const dlData = await dlRes.json();
    if (!dlRes.ok || dlData.data.downloads !== 1) {
      throw new Error(`Download increment failed: ${JSON.stringify(dlData)}`);
    }
    console.log(`✓ Material download counted (downloads: ${dlData.data.downloads})`);

    // 8. Lecturer PATCH /api/materials/:id -> 200
    console.log('\nHTTP Test 8: Lecturer PATCH /api/materials/:id...');
    const patchRes = await fetch(`${baseUrl}/materials/${createdId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lecturerToken}`,
      },
      body: JSON.stringify({
        title: 'COM 221 Graph Algorithms & Shortest Path (Dijkstra).pdf',
      }),
    });
    const patchData = await patchRes.json();
    if (!patchRes.ok || patchData.data.title !== 'COM 221 Graph Algorithms & Shortest Path (Dijkstra).pdf') {
      throw new Error(`Patch failed: ${JSON.stringify(patchData)}`);
    }
    console.log('✓ Material updated successfully');

    // 9. Lecturer DELETE /api/materials/:id -> 200
    console.log('\nHTTP Test 9: Lecturer DELETE /api/materials/:id...');
    const delRes = await fetch(`${baseUrl}/materials/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${lecturerToken}` },
    });
    const delData = await delRes.json();
    if (!delRes.ok || !delData.success) {
      throw new Error(`Delete failed: ${JSON.stringify(delData)}`);
    }
    console.log('✓ Material deleted successfully');

    console.log('\n========================================');
    console.log(' ALL HTTP API ENDPOINT TESTS PASSED!    ');
    console.log('========================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

runHttpTests().catch((err) => {
  console.error('HTTP Test failed:', err);
  process.exit(1);
});
