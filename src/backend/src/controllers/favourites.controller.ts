import { Response } from 'express';
import { favouritesService } from '../services/favourites.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class FavouritesController {
  async getFavourites(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await favouritesService.getFavourites(req.user!.id, req.query);
      sendSuccess(res, result.favourites, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch favourites');
    }
  }

  async addFavourite(req: AuthenticatedRequest, res: Response) {
    try {
      const favourite = await favouritesService.addFavourite(req.user!.id, req.params.propertyId);
      sendCreated(res, favourite);
    } catch (error: any) {
      if (error.message?.includes('already in your favourites')) {
        Errors.conflict(res, error.message);
      } else if (error.message?.includes('not found')) {
        Errors.notFound(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to add to favourites');
      }
    }
  }

  async removeFavourite(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await favouritesService.removeFavourite(req.user!.id, req.params.propertyId);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to remove from favourites');
    }
  }
}

export const favouritesController = new FavouritesController();
