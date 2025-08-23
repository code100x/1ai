
import rateLimit from "express-rate-limit";

// Strict limiter for sensitive operations (2 requests per minute)
export const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many requests. Try again in a minute.",
  keyGenerator: (req) => {
    return req.body.email;
  },
});

// Relaxed limiter for auth operations (5 requests per minute) 
export const perMinuteLimiterRelaxed = rateLimit({
  windowMs: 60 * 1000, // 1 minute (fixed comment)
  max: 5,
  message: "Too many requests. Try again in a minute.",
});

// Standard API limiter (20 requests per minute)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: "Too many requests. Try again in a minute.",
});

// AI chat limiter (10 requests per minute)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many AI requests. Try again in a minute.",
});

// Billing operations limiter (5 requests per minute)
export const billingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many billing requests. Try again in a minute.",
});

// Webhook limiter (100 requests per minute - higher for legitimate webhooks)
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: "Too many webhook requests. Try again in a minute.",
});
