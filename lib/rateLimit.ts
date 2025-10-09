/**
 * Simple in-memory rate limiter using token bucket algorithm
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_TOKENS = 5; // Maximum requests per window
const REFILL_RATE = 1; // Tokens per minute
const REFILL_INTERVAL = 60 * 1000; // 1 minute in milliseconds

/**
 * Check if request is allowed and consume a token
 */
export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(identifier);

  if (!entry) {
    // First request from this identifier
    entry = {
      tokens: MAX_TOKENS - 1,
      lastRefill: now,
    };
    rateLimitMap.set(identifier, entry);
    return { allowed: true };
  }

  // Calculate how many tokens to add based on time elapsed
  const timeSinceRefill = now - entry.lastRefill;
  const tokensToAdd = Math.floor(timeSinceRefill / REFILL_INTERVAL) * REFILL_RATE;

  if (tokensToAdd > 0) {
    entry.tokens = Math.min(MAX_TOKENS, entry.tokens + tokensToAdd);
    entry.lastRefill = now;
  }

  // Check if we have tokens available
  if (entry.tokens > 0) {
    entry.tokens--;
    return { allowed: true };
  }

  // Calculate retry after time
  const nextRefill = entry.lastRefill + REFILL_INTERVAL;
  const retryAfter = Math.ceil((nextRefill - now) / 1000); // seconds

  return { allowed: false, retryAfter };
}

/**
 * Clean up old entries periodically to prevent memory leak
 */
setInterval(() => {
  const now = Date.now();
  const maxAge = REFILL_INTERVAL * 10; // 10 refill intervals

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastRefill > maxAge) {
      rateLimitMap.delete(key);
    }
  }
}, REFILL_INTERVAL * 5); // Clean every 5 minutes
