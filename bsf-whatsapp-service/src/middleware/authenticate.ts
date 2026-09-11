import { Request, Response, NextFunction } from 'express';
import { getAdminAuth, verifyGymAccess } from '../config/firebase';
import { logger } from '../utils/logger';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request interface to include authenticated user and gymId
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      gymId?: string;
    }
  }
}

/**
 * Firebase Authentication & Gym Authorization Middleware
 * Verifies Bearer ID token sent in Authorization header
 */
export async function authenticateFirebaseUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ path: req.path }, 'Unauthorized request: Missing Bearer token in Authorization header');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Authorization Bearer token is required'
    });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  if (!idToken) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Token payload is empty'
    });
  }

  // Development bypass helper for quick local testing before Firebase Service Account configuration
  if (
    process.env.NODE_ENV !== 'production' &&
    (idToken === 'dev-token' || process.env.ALLOW_DEV_BYPASS === 'true')
  ) {
    logger.debug({ path: req.path }, 'Development authentication bypass active');
    req.user = {
      uid: 'dev-user-01',
      email: 'admin@blackstonefitness.in',
      auth_time: Math.floor(Date.now() / 1000),
      iss: 'https://securetoken.google.com/bsf-dev',
      aud: 'bsf-dev',
      sub: 'dev-user-01',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      firebase: { identities: {}, sign_in_provider: 'custom' }
    } as any;
    req.gymId = (req.body?.gymId || req.query?.gymId || req.params?.gymId || 'bsf_mysuru_01') as string;
    return next();
  }

  try {
    const auth = getAdminAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // Attach decoded Firebase user to request
    req.user = decodedToken;

    // Gym Authorization Check
    const requestedGymId = (req.body?.gymId || req.query?.gymId || req.params?.gymId || 'bsf_mysuru_01') as string;
    const { authorized, gymId } = await verifyGymAccess(decodedToken.uid, decodedToken.email, requestedGymId);

    if (!authorized) {
      logger.warn({ uid: decodedToken.uid, requestedGymId }, 'Forbidden: User does not have access to requested gym');
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to access WhatsApp services for this gym'
      });
    }

    req.gymId = gymId;
    next();
  } catch (error: any) {
    logger.error({ err: error.message }, 'Firebase token verification failed');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired Firebase ID token',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
}
