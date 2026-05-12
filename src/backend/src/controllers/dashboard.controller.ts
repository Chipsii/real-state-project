import { Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class DashboardController {
  async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await dashboardService.getStats(req.user!.id);
      sendSuccess(res, stats);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch dashboard stats');
    }
  }

  async getPropertyViews(req: AuthenticatedRequest, res: Response) {
    try {
      const period = (req.query.period as 'hourly' | 'weekly' | 'monthly') || 'hourly';
      const views = await dashboardService.getPropertyViews(req.user!.id, period);
      sendSuccess(res, views);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch property views');
    }
  }

  async getRecentActivities(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const activities = await dashboardService.getRecentActivities(req.user!.id, limit);
      sendSuccess(res, activities);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch recent activities');
    }
  }
}

export const dashboardController = new DashboardController();
