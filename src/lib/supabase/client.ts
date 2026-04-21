import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk sisi client (browser).
 * Dipakai di Client Components dan React hooks.
 *
 * CATATAN: Menggunakan process.env langsung (bukan env.ts) karena
 * Next.js melakukan static replacement pada process.env.NEXT_PUBLIC_*
 * di client bundle. Object-level access (env.ts) tidak berfungsi di browser.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib dikonfigurasi."
    );
  }

  return createBrowserClient(url, anonKey);
}
