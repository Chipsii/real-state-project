import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, username, first_name, last_name } = req.body;
      const result = await authService.register(email, password, { username, first_name, last_name });
      sendCreated(res, result);
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        Errors.conflict(res, 'Email is already registered');
      } else {
        Errors.internal(res, error.message || 'Registration failed');
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.unauthorized(res, 'Invalid email or password');
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        Errors.badRequest(res, 'Refresh token is required');
        return;
      }
      const result = await authService.refreshToken(refresh_token);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.unauthorized(res, 'Invalid or expired refresh token');
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.accessToken) {
        await authService.logout(req.accessToken);
      }
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error: any) {
      sendSuccess(res, { message: 'Logged out' }); // Always return success for logout
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await authService.changePassword(req.user!.id, oldPassword, newPassword);
      sendSuccess(res, result);
    } catch (error: any) {
      if (error.message?.includes('incorrect')) {
        Errors.badRequest(res, 'Current password is incorrect');
      } else {
        Errors.internal(res, error.message || 'Failed to change password');
      }
    }
  }
}

export const authController = new AuthController();
