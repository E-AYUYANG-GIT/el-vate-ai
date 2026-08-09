import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_CONFIG } from '../config/rateLimitConfig.js';

// Same error shape as everything else in the app, so the client's
// existing error handling (ApiError in api.js) works without changes.
function rateLimitHandler(req, res) {
  res.status(429).json({
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please wait a bit before trying again.',
  });
}

export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.general.windowMs,
  max: RATE_LIMIT_CONFIG.general.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const generateLimiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.generate.windowMs,
  max: RATE_LIMIT_CONFIG.generate.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
