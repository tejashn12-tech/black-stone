/**
 * MessageRateLimiter enforces server-side rate limits and cooldown periods:
 * 1. Global message dispatch throughput throttling (prevents socket bans / burst floods).
 * 2. Per-recipient phone cooldown (prevents rapid double-sends to the same user).
 * 3. Test message double-click debounce protection.
 */

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  reason?: string;
}

export class MessageRateLimiter {
  private static instance: MessageRateLimiter | null = null;

  // Track timestamps of dispatches per recipient phone
  private lastDispatchByPhone: Map<string, number> = new Map();

  // Track dispatches for test messages (for accidental double-click protection)
  private lastTestDispatchByPhone: Map<string, number> = new Map();

  // Sliding window timestamps for global throttle
  private globalDispatchTimestamps: number[] = [];

  // Configuration constants
  private readonly RECIPIENT_COOLDOWN_MS = 4000; // 4 seconds cooldown per recipient phone
  private readonly TEST_COOLDOWN_MS = 5000; // 5 seconds cooldown for test messages
  private readonly GLOBAL_WINDOW_MS = 10000; // 10 seconds sliding window
  private readonly MAX_GLOBAL_PER_WINDOW = 20; // Max 20 messages per 10 seconds

  private constructor() {
    // Periodically clean up old timestamps every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  public static getInstance(): MessageRateLimiter {
    if (!MessageRateLimiter.instance) {
      MessageRateLimiter.instance = new MessageRateLimiter();
    }
    return MessageRateLimiter.instance;
  }

  /**
   * Sanitizes phone number to digits-only key for cooldown tracking
   */
  private sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Checks whether a message can be dispatched under rate limits and recipient cooldown
   */
  public checkRateLimit(phone: string): RateLimitResult {
    const now = Date.now();
    const cleanPhone = this.sanitizePhone(phone);

    // 1. Check per-recipient cooldown
    const lastTime = this.lastDispatchByPhone.get(cleanPhone) || 0;
    const elapsedSinceLast = now - lastTime;

    if (elapsedSinceLast < this.RECIPIENT_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((this.RECIPIENT_COOLDOWN_MS - elapsedSinceLast) / 1000);
      return {
        allowed: false,
        retryAfterSeconds: waitSeconds,
        reason: `Recipient cooldown active. Please wait ${waitSeconds}s before sending another message to this phone number.`
      };
    }

    // 2. Check global sliding window
    this.globalDispatchTimestamps = this.globalDispatchTimestamps.filter(
      (ts) => now - ts < this.GLOBAL_WINDOW_MS
    );

    if (this.globalDispatchTimestamps.length >= this.MAX_GLOBAL_PER_WINDOW) {
      const oldestInWindow = this.globalDispatchTimestamps[0];
      const waitSeconds = Math.max(1, Math.ceil((this.GLOBAL_WINDOW_MS - (now - oldestInWindow)) / 1000));
      return {
        allowed: false,
        retryAfterSeconds: waitSeconds,
        reason: `Server message rate limit reached (${this.MAX_GLOBAL_PER_WINDOW} msgs / 10s). Please wait ${waitSeconds}s.`
      };
    }

    return { allowed: true };
  }

  /**
   * Records a successful dispatch reservation for rate limits
   */
  public recordDispatch(phone: string): void {
    const now = Date.now();
    const cleanPhone = this.sanitizePhone(phone);

    this.lastDispatchByPhone.set(cleanPhone, now);
    this.globalDispatchTimestamps.push(now);
  }

  /**
   * Specifically checks and records test message protection against double-clicking
   */
  public checkTestDoubleDispatch(phone: string): RateLimitResult {
    const now = Date.now();
    const cleanPhone = this.sanitizePhone(phone);

    const lastTestTime = this.lastTestDispatchByPhone.get(cleanPhone) || 0;
    const elapsed = now - lastTestTime;

    if (elapsed < this.TEST_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((this.TEST_COOLDOWN_MS - elapsed) / 1000);
      return {
        allowed: false,
        retryAfterSeconds: waitSeconds,
        reason: `Test message already dispatched to ${phone}. Accidental double-click prevented. Please wait ${waitSeconds}s.`
      };
    }

    // Also check standard global limit
    const globalCheck = this.checkRateLimit(phone);
    if (!globalCheck.allowed) {
      return globalCheck;
    }

    // Record test dispatch timestamp immediately to debounce rapid clicks
    this.lastTestDispatchByPhone.set(cleanPhone, now);
    return { allowed: true };
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 1000; // 1 minute

    for (const [phone, ts] of this.lastDispatchByPhone.entries()) {
      if (now - ts > maxAge) {
        this.lastDispatchByPhone.delete(phone);
      }
    }

    for (const [phone, ts] of this.lastTestDispatchByPhone.entries()) {
      if (now - ts > maxAge) {
        this.lastTestDispatchByPhone.delete(phone);
      }
    }
  }
}
