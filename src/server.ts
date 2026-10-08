import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Suppress internal libsignal session retry noise (Bad MAC / failed to decrypt)
// which libsignal prints directly to console.error before Baileys automatically emits sendRetryRequest.
const originalConsoleError = console.error;
console.error = function (...args: any[]) {
  const first = typeof args[0] === 'string' ? args[0] : '';
  if (
    first.includes('Failed to decrypt message with any known session') ||
    first.includes('Session error:') ||
    first.includes('Bad MAC')
  ) {
    // Normal Signal ratchet desync retry handled automatically by Baileys sendRetryRequest
    return;
  }
  originalConsoleError.apply(console, args);
};

import { initializeFirebaseAdmin } from './config/firebase';
import { logger } from './utils/logger';
import { whatsappRoutes } from './routes/whatsappRoutes';
import { WhatsAppService } from './whatsapp/WhatsAppService';
import { RenewalAutomationService } from './whatsapp/automation/RenewalAutomationService';
import { getWhatsAppEnvironment, getWhatsAppSessionVault } from './whatsapp/environment';

dotenv.config();

const app = express();
// Port 3000 is required by the AI Studio environment (reverse proxy runs on 8080)
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

  return true;
};

app.use(
  cors({
    origin: (origin, callback) => {
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
    service: 'BSF API Service',
  });
});

// WhatsApp API Gateway
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

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`BSF Server running on http://0.0.0.0:${PORT}`);
    const waEnv = getWhatsAppEnvironment();
    const waVault = getWhatsAppSessionVault();
    logger.info(`WHATSAPP_ENVIRONMENT=${waEnv}`);
    logger.info(`WHATSAPP_SESSION_VAULT=${waVault}`);
  });

  // Initialize WhatsApp service on server boot
  try {
    WhatsAppService.getInstance().initialize().catch((waInitErr) => {
      logger.warn({ error: waInitErr?.message }, 'WhatsApp background initialization notice');
    });
  } catch (err: any) {
    logger.warn({ error: err?.message }, 'WhatsApp initialization notice');
  }

  // Start Server-Side Membership Renewal Automation Scheduler
  try {
    RenewalAutomationService.getInstance().startScheduler();
    logger.info('BSF Server-side Renewal Automation Scheduler started (Asia/Kolkata timezone)');
  } catch (autoErr: any) {
    logger.warn({ error: autoErr?.message }, 'Renewal scheduler initialization notice');
  }

  const handleShutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received. Closing BSF Server...');
    try {
      RenewalAutomationService.getInstance().stopScheduler();
    } catch {}
    try {
      await WhatsAppService.getInstance().shutdown();
    } catch {}
    server.close(() => {
      logger.info('HTTP listeners closed safely.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();

export {
  getWhatsAppEnvironment,
  getWhatsAppSessionVault,
  getWhatsAppVaultDocId,
  validateVaultDocAccess,
  DEV_VAULT_DOC_ID,
  PROD_VAULT_DOC_ID,
} from './whatsapp/environment';

export default app;
