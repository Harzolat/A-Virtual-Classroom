import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: 'student' | 'lecturer' | 'admin';
    name?: string;
    email?: string;
  };
}

export const JWT_SECRET = process.env.JWT_SECRET || 'nd2-classroom-super-secret-jwt-key-2026';

export async function authenticateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: 'student' | 'lecturer' | 'admin' };
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user || user.status !== 'Active') {
      res.status(401).json({ success: false, message: 'Invalid or inactive user account.' });
      return;
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(allowedRoles: Array<'student' | 'lecturer' | 'admin'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges.' });
      return;
    }

    next();
  };
}

export const requireLecturerOrAdmin = requireRole(['lecturer', 'admin']);
export const requireAdmin = requireRole(['admin']);
