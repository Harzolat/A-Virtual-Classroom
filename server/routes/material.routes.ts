import { Router } from 'express';
import { MaterialController } from '../controllers/material.controller.js';
import { authenticateUser, requireLecturerOrAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// List all accessible materials for the authenticated user
router.get('/', authenticateUser, MaterialController.getMaterials);

// List materials for a specific course
router.get('/course/:courseId', authenticateUser, MaterialController.getMaterialsByCourse);

// Get single material details
router.get('/:materialId', authenticateUser, MaterialController.getMaterialById);

// Create new course material (Lecturer & Admin only)
router.post('/', authenticateUser, requireLecturerOrAdmin, MaterialController.createMaterial);

// Update material (Lecturer & Admin only)
router.patch('/:materialId', authenticateUser, requireLecturerOrAdmin, MaterialController.updateMaterial);

// Delete material (Lecturer & Admin only)
router.delete('/:materialId', authenticateUser, requireLecturerOrAdmin, MaterialController.deleteMaterial);

// Track material download
router.post('/:materialId/download', authenticateUser, MaterialController.downloadMaterial);

export default router;
