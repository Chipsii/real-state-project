import { Router } from 'express';
import { propertiesController } from '../controllers/properties.controller';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPropertySchema, updatePropertySchema, propertyQuerySchema } from '../validators/property.validator';
import { uploadMultiple } from '../utils/fileUpload';

const router = Router();

// Public routes
router.get('/', validate(propertyQuerySchema, 'query'), (req, res) => propertiesController.getProperties(req, res));
router.get('/:id', (req, res) => propertiesController.getProperty(req, res));

// Protected routes
router.get('/user/my', authMiddleware, (req, res) => propertiesController.getMyProperties(req, res));
router.post('/', authMiddleware, validate(createPropertySchema), (req, res) => propertiesController.createProperty(req, res));
router.put('/:id', authMiddleware, validate(updatePropertySchema), (req, res) => propertiesController.updateProperty(req, res));
router.delete('/:id', authMiddleware, (req, res) => propertiesController.deleteProperty(req, res));
router.post('/:id/images', authMiddleware, uploadMultiple, (req, res) => propertiesController.uploadImages(req, res));
router.delete('/:id/images/:imageId', authMiddleware, (req, res) => propertiesController.deleteImage(req, res));

export default router;
