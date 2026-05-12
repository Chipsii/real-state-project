import { Response } from 'express';
import { profileService } from '../services/profile.service';
import { sendSuccess, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class ProfileController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await profileService.getProfile(req.user!.id);
      if (!profile) {
        Errors.notFound(res, 'Profile not found');
        return;
      }
      sendSuccess(res, profile);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await profileService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, profile);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to update profile');
    }
  }

  async updateSocialLinks(req: AuthenticatedRequest, res: Response) {
    try {
      const profile = await profileService.updateSocialLinks(req.user!.id, req.body);
      sendSuccess(res, profile);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to update social links');
    }
  }

  async uploadAvatar(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.file) {
        Errors.badRequest(res, 'No image file provided');
        return;
      }
      const avatarUrl = await profileService.uploadAvatar(req.user!.id, req.file);
      sendSuccess(res, { avatar_url: avatarUrl });
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to upload avatar');
    }
  }

  async deleteAvatar(req: AuthenticatedRequest, res: Response) {
    try {
      await profileService.deleteAvatar(req.user!.id);
      sendSuccess(res, { message: 'Avatar deleted successfully' });
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to delete avatar');
    }
  }
}

export const profileController = new ProfileController();
