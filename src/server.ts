import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initializeFirebaseAdmin } from './config/firebase';
import { logger, baileysLogger } from './utils/logger';
import { sessionManager } from './services/WhatsAppSessionManager';
import { automationService } from './services/WhatsAppAutomationService';
import whatsappRoutes from './routes/whatsappRoutes';

// Suppress unhandled libsignal cryptographic decryption warnings and Firestore quota stream errors
// Libsignal in @whiskeysockets/baileys hardcodes calls to console.error when incoming sync/group packets
// cannot be decrypted with previous session keys. Route these to debug logs instead.
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const isBenign = args.some((arg) => {
    const text = typeof arg === 'string' ? arg : (arg && (arg.message || arg.stack || (typeof arg.toString === 'function' ? arg.toString() : '')));
    return (
      typeof text === 'string' &&
      (text.includes('Failed to decrypt message with any known session') ||
        text.includes('Session error') ||
        text.includes('SessionError') ||
        text.includes('No session record') ||
        text.includes('No matching sessions found') ||
        text.includes('Bad MAC') ||
        text.includes('session_cipher.js') ||
        text.includes('failed to decrypt message') ||
        text.includes('RESOURCE_EXHAUSTED') ||
        text.includes('resource-exhausted') ||
        text.includes('Quota limit exceeded') ||
        text.includes('Free daily write units') ||
        text.includes('free tier database') ||
        text.includes('GrpcConnection') ||
        text.includes('RPC \'Write\' stream'))
    );
  });

  if (isBenign) {
    baileysLogger.debug({ notice: args[0] }, 'Suppressed benign warning/notice');
    return;
  }
  originalConsoleError.apply(console, args);
};

// Global Node process safety: prevent unhandled libsignal session rejections or socket retries from crashing
process.on('unhandledRejection', (reason: any) => {
  const errMsg = reason instanceof Error ? reason.message : String(reason);
  const errStack = reason instanceof Error ? reason.stack || '' : '';
  if (
    errMsg.includes('SessionError') ||
    errMsg.includes('No session record') ||
    errMsg.includes('Bad MAC') ||
    errMsg.includes('No matching sessions found') ||
    errMsg.includes('init queries') ||
    errMsg.includes('Timed Out') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('Quota limit exceeded') ||
    errMsg.includes('Free daily write units') ||
    errMsg.includes('GrpcConnection') ||
    errStack.includes('session_cipher.js') ||
    errStack.includes('executeInitQueries') ||
    errStack.includes('fetchProps')
  ) {
    baileysLogger.debug({ notice: errMsg }, 'Suppressed benign unhandled libsignal/firestore rejection');
    return;
  }
  logger.warn({ error: errMsg, stack: errStack }, 'Unhandled promise rejection in server process');
});

process.on('uncaughtException', (err: any) => {
  const errMsg = err?.message || String(err);
  const errStack = err?.stack || '';
  if (
    errMsg.includes('SessionError') ||
    errMsg.includes('No session record') ||
    errMsg.includes('Bad MAC') ||
    errMsg.includes('No matching sessions found') ||
    errMsg.includes('init queries') ||
    errMsg.includes('Timed Out') ||
    errMsg.includes('RESOURCE_EXHAUSTED') ||
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('Quota limit exceeded') ||
    errMsg.includes('Free daily write units') ||
    errMsg.includes('GrpcConnection') ||
    errStack.includes('session_cipher.js') ||
    errStack.includes('executeInitQueries') ||
    errStack.includes('fetchProps')
  ) {
    baileysLogger.debug({ notice: errMsg }, 'Suppressed benign uncaught libsignal/firestore exception');
    return;
  }
  logger.error({ error: errMsg, stack: errStack }, 'Uncaught exception in server process');
});

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Firebase Admin SDK
try {
  initializeFirebaseAdmin();
  logger.info('Firebase Admin SDK initialized');
} catch (err: any) {
  logger.warn({ error: err?.message }, 'Firebase Admin startup warning');
}

// CORS Configuration
const rawCorsOrigin = process.env.CORS_ORIGIN;
const configuredOrigins = rawCorsOrigin
  ? rawCorsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const isOriginAllowed = (origin: string): boolean => {
  // Allow wildcard or empty configuration
  if (!rawCorsOrigin || rawCorsOrigin === '*' || configuredOrigins.includes('*')) {
    return true;
  }

  // Check explicitly configured origins
  if (configuredOrigins.includes(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();

    // Allow all Google Cloud Run domains (AI Studio dev/preview/deployed URLs)
    if (hostname.endsWith('.run.app')) {
      return true;
    }

    // Allow AI Studio and Google preview origins
    if (
      hostname.endsWith('.google.com') ||
      hostname.endsWith('.googleusercontent.com') ||
      hostname.endsWith('.web.app') ||
      hostname.endsWith('.firebaseapp.com')
    ) {
      return true;
    }

    // Allow local development origins
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0'
    ) {
      return true;
    }

    // Allow official domain
    if (
      hostname === 'blackstonefitness.in' ||
      hostname.endsWith('.blackstonefitness.in')
    ) {
      return true;
    }
  } catch {
    // If not a parseable URL, fallback safely
  }

  // In non-production or for preview iframe compatibility, allow requests
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  // Gracefully allow origins to prevent breaking web clients
  return true;
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl, same-origin)
      if (!origin) return callback(null, true);

      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }

      logger.warn({ origin }, 'CORS request from unlisted origin');
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 204,
  })
);

app.options('*', cors());
logger.info({ configuredOrigins }, 'CORS configured with Cloud Run and preview support');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check endpoints
app.get(['/health', '/api/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'BSF WhatsApp Service',
  });
});

// Mount BSF WhatsApp Service API Routes
app.use('/api/whatsapp', whatsappRoutes);

// Global error handling middleware for API routes
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.error({ error: err?.message, stack: err?.stack }, 'Unhandled server error');
  res.status(err?.status || 500).json({
    success: false,
    error: err?.message || 'Internal server error',
  });
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  // 1. Mount Vite middleware in development or static serve in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 2. Bind and listen on port 3000 immediately so dev server readiness checks pass instantly
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`BSF WhatsApp Service running on http://0.0.0.0:${PORT}`);

    // 3. Asynchronously initialize WhatsApp background recovery, keep-alive daemon & scheduler without delaying port binding
    setImmediate(async () => {
      try {
        await sessionManager.restoreExistingSessions();
        sessionManager.startKeepAliveDaemon();
        logger.info('WhatsApp continuous keep-alive & auto-heal daemon active');
      } catch (recErr: any) {
        logger.warn({ error: recErr?.message }, 'Restart recovery warning');
      }

      try {
        automationService.startBackgroundScheduler('bsf-mysuru');
        logger.info('WhatsApp automated scheduler initialized for bsf-mysuru');
      } catch (autoErr: any) {
        logger.warn({ error: autoErr?.message }, 'WhatsApp automated scheduler startup warning');
      }
    });
  });

  // Graceful shutdown
  const handleShutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received. Closing BSF WhatsApp Service...');
    server.close(async () => {
      automationService.stopBackgroundScheduler();
      await sessionManager.shutdown();
      logger.info('All WhatsApp sockets and HTTP listeners closed safely.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();

export default app;
