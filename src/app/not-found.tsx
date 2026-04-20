"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-6"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-6">
          <SearchX className="w-12 h-12" />
        </div>
        
        <h1 className="font-heading text-5xl font-extrabold text-text-primary">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-text-secondary">
            Waduh, sepertinya halaman yang kamu cari sudah pindah atau memang tidak pernah ada. Coba cek lagi URL-nya ya.
          </p>
        </div>

        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-md hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
