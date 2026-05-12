import { Response } from 'express';
import { savedSearchService } from '../services/savedSearch.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class SavedSearchController {
  async getSavedSearches(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await savedSearchService.getSavedSearches(req.user!.id, req.query);
      sendSuccess(res, result.savedSearches, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch saved searches');
    }
  }

  async createSavedSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, search_criteria } = req.body;
      const savedSearch = await savedSearchService.createSavedSearch(req.user!.id, title, search_criteria);
      sendCreated(res, savedSearch);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to save search');
    }
  }

  async updateSavedSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const savedSearch = await savedSearchService.updateSavedSearch(req.params.id, req.user!.id, req.body);
      sendSuccess(res, savedSearch);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        Errors.notFound(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to update saved search');
      }
    }
  }

  async deleteSavedSearch(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await savedSearchService.deleteSavedSearch(req.params.id, req.user!.id);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to delete saved search');
    }
  }
}

export const savedSearchController = new SavedSearchController();
