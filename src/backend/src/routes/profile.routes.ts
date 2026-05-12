import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema, updateSocialLinksSchema } from '../validators/profile.validator';
import { uploadSingle } from '../utils/fileUpload';

const router = Router();

// All profile routes require auth
router.use(authMiddleware);

router.get('/', (req, res) => profileController.getProfile(req, res));
router.put('/', validate(updateProfileSchema), (req, res) => profileController.updateProfile(req, res));
router.put('/social', validate(updateSocialLinksSchema), (req, res) => profileController.updateSocialLinks(req, res));
router.post('/avatar', uploadSingle, (req, res) => profileController.uploadAvatar(req, res));
router.delete('/avatar', (req, res) => profileController.deleteAvatar(req, res));

export default router;
