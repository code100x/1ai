import rateLimit from "express-rate-limit";

// per-minute limiter
export const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1,
  message: "Too many requests. Try again in a minute.",
});

// per-hour limiter
export const perHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many requests. Try again in an hour.",
});

// per-day limiter
export const perDayLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  max: 10,
  message: "Too many requests. Try again in day.",
});
