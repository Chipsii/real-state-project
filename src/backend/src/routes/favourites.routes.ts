import { Router } from 'express';
import { favouritesController } from '../controllers/favourites.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All favourite routes require auth
router.use(authMiddleware);

router.get('/', (req, res) => favouritesController.getFavourites(req, res));
router.post('/:propertyId', (req, res) => favouritesController.addFavourite(req, res));
router.delete('/:propertyId', (req, res) => favouritesController.removeFavourite(req, res));

export default router;
