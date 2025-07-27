import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  ...process.env,
  ...(process.env["NODE_ENV"] === "test" && {
    SUPABASE_URL: "https://test.supabase.co",
    SUPABASE_ANON_KEY: "test_key",
  }),
});

export type Env = z.infer<typeof envSchema>;
