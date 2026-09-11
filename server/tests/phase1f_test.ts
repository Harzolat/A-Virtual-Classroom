import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../scripts/seed.js';
import { MaterialService } from '../services/material.service.js';
import { User, Course, Material } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.middleware.js';

async function runTests() {
  console.log('=== Phase 1F Materials API & Database Integration Smoke Test ===\n');

  await connectDB();
  await seedDatabase();

  const student = await User.findOne({ email: 'student1@nd2classroom.test' });
  const lecturer1 = await User.findOne({ email: 'lecturer1@nd2classroom.test' });
  const lecturer2 = await User.findOne({ email: 'lecturer2@nd2classroom.test' });
  const admin = await User.findOne({ email: 'admin@nd2classroom.test' });

  if (!student || !lecturer1 || !lecturer2 || !admin) {
    throw new Error('Seed users not found');
  }

  // 1. Student Materials Fetch
  console.log('Test 1: Student gets enrolled materials...');
  const studentMaterials = await MaterialService.getMaterialsForUser(student._id.toString(), 'student');
  console.log(`- Retrieved ${studentMaterials.length} materials for student.`);
  if (studentMaterials.length === 0) throw new Error('Student should have materials');
  const sampleMat: any = studentMaterials[0];
  if (!sampleMat.course || !sampleMat.course.code) throw new Error('Course not populated');
  if (!sampleMat.uploadedBy || !sampleMat.uploadedBy.name) throw new Error('Uploader not populated');
  if (sampleMat.uploadedBy.passwordHash) throw new Error('passwordHash exposed!');
  console.log('✓ Test 1 passed.');

  // 2. Lecturer Materials Fetch
  console.log('\nTest 2: Lecturer gets assigned materials...');
  const lecturerMaterials = await MaterialService.getMaterialsForUser(lecturer1._id.toString(), 'lecturer');
  console.log(`- Retrieved ${lecturerMaterials.length} materials for Lecturer 1.`);
  console.log('✓ Test 2 passed.');

  // 3. Admin Materials Fetch
  console.log('\nTest 3: Admin gets all materials...');
  const allMaterials = await MaterialService.getMaterialsForUser(admin._id.toString(), 'admin');
  console.log(`- Retrieved ${allMaterials.length} materials for Admin.`);
  console.log('✓ Test 3 passed.');

  // 4. Student cannot upload material (RBAC)
  console.log('\nTest 4: Student RBAC check on upload...');
  const course1 = await Course.findOne({ code: 'COM 221' });
  if (!course1) throw new Error('COM 221 not found');

  try {
    await MaterialService.createMaterial(
      {
        course: course1._id.toString(),
        title: 'Student Rogue Upload.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '1.2 MB',
        fileUrl: 'https://example.com/student.pdf',
      },
      student._id.toString(),
      'student'
    );
    throw new Error('Student should NOT be able to upload material');
  } catch (err: any) {
    if (err.statusCode !== 403) throw err;
    console.log(`✓ Student upload blocked with 403: "${err.message}"`);
  }

  // 5. Validation Rules: Invalid Category & Format rejection
  console.log('\nTest 5: Validation rules rejection...');
  try {
    await MaterialService.createMaterial(
      {
        course: course1._id.toString(),
        title: 'Invalid Category Material',
        category: 'Unapproved Category',
        format: 'PDF',
        size: '1.0 MB',
        fileUrl: 'https://example.com/doc.pdf',
      },
      lecturer1._id.toString(),
      'lecturer'
    );
    throw new Error('Invalid category should be rejected');
  } catch (err: any) {
    if (err.statusCode !== 400) throw err;
    console.log(`✓ Invalid category rejected with 400: "${err.message}"`);
  }

  try {
    await MaterialService.createMaterial(
      {
        course: course1._id.toString(),
        title: 'Invalid Format Material',
        category: 'Handout',
        format: 'EXE',
        size: '1.0 MB',
        fileUrl: 'https://example.com/app.exe',
      },
      lecturer1._id.toString(),
      'lecturer'
    );
    throw new Error('Invalid format should be rejected');
  } catch (err: any) {
    if (err.statusCode !== 400) throw err;
    console.log(`✓ Invalid format rejected with 400: "${err.message}"`);
  }

  // 6. Lecturer course ownership check
  console.log('\nTest 6: Lecturer cannot upload to another lecturer course...');
  const course3 = await Course.findOne({ code: 'COM 223' }); // Assigned to Lecturer 2
  if (!course3) throw new Error('COM 223 not found');

  try {
    await MaterialService.createMaterial(
      {
        course: course3._id.toString(),
        title: 'Cross Course Upload.pdf',
        category: 'Lecture Notes',
        format: 'PDF',
        size: '1.5 MB',
        fileUrl: 'https://example.com/cross.pdf',
      },
      lecturer1._id.toString(), // Lecturer 1 attempting on Lecturer 2's course
      'lecturer'
    );
    throw new Error('Cross-course upload should be blocked for lecturers');
  } catch (err: any) {
    if (err.statusCode !== 403) throw err;
    console.log(`✓ Lecturer unassigned course upload blocked with 403: "${err.message}"`);
  }

  // 7. Successful Upload by Assigned Lecturer
  console.log('\nTest 7: Successful material creation by assigned lecturer...');
  const created = await MaterialService.createMaterial(
    {
      course: course1._id.toString(),
      title: 'COM 221 Trees and Heaps Tutorial.pdf',
      category: 'Lecture Notes',
      format: 'PDF',
      size: '3.4 MB',
      fileUrl: 'https://example.com/trees-heaps.pdf',
      description: 'Comprehensive binary search tree and min/max heap tutorial.',
    },
    lecturer1._id.toString(),
    'lecturer'
  );
  console.log(`✓ Created material: "${created.title}" (ID: ${created._id})`);

  // 8. Download Atomic Increment
  console.log('\nTest 8: Atomic download count increment...');
  const initialDownloads = created.downloads;
  const afterDownload = await MaterialService.incrementDownload(created._id.toString());
  console.log(`- Downloads went from ${initialDownloads} -> ${afterDownload.downloads}`);
  if (afterDownload.downloads !== initialDownloads + 1) {
    throw new Error('Download count did not increment');
  }
  console.log('✓ Test 8 passed.');

  // 9. Update Material
  console.log('\nTest 9: Updating material title and category...');
  const updated = await MaterialService.updateMaterial(
    created._id.toString(),
    {
      title: 'COM 221 Trees & Heaps Master Guide.pdf',
      category: 'Reference Guide',
    },
    lecturer1._id.toString(),
    'lecturer'
  );
  if (updated.title !== 'COM 221 Trees & Heaps Master Guide.pdf' || updated.category !== 'Reference Guide') {
    throw new Error('Material update failed');
  }
  console.log('✓ Test 9 passed.');

  // 10. Delete Material
  console.log('\nTest 10: Deleting test material...');
  await MaterialService.deleteMaterial(created._id.toString(), lecturer1._id.toString(), 'lecturer');
  const deletedCheck = await Material.findById(created._id);
  if (deletedCheck) throw new Error('Material was not deleted');
  console.log('✓ Test 10 passed.');

  console.log('\n========================================');
  console.log(' ALL 10 PHASE 1F TESTS PASSED PERFECTLY!');
  console.log('========================================\n');

  await disconnectDB();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
