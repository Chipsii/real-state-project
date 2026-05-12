import { Request, Response } from 'express';
import { reviewsService } from '../services/reviews.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class ReviewsController {
  async getReviews(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await reviewsService.getReviewsForUser(req.user!.id, req.query);
      sendSuccess(res, result.reviews, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch reviews');
    }
  }

  async getPropertyReviews(req: Request, res: Response) {
    try {
      const result = await reviewsService.getReviewsForProperty(req.params.propertyId, req.query);
      sendSuccess(res, { reviews: result.reviews, averageRating: result.averageRating }, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch property reviews');
    }
  }

  async createReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { property_id, rating, comment, image_urls } = req.body;
      const review = await reviewsService.createReview(req.user!.id, property_id, rating, comment, image_urls);
      sendCreated(res, review);
    } catch (error: any) {
      if (error.message?.includes('already reviewed')) {
        Errors.conflict(res, error.message);
      } else if (error.message?.includes('not found')) {
        Errors.notFound(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to create review');
      }
    }
  }

  async markHelpful(req: Request, res: Response) {
    try {
      const result = await reviewsService.markHelpful(req.params.id);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to mark review as helpful');
    }
  }

  async markNotHelpful(req: Request, res: Response) {
    try {
      const result = await reviewsService.markNotHelpful(req.params.id);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to mark review as not helpful');
    }
  }
}

export const reviewsController = new ReviewsController();
