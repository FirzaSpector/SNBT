import { z } from "zod";

/**
 * Centralized environment variable validation.
 * Fails fast on import if required vars are missing.
 *
 * Usage:
 *   import { env } from "@/lib/env";
 *   const url = env.NEXT_PUBLIC_SUPABASE_URL;
 */

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL harus URL valid"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY wajib diisi").optional(),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL wajib diisi").optional(),

  // Upstash Redis (optional — graceful degradation if not set)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Anthropic AI (optional)
  ANTHROPIC_API_KEY: z.string().min(1).optional(),

  // Midtrans (optional)
  MIDTRANS_SERVER_KEY: z.string().min(1).optional(),
  MIDTRANS_CLIENT_KEY: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  ❌ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(
      `\n🔴 Environment variable validation failed:\n${formatted}\n`
    );

    // In production, crash immediately. In dev, allow partial startup.
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing required environment variables");
    }
  }

  // Return parsed data or fall back to raw process.env with type assertion
  return (parsed.success ? parsed.data : process.env) as Env;
}

export const env = validateEnv();
