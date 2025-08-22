import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // AUTH_SECRET:
    //   process.env.NODE_ENV === "production"
    //     ? z.string()
    //     : z.string().optional(),
    // GOOGLE_CLIENT_ID: z.string(),
    // GOOGLE_CLIENT_SECRET: z.string(),
    // DATABASE_URL: z.string().url(),
    // NODE_ENV: z
    //   .enum(["development", "test", "production"])
    //   .default("development"),
      // TYPEGPT_API_KEY: z.string(),
      // SECRURE_AUTH_SECRET: z.string(),
      // WEBHOOK_URL: z.string().url(),
      // TYPEGPT_API_URL: z.string().url(),
      // TURNSTILE_SITE_KEY: z.string(),
      // TURNSTILE_SITE_SECRET: z.string(),
      // MAIL_APP_USER: z.string(),
      // MAIL_APP_PASSWORD: z.string(),
      // UPSTASH_REDIS_REST_URL: z.string().url(),
      // UPSTASH_REDIS_REST_TOKEN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    TYPEGPT_API_KEY: process.env.TYPEGPT_API_KEY,
    SECRURE_AUTH_SECRET: process.env.SECRURE_AUTH_SECRET,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    TYPEGPT_API_URL: process.env.TYPEGPT_API_URL,
    TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    TURNSTILE_SITE_SECRET: process.env.TURNSTILE_SITE_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    MAIL_APP_USER: process.env.MAIL_APP_USER,
    MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
