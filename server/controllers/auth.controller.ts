import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthRequest, JWT_SECRET } from '../middleware/auth.middleware.js';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
        return;
      }

      if (user.status !== 'Active') {
        res.status(403).json({ success: false, message: 'Your account is not active' });
        return;
      }

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const userObj: any = user.toObject();
      delete userObj.passwordHash;
      userObj.id = userObj._id;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: userObj,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Login failed' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const user = await User.findById(req.user.userId).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const userObj: any = user.toObject();
      userObj.id = userObj._id;

      res.status(200).json({ success: true, user: userObj });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch user' });
    }
  }
}
