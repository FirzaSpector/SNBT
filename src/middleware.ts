import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware Next.js:
 * 1. Refresh Supabase session di setiap request
 * 2. Proteksi route yang butuh autentikasi
 * 3. Redirect sesuai status auth
 * 4. Security headers
 */

// Route yang membutuhkan login
const PROTECTED_ROUTES = [
  "/dashboard",
  "/latihan",
  "/tryout",
  "/leaderboard",
  "/profil",
  "/admin",
];

// Route yang hanya bisa diakses tanpa login
const AUTH_ROUTES = ["/login", "/register"];

// Route admin saja
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Cek tipe route
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isApiRoute = pathname.startsWith("/api");

  // Jika tidak ada route yang perlu dicek, lewati middleware
  if (!isProtectedRoute && !isAuthRoute && !isAdminRoute && !isApiRoute) {
    return NextResponse.next({ request });
  }

  // Guard: env vars tidak ada → dev mode izinkan saja
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Rate Limiting untuk API non-GET endpoints jika Redis terhubung
  if (isApiRoute && request.method !== "GET" && redisUrl && redisToken) {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");
    
    const rateLimit = new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: false,
    });

    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await rateLimit.limit(`ratelimit_${ip}`);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: Array<{
          name: string;
          value: string;
          options?: CookieOptions;
        }>
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // PENTING: jangan tambahkan logika di antara createServerClient dan getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect ke login jika belum login dan akses protected route
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect ke dashboard jika sudah login dan akses auth route
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin route: jika belum login, redirect ke login
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Tambahkan request ID header
  supabaseResponse.headers.set("X-Request-Id", crypto.randomUUID());

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
