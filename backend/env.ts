import { z } from "zod";

const envSchema = z.object({
  RZP_KEY: z.string(),
  RZP_SECRET: z.string(),
  RZP_ENVIRONMENT: z.string(),
  OPENROUTER_KEY: z.string(),
  FROM_EMAIL: z.string(),
  POSTMARK_SERVER_TOKEN: z.string(),
  DATABASE_URL: z.string(),
  RZP_WEBHOOK_SECRET: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

const { error, data } = envSchema.safeParse(process.env);

if (error) {
  console.info("Missing or invalid environment variables");
  console.error(error.issues.map((issue) => issue.path).join("\n"));
  process.exit(1);
}

export const env = data;
