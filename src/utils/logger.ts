import pino from 'pino';

/**
 * Identify expected/benign Baileys & libsignal protocol decryption notices
 * (e.g. historical chat sync, multi-device LID messages, unassociated keys)
 * so they are never logged as level 50 errors.
 */
export const isBenignBaileysNotice = (args: any[]): boolean => {
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') {
      const lower = arg.toLowerCase();
      if (
        lower.includes('failed to decrypt message') ||
        lower.includes('no session record') ||
        lower.includes('sessionerror') ||
        lower.includes('session error') ||
        lower.includes('bad mac') ||
        lower.includes('no matching sessions found') ||
        lower.includes('closing stale open socket') ||
        lower.includes('stream errored out') ||
        lower.includes('stream errored') ||
        lower.includes('conflict') ||
        lower.includes('replaced') ||
        lower.includes('init queries') ||
        lower.includes('presence update requests') ||
        lower.includes('timed out') ||
        lower.includes('request time-out')
      ) {
        return true;
      }
    } else if (typeof arg === 'object') {
      const err = arg.err || arg.error || arg;
      const errMsg = typeof err?.message === 'string' ? err.message.toLowerCase() : '';
      const errStack = typeof err?.stack === 'string' ? err.stack.toLowerCase() : '';
      const errName = typeof err?.name === 'string' ? err.name : '';
      const msg = typeof arg.msg === 'string' ? arg.msg.toLowerCase() : '';
      const nodeTag = arg.node?.tag || arg.node?.content?.[0]?.tag;
      const statusCode = arg.statusCode || err?.output?.statusCode;

      if (
        msg.includes('failed to decrypt message') ||
        msg.includes('stream errored out') ||
        msg.includes('init queries') ||
        msg.includes('presence update requests') ||
        errMsg.includes('no session record') ||
        errMsg.includes('bad mac') ||
        errMsg.includes('sessionerror') ||
        errMsg.includes('no matching sessions found') ||
        errMsg.includes('conflict') ||
        errMsg.includes('replaced') ||
        errMsg.includes('timed out') ||
        errMsg.includes('request time-out') ||
        errName === 'SessionError' ||
        errStack.includes('session_cipher.js') ||
        errStack.includes('no session record') ||
        errStack.includes('executeinitqueries') ||
        errStack.includes('fetchprops') ||
        nodeTag === 'conflict' ||
        nodeTag === 'stream:error' ||
        statusCode === 440 ||
        statusCode === 408
      ) {
        return true;
      }
    }
  }
  return false;
};

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
    log(object: Record<string, any>) {
      // Remove empty errors arrays and falsy error fields so automated monitoring log scrapers do not flag benign logs
      const cleanObj = (target: any): any => {
        if (!target || typeof target !== 'object') return target;
        if (Array.isArray(target)) return target.map(cleanObj);
        const result: Record<string, any> = {};
        for (const [key, val] of Object.entries(target)) {
          if (
            (key === 'errors' && Array.isArray(val) && val.length === 0) ||
            ((key === 'error' || key === 'errors') && (val === null || val === undefined || val === ''))
          ) {
            continue;
          }
          result[key] = cleanObj(val);
        }
        return result;
      };
      return cleanObj(object);
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: 'BSF WhatsApp Service',
  },
  hooks: {
    logMethod(inputArgs, method, level) {
      if (level >= 40 && isBenignBaileysNotice(inputArgs)) {
        return (this as any).debug.apply(this, inputArgs);
      }
      return method.apply(this, inputArgs);
    },
  },
});

export const baileysLogger = pino({
  level: process.env.BAILEYS_LOG_LEVEL || 'silent',
  timestamp: pino.stdTimeFunctions.isoTime,
  hooks: {
    logMethod(inputArgs, method, level) {
      if (level >= 40 && isBenignBaileysNotice(inputArgs)) {
        return (this as any).debug.apply(this, inputArgs);
      }
      return method.apply(this, inputArgs);
    },
  },
});
