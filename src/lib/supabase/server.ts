import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client untuk sisi server (Server Components, Server Actions, Route Handlers).
 * Membaca cookie dari request untuk mendapatkan session user.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Dapat diabaikan jika dipanggil dari Server Component
            // Middleware menangani refresh session
          }
        },
      },
    }
  );
}

/**
 * Supabase admin client menggunakan service role key.
 * HANYA untuk Route Handlers yang membutuhkan akses penuh (bypass RLS).
 * JANGAN gunakan di client-side code!
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );
}
