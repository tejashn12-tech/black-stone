/**
 * WhatsApp Environment & Session Vault Isolation
 *
 * Enforces strict boundaries between:
 * - AI Studio Development: _private_server_auth/bsf_whatsapp_session_dev
 * - Cloud Run Production: _private_server_auth/bsf_whatsapp_session_prod
 *
 * Rules:
 * 1. Environment is determined strictly server-side (never from client/browser requests).
 * 2. Production can ONLY read/write bsf_whatsapp_session_prod.
 * 3. Development can ONLY read/write bsf_whatsapp_session_dev.
 * 4. Cross-environment access throws immediate, unrecoverable server errors.
 * 5. Credentials, keys, and private data are never logged or exposed.
 */

export type WhatsAppEnvironment = 'development' | 'production';
export type WhatsAppSessionVault = 'dev' | 'prod';

export const VAULT_COLLECTION = '_private_server_auth';
export const DEV_VAULT_DOC_ID = 'bsf_whatsapp_session_dev';
export const PROD_VAULT_DOC_ID = 'bsf_whatsapp_session_prod';

/**
 * Determines the server environment without relying on frontend input.
 */
export function getWhatsAppEnvironment(): WhatsAppEnvironment {
  // Cloud Run & AI Studio detection:
  // In AI Studio preview containers, K_SERVICE begins with 'ais-' or AUTHORIZED_SERVICE_ACCOUNT_EMAIL contains 'ais-sandbox'.
  // AI Studio preview containers are ALWAYS development and must always use development session vault (bsf_whatsapp_session_dev).
  const kService = process.env.K_SERVICE || '';
  const isAiStudio =
    kService.startsWith('ais-') ||
    Boolean(process.env.AUTHORIZED_SERVICE_ACCOUNT_EMAIL?.includes('ais-sandbox'));

  if (isAiStudio) {
    return 'development';
  }

  // Explicit override if configured in external deployment
  if (process.env.WHATSAPP_ENVIRONMENT === 'production' || process.env.WHATSAPP_ENV === 'production') {
    return 'production';
  }
  if (process.env.WHATSAPP_ENVIRONMENT === 'development' || process.env.WHATSAPP_ENV === 'development') {
    return 'development';
  }

  if (kService.length > 0 || process.env.NODE_ENV === 'production') {
    return 'production';
  }

  return 'development';
}

/**
 * Gets the designated session vault identifier ('dev' or 'prod')
 */
export function getWhatsAppSessionVault(): WhatsAppSessionVault {
  return getWhatsAppEnvironment() === 'production' ? 'prod' : 'dev';
}

/**
 * Resolves the Firestore document ID for session vault persistence.
 * Enforces strict cross-environment safeguards.
 */
export function getWhatsAppVaultDocId(requestedVault?: WhatsAppSessionVault): string {
  const currentEnv = getWhatsAppEnvironment();
  const currentVault = getWhatsAppSessionVault();
  const targetVault = requestedVault || currentVault;

  // Strict cross-environment boundary enforcement
  if (currentEnv === 'production' && targetVault === 'dev') {
    throw new Error(
      `[Security Exception] Cross-environment violation: Production environment attempted to access development session vault (${DEV_VAULT_DOC_ID})`
    );
  }
  if (currentEnv === 'development' && targetVault === 'prod') {
    throw new Error(
      `[Security Exception] Cross-environment violation: Development environment attempted to access production session vault (${PROD_VAULT_DOC_ID})`
    );
  }

  return targetVault === 'prod' ? PROD_VAULT_DOC_ID : DEV_VAULT_DOC_ID;
}

/**
 * Validates that an arbitrary document path does not violate environment boundaries.
 */
export function validateVaultDocAccess(docId: string, expectedEnv?: WhatsAppEnvironment): void {
  const currentEnv = expectedEnv || getWhatsAppEnvironment();

  if (currentEnv === 'production' && docId === DEV_VAULT_DOC_ID) {
    throw new Error(
      `[Security Exception] Cross-environment violation: Production cannot access ${DEV_VAULT_DOC_ID}`
    );
  }
  if (currentEnv === 'development' && docId === PROD_VAULT_DOC_ID) {
    throw new Error(
      `[Security Exception] Cross-environment violation: Development cannot access ${PROD_VAULT_DOC_ID}`
    );
  }
}
