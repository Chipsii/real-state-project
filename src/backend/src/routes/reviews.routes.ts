import { Router } from 'express';
import { reviewsController } from '../controllers/reviews.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

// Public: get property reviews
router.get('/property/:propertyId', (req, res) => reviewsController.getPropertyReviews(req, res));

// Protected routes
router.get('/', authMiddleware, (req, res) => reviewsController.getReviews(req, res));
router.post('/', authMiddleware, validate(createReviewSchema), (req, res) => reviewsController.createReview(req, res));
router.post('/:id/helpful', (req, res) => reviewsController.markHelpful(req, res));
router.post('/:id/not-helpful', (req, res) => reviewsController.markNotHelpful(req, res));

export default router;
