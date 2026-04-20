import { Suspense } from "react";
import { NavbarWrapper } from "@/components/layout/NavbarWrapper";
import dynamic from "next/dynamic";

const AITutorChat = dynamic(
  () => import("@/components/ai/AITutorChat").then((mod) => mod.AITutorChat),
  { ssr: false }
);

/**
 * Layout untuk semua halaman yang memerlukan autentikasi.
 * Mengambil profil user dari database secara asynchronous di dalam NavbarWrapper
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-[var(--nav-height)] w-full bg-surface border-b border-border animate-pulse" />}>
        <NavbarWrapper />
      </Suspense>
      <main className="min-h-screen bg-surface">{children}</main>
      <AITutorChat />
    </>
  );
}
