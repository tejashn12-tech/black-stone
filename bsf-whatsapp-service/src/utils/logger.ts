import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

export const logger = pino({
  level: logLevel,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname'
          }
        }
      : undefined
});

// Silent child logger for Baileys internal noisy logs unless explicitly enabled
export const baileysLogger = logger.child({ module: 'baileys' }, { level: process.env.BAILEYS_LOG_LEVEL || 'silent' });
