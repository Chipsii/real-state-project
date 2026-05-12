import { Router } from 'express';
import { savedSearchController } from '../controllers/savedSearch.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSavedSearchSchema, updateSavedSearchSchema } from '../validators/review.validator';

const router = Router();

// All saved search routes require auth
router.use(authMiddleware);

router.get('/', (req, res) => savedSearchController.getSavedSearches(req, res));
router.post('/', validate(createSavedSearchSchema), (req, res) => savedSearchController.createSavedSearch(req, res));
router.put('/:id', validate(updateSavedSearchSchema), (req, res) => savedSearchController.updateSavedSearch(req, res));
router.delete('/:id', (req, res) => savedSearchController.deleteSavedSearch(req, res));

export default router;
