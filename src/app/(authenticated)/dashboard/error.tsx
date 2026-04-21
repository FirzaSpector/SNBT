"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-danger" aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-bold text-text-primary mb-2">
        Gagal Memuat Dashboard
      </h2>
      <p className="text-text-secondary text-sm mb-6 max-w-sm">
        Maaf, terjadi kesalahan saat memuat dashboard kamu. Coba muat ulang halaman ini.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          aria-label="Coba muat ulang dashboard"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-surface text-text-primary border border-border font-semibold px-5 py-2.5 rounded-xl hover:bg-border/50 transition-colors"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Beranda
        </Link>
      </div>
    </div>
  );
}
