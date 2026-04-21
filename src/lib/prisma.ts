import { PrismaClient } from "@prisma/client";

/**
 * Singleton pattern untuk Prisma Client.
 * Mencegah multiple connections di development dengan hot-reload Next.js.
 *
 * Menggunakan `declare global` untuk type safety tanpa `as unknown`.
 */

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prismaClient ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma;
}
