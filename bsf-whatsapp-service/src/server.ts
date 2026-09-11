import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { initializeFirebaseAdmin } from './config/firebase';
import { WhatsAppSessionManager } from './services/WhatsAppSessionManager';
import whatsappRoutes from './routes/whatsappRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CORS CONFIGURATION
// ==========================================
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.run.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      
      logger.warn({ origin }, 'Blocked by CORS policy');
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, _res, next) => {
  logger.debug({ method: req.method, path: req.path }, 'Incoming Request');
  next();
});

// Top-Level Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BSF WhatsApp Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount WhatsApp API Routes
app.use('/', whatsappRoutes);

// Error Handling Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err: err.message, stack: err.stack }, 'Unhandled Server Error');
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV !== 'production' ? err.message : undefined
  });
});

// Start Server & Initialize Services
async function startServer() {
  try {
    // 1. Initialize Firebase Admin SDK
    initializeFirebaseAdmin();

    // 2. Restore any persisted Baileys sessions from disk
    await WhatsAppSessionManager.restorePersistedSessions();

    // 3. Listen on dynamically configured port
    app.listen(Number(PORT), '0.0.0.0', () => {
      logger.info(
        `BSF WhatsApp Service is running on port ${PORT} [Environment: ${process.env.NODE_ENV || 'development'}]`
      );
    });
  } catch (error: any) {
    logger.fatal({ err: error.message }, 'Failed to start BSF WhatsApp Service');
    process.exit(1);
  }
}

// Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down BSF WhatsApp Service gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down BSF WhatsApp Service gracefully...');
  process.exit(0);
});

startServer();
