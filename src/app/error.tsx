"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full space-y-6"
      >
        <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto text-danger mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            Terjadi Kesalahan
          </h1>
          <p className="text-text-secondary text-sm">
            Maaf, ada masalah di server kami saat ini. Tim kami sudah diberi tahu dan sedang memperbaikinya.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Coba Lagi
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-surface text-text-primary border border-border font-semibold px-6 py-3 rounded-xl hover:bg-border transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
