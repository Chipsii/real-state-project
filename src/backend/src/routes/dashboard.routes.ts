import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All dashboard routes require auth
router.use(authMiddleware);

router.get('/stats', (req, res) => dashboardController.getStats(req, res));
router.get('/property-views', (req, res) => dashboardController.getPropertyViews(req, res));
router.get('/recent-activities', (req, res) => dashboardController.getRecentActivities(req, res));

export default router;
