import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Validate environment
env.validate();

const app = express();

// ── Security ──
app.use(helmet());

// ── CORS ──
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──
if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── API Routes ──
app.use('/api/v1', routes);

// ── Root endpoint ──
app.get('/', (_req, res) => {
  res.json({
    name: 'Real Estate Dashboard API',
    version: '1.0.0',
    docs: '/api/v1/health',
    endpoints: {
      health: 'GET /api/v1/health',
      auth: '/api/v1/auth/*',
      profile: '/api/v1/profile/*',
      properties: '/api/v1/properties/*',
      dashboard: '/api/v1/dashboard/*',
      messages: '/api/v1/messages/*',
      favourites: '/api/v1/favourites/*',
      reviews: '/api/v1/reviews/*',
      savedSearches: '/api/v1/saved-searches/*',
      packages: '/api/v1/packages/*',
    },
  });
});

// ── 404 Handler ──
app.use(notFoundHandler);

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
app.listen(env.port, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   🏠 Real Estate Dashboard API                  ║
  ║──────────────────────────────────────────────────║
  ║   Port:        ${env.port}                             ║
  ║   Environment: ${env.nodeEnv.padEnd(30)}║
  ║   API Base:    http://localhost:${env.port}/api/v1      ║
  ║   Health:      http://localhost:${env.port}/api/v1/health║
  ╚══════════════════════════════════════════════════╝
  `);
});

export default app;
