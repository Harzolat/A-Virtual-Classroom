import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { MaterialService } from '../services/material.service.js';

export class MaterialController {
  static async getMaterials(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const materials = await MaterialService.getMaterialsForUser(userId, role);
      res.status(200).json({ success: true, data: materials });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch materials',
      });
    }
  }

  static async getMaterialById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { materialId } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const material = await MaterialService.getMaterialById(materialId, userId, role);
      res.status(200).json({ success: true, data: material });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch material',
      });
    }
  }

  static async getMaterialsByCourse(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const materials = await MaterialService.getMaterialsByCourse(courseId, userId, role);
      res.status(200).json({ success: true, data: materials });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch course materials',
      });
    }
  }

  static async createMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const material = await MaterialService.createMaterial(req.body, userId, role);
      res.status(201).json({
        success: true,
        message: 'Material uploaded successfully',
        data: material,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create material',
      });
    }
  }

  static async updateMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { materialId } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const updated = await MaterialService.updateMaterial(materialId, req.body, userId, role);
      res.status(200).json({
        success: true,
        message: 'Material updated successfully',
        data: updated,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update material',
      });
    }
  }

  static async deleteMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { materialId } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      await MaterialService.deleteMaterial(materialId, userId, role);
      res.status(200).json({
        success: true,
        message: 'Material deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete material',
      });
    }
  }

  static async downloadMaterial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { materialId } = req.params;
      const updated = await MaterialService.incrementDownload(materialId);
      res.status(200).json({
        success: true,
        message: 'Download counted successfully',
        data: {
          materialId: updated._id,
          downloads: updated.downloads,
          fileUrl: updated.fileUrl,
        },
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to record material download',
      });
    }
  }
}
