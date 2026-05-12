import { Response } from 'express';
import { packagesService } from '../services/packages.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class PackagesController {
  async getPackages(_req: AuthenticatedRequest, res: Response) {
    try {
      const packages = await packagesService.getPackages();
      sendSuccess(res, packages);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch packages');
    }
  }

  async getMyPackage(req: AuthenticatedRequest, res: Response) {
    try {
      const userPackage = await packagesService.getUserPackage(req.user!.id);
      sendSuccess(res, userPackage);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch your package');
    }
  }

  async subscribe(req: AuthenticatedRequest, res: Response) {
    try {
      const subscription = await packagesService.subscribe(req.user!.id, req.params.packageId);
      sendCreated(res, subscription);
    } catch (error: any) {
      if (error.message?.includes('already have')) {
        Errors.conflict(res, error.message);
      } else if (error.message?.includes('not found')) {
        Errors.notFound(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to subscribe to package');
      }
    }
  }
}

export const packagesController = new PackagesController();
