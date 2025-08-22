
import rateLimit from "express-rate-limit";

// per-minute limiter
export const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2,
  message: "Too many requests. Try again in a minute.",
});

// per-hour limiter
export const perMinuteLimiterRelaxed = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many requests. Try again in an hour.",
});
