import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import propertiesRoutes from './properties.routes';
import dashboardRoutes from './dashboard.routes';
import messagesRoutes from './messages.routes';
import favouritesRoutes from './favourites.routes';
import reviewsRoutes from './reviews.routes';
import savedSearchRoutes from './savedSearch.routes';
import packagesRoutes from './packages.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/properties', propertiesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/messages', messagesRoutes);
router.use('/favourites', favouritesRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/saved-searches', savedSearchRoutes);
router.use('/packages', packagesRoutes);

export default router;
