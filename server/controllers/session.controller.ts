import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { SessionService } from '../services/session.service.js';

export class SessionController {
  /**
   * POST /api/sessions/:type/:id/join
   * Student joins an active lecture or general session
   */
  public static async joinSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const result = await SessionService.joinSession(type, id, {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email,
      }, req.body);

      res.status(200).json({
        success: true,
        message: result.alreadyJoined
          ? 'Already joined this session.'
          : 'Successfully joined session and recorded attendance.',
        alreadyJoined: result.alreadyJoined,
        data: result.attendance,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to join session.',
      });
    }
  }

  /**
   * POST /api/sessions/:type/:id/leave
   * Student leaves an active lecture or general session
   */
  public static async leaveSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const updatedAttendance = await SessionService.leaveSession(type, id, {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email,
      }, req.body);

      res.status(200).json({
        success: true,
        message: 'Successfully left session.',
        data: updatedAttendance,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to leave session.',
      });
    }
  }

  /**
   * GET /api/sessions/:type/:id/participants
   * Lecturer (host) or Admin retrieves active session participants
   */
  public static async getSessionParticipants(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const result = await SessionService.getSessionParticipants(type, id, {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: 'Participants retrieved successfully.',
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to retrieve participants.',
      });
    }
  }

  /**
   * GET /api/sessions/:type/:id/my-status
   * Authenticated user retrieves their personal participation record
   */
  public static async getMySessionStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, id } = req.params;
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const result = await SessionService.getMySessionStatus(type, id, {
        userId: user.userId,
        role: user.role,
        name: user.name,
        email: user.email,
      });

      res.status(200).json({
        success: true,
        message: 'Session status retrieved successfully.',
        data: result,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: err.message || 'Failed to retrieve session status.',
      });
    }
  }
}
