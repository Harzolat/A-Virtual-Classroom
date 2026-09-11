import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { GeneralSessionService } from '../services/generalSession.service.js';

export class GeneralSessionController {
  static async getGeneralSessions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const sessions = await GeneralSessionService.getGeneralSessionsForUser(userId, role);
      res.status(200).json({ success: true, data: sessions });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch general sessions',
      });
    }
  }

  static async getGeneralSessionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const session = await GeneralSessionService.getGeneralSessionById(id, userId, role);
      res.status(200).json({ success: true, data: session });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch general session',
      });
    }
  }

  static async createGeneralSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const session = await GeneralSessionService.createGeneralSession(req.body, userId, role);
      res.status(201).json({
        success: true,
        message: 'General session created successfully',
        data: session,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create general session',
      });
    }
  }

  static async updateGeneralSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      const updated = await GeneralSessionService.updateGeneralSession(id, req.body, userId, role);
      res.status(200).json({
        success: true,
        message: 'General session updated successfully',
        data: updated,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update general session',
      });
    }
  }

  static async deleteGeneralSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId || '';
      const role = req.user?.role || 'student';
      await GeneralSessionService.deleteGeneralSession(id, userId, role);
      res.status(200).json({
        success: true,
        message: 'General session deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete general session',
      });
    }
  }
}
