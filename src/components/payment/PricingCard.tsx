"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, Star, Loader2, ArrowRight, Zap } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

// Deklarasi global untuk Midtrans Snap
declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

interface SnapOptions {
  onSuccess: (result: unknown) => void;
  onPending: (result: unknown) => void;
  onError: (result: unknown) => void;
  onClose: () => void;
}

interface PricingCardProps {
  nama: string;
  harga: number;
  hargaDisplay: string;
  periode: string;
  deskripsi: string;
  fitur: string[];
  highlight: boolean;
  badge?: string;
  paket: "pro_monthly" | "pro_yearly";
  isLoggedIn: boolean;
}

export function PricingCard({
  nama,
  harga,
  hargaDisplay,
  periode,
  deskripsi,
  fitur,
  highlight,
  badge,
  paket,
  isLoggedIn,
}: PricingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBayar = async () => {
    if (!isLoggedIn) {
      router.push(`/register?plan=${paket}`);
      return;
    }

    setIsLoading(true);

    try {
      // Load Midtrans Snap JS jika belum ada
      if (!window.snap) {
        await loadSnapScript();
      }

      // Request Snap token dari API kita
      const response = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paket }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat transaksi");
      }

      const { snapToken } = await response.json() as { snapToken: string };

      // Buka Midtrans Snap popup
      window.snap?.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil! Akun PRO kamu sudah aktif 🎉", {
            duration: 6000,
          });
          router.push("/dashboard?upgraded=true");
          router.refresh();
        },
        onPending: () => {
          toast.info("Pembayaran sedang diproses. Kami akan notify kamu!", {
            duration: 5000,
          });
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          // User menutup popup tanpa bayar — tidak apa-apa
        },
      });
    } catch {
      toast.error("Gagal memuat halaman pembayaran. Coba lagi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`card p-6 relative ${
        highlight ? "border-2 border-primary shadow-xl" : ""
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
            highlight ? "bg-primary text-white" : "bg-accent text-white"
          }`}
        >
          {badge}
        </div>
      )}

      <div className="mb-5">
        <h3 className="font-heading font-700 text-xl text-text-primary mb-1">
          {nama}
        </h3>
        <p className="text-text-secondary text-sm">{deskripsi}</p>
      </div>

      <div className="mb-6">
        <span className="font-heading text-4xl font-800 text-text-primary">
          {hargaDisplay}
        </span>
        <span className="text-text-secondary text-sm ml-1">/{periode}</span>
        {paket === "pro_yearly" && (
          <div className="text-xs text-success font-semibold mt-1">
            ≈ {formatRupiah(Math.round(harga / 12))}/bulan · Hemat 37%
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {fitur.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle
              className="w-4 h-4 text-success mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-text-secondary">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => void handleBayar()}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ${
          highlight
            ? "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            : "bg-surface text-text-primary hover:bg-border border border-border"
        } disabled:opacity-60 disabled:pointer-events-none`}
        id={`pricing-${paket}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Memuat...
          </>
        ) : (
          <>
            {highlight ? (
              <Zap className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Star className="w-4 h-4" aria-hidden="true" />
            )}
            {isLoggedIn ? "Upgrade ke PRO" : "Mulai Gratis 7 Hari"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>

      {highlight && (
        <p className="text-center text-xs text-text-muted mt-3">
          Coba gratis 7 hari · Batalkan kapan saja
        </p>
      )}
    </motion.div>
  );
}

// Helper: load Midtrans Snap.js secara dinamis
function loadSnapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const script = document.createElement("script");
    script.src = snapUrl;
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal load Midtrans Snap"));
    document.head.appendChild(script);
  });
}
