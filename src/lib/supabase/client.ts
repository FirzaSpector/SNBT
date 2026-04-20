import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk sisi client (browser).
 * Dipakai di Client Components dan React hooks.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
