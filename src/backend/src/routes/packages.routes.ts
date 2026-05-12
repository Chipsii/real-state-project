import { Router } from 'express';
import { packagesController } from '../controllers/packages.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All package routes require auth
router.use(authMiddleware);

router.get('/', (req, res) => packagesController.getPackages(req, res));
router.get('/my', (req, res) => packagesController.getMyPackage(req, res));
router.post('/subscribe/:packageId', (req, res) => packagesController.subscribe(req, res));

export default router;
