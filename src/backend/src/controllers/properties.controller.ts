import { Request, Response } from 'express';
import { propertiesService } from '../services/properties.service';
import { sendSuccess, sendCreated, Errors } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../types';

export class PropertiesController {
  async getProperties(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as string,
        city: req.query.city as string,
        propertyType: req.query.property_type as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minBeds: req.query.minBeds ? Number(req.query.minBeds) : undefined,
        maxBeds: req.query.maxBeds ? Number(req.query.maxBeds) : undefined,
        forRent: req.query.for_rent !== undefined ? req.query.for_rent === 'true' : undefined,
        featured: req.query.featured !== undefined ? req.query.featured === 'true' : undefined,
      };

      const result = await propertiesService.getProperties(filters, req.query);
      sendSuccess(res, result.properties, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch properties');
    }
  }

  async getMyProperties(req: AuthenticatedRequest, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
      };

      const result = await propertiesService.getProperties(filters, req.query, req.user!.id);
      sendSuccess(res, result.properties, 200, result.meta);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch your properties');
    }
  }

  async getProperty(req: Request, res: Response) {
    try {
      const property = await propertiesService.getPropertyById(req.params.id);
      if (!property) {
        Errors.notFound(res, 'Property not found');
        return;
      }
      sendSuccess(res, property);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to fetch property');
    }
  }

  async createProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const { amenities, ...propertyData } = req.body;
      const property = await propertiesService.createProperty(req.user!.id, propertyData, amenities);
      sendCreated(res, property);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to create property');
    }
  }

  async updateProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const { amenities, ...updates } = req.body;
      const property = await propertiesService.updateProperty(req.params.id, req.user!.id, updates, amenities);
      sendSuccess(res, property);
    } catch (error: any) {
      if (error.message?.includes('not authorized')) {
        Errors.forbidden(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to update property');
      }
    }
  }

  async deleteProperty(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await propertiesService.deleteProperty(req.params.id, req.user!.id);
      sendSuccess(res, result);
    } catch (error: any) {
      if (error.message?.includes('not authorized')) {
        Errors.forbidden(res, error.message);
      } else {
        Errors.internal(res, error.message || 'Failed to delete property');
      }
    }
  }

  async uploadImages(req: AuthenticatedRequest, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        Errors.badRequest(res, 'No image files provided');
        return;
      }
      const images = await propertiesService.uploadImages(req.params.id, req.user!.id, files);
      sendCreated(res, images);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to upload images');
    }
  }

  async deleteImage(req: AuthenticatedRequest, res: Response) {
    try {
      const result = await propertiesService.deleteImage(req.params.id, req.params.imageId, req.user!.id);
      sendSuccess(res, result);
    } catch (error: any) {
      Errors.internal(res, error.message || 'Failed to delete image');
    }
  }
}

export const propertiesController = new PropertiesController();
