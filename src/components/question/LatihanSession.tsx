"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import type { Soal, PilihanJawaban, SoalCBT } from "@/types";
import { QuestionRenderer } from "@/components/question/QuestionRenderer";
import { formatDurasi, cn } from "@/lib/utils";

interface LatihanSessionProps {
  sesiId: string;
  userId: string;
  soalList: Array<Soal & { pilihanJawaban: PilihanJawaban[] }>;
  mapelNama: string;
  isSimulasi?: boolean;         // Mode simulasi = ada batas waktu
  durasiMenitSimulasi?: number; // Durasi simulasi dalam menit
}

/**
 * Komponen utama sesi latihan CBT.
 * Mengelola state jawaban, navigasi soal, timer, dan submit.
 */
export function LatihanSession({
  sesiId,
  userId,
  soalList,
  mapelNama,
  isSimulasi = false,
  durasiMenitSimulasi = 90,
}: LatihanSessionProps) {
  const router = useRouter();

  const storageKey = `snbt_session_${sesiId}`;

  // State soal dengan status jawaban
  const [soalCBT, setSoalCBT] = useState<SoalCBT[]>(() => {
    // Attempt to load from localStorage first
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved session", e);
        }
      }
    }
    return soalList.map((soal, i) => ({
      ...soal,
      nomor: i + 1,
      status: "belum",
      jawabanDipilih: null,
      waktuMulaiDetik: null,
    }));
  });

  // Track if we need to auto-save to prevent saving the initial empty state over a loaded one before it's ready.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(soalCBT));
    }
  }, [soalCBT, storageKey]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [waktuMulaiSoal, setWaktuMulaiSoal] = useState<number>(Date.now());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Timer untuk simulasi
  const [sisaDetik, setSisaDetik] = useState(
    isSimulasi ? durasiMenitSimulasi * 60 : 0
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSoal = soalCBT[currentIndex];

  // ============================================================
  // TIMER COUNTDOWN (untuk mode simulasi)
  // ============================================================
  useEffect(() => {
    if (!isSimulasi || isSubmitted) return;

    timerRef.current = setInterval(() => {
      setSisaDetik((prev) => {
        if (prev <= 1) {
          // Waktu habis — auto submit
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulasi, isSubmitted]);

  // ============================================================
  // PILIH JAWABAN
  // ============================================================
  const handlePilih = useCallback(
    (label: string) => {
      if (isSubmitted) return;

      const waktuMenjawab = Math.round((Date.now() - waktuMulaiSoal) / 1000);

      setSoalCBT((prev) =>
        prev.map((s, i) =>
          i === currentIndex
            ? {
                ...s,
                jawabanDipilih: label,
                status: "dijawab",
                waktuMulaiDetik: waktuMenjawab,
              }
            : s
        )
      );
    },
    [currentIndex, isSubmitted, waktuMulaiSoal]
  );

  // ============================================================
  // NAVIGASI SOAL
  // ============================================================
  const navigateTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setWaktuMulaiSoal(Date.now());
  }, []);

  const handleNext = () => {
    if (currentIndex < soalCBT.length - 1) {
      navigateTo(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigateTo(currentIndex - 1);
    }
  };

  // ============================================================
  // TANDAI SOAL
  // ============================================================
  const handleTandai = useCallback(() => {
    setSoalCBT((prev) =>
      prev.map((s, i) =>
        i === currentIndex
          ? {
              ...s,
              status:
                s.status === "ditandai"
                  ? s.jawabanDipilih
                    ? "dijawab"
                    : "belum"
                  : "ditandai",
            }
          : s
      )
    );
  }, [currentIndex]);

  // ============================================================
  // BOOKMARK
  // ============================================================
  const handleBookmark = useCallback(() => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentSoal.id)) {
        newSet.delete(currentSoal.id);
      } else {
        newSet.add(currentSoal.id);
      }
      return newSet;
    });
  }, [currentSoal.id]);

  // ============================================================
  // SUBMIT SESI
  // ============================================================
  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmitting || isSubmitted) return;
      setIsSubmitting(true);
      setShowConfirmSubmit(false);

      if (timerRef.current) clearInterval(timerRef.current);

      try {
        const response = await fetch(`/api/latihan/${sesiId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jawaban: soalCBT.map((s) => ({
              soalId: s.id,
              jawabanDipilih: s.jawabanDipilih,
              waktuMenjawabDetik: s.waktuMulaiDetik,
              isBookmarked: bookmarkedIds.has(s.id),
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal submit jawaban");
        }

        const result = await response.json() as {
          xpEarned: number;
          soalBenar: number;
          soalSalah: number;
        };

        setIsSubmitted(true);

        if (!isAutoSubmit) {
          toast.success(
            `Sesi selesai! +${result.xpEarned} XP diraih 🎉`,
            { duration: 5000 }
          );
        } else {
          toast.warning("Waktu habis! Sesi otomatis diselesaikan.");
        }

        // Hapus auto-save dari local storage setelah berhasil disubmit
        if (typeof window !== "undefined") {
          localStorage.removeItem(storageKey);
        }

        // Redirect ke halaman hasil setelah 2 detik
        setTimeout(() => {
          router.push(`/latihan/${sesiId}/hasil`);
        }, 2000);
      } catch {
        toast.error("Gagal menyimpan jawaban. Coba lagi!");
        setIsSubmitting(false);
      }
    },
    [isSubmitting, isSubmitted, sesiId, soalCBT, bookmarkedIds, router]
  );

  // ============================================================
  // STATISTIK JAWABAN
  // ============================================================
  const statDijawab = soalCBT.filter(
    (s) => s.status === "dijawab" || (s.jawabanDipilih && s.status !== "belum")
  ).length;
  const statTandai = soalCBT.filter((s) => s.status === "ditandai").length;
  const statBelum = soalCBT.filter((s) => s.status === "belum").length;

  // Warna timer berubah jika waktu menipis
  const timerColor =
    isSimulasi && sisaDetik < 300
      ? "text-danger"
      : isSimulasi && sisaDetik < 600
      ? "text-accent"
      : "text-text-primary";

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ====== HEADER SESI ====== */}
      <header className="bg-white border-b border-border sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-700 text-base text-text-primary">
              {mapelNama}
            </h1>
            <p className="text-xs text-text-secondary">
              Soal {currentIndex + 1} dari {soalCBT.length}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats ringkas */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                {statDijawab} dijawab
              </span>
              <span className="flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                {statTandai} ditandai
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-border" aria-hidden="true" />
                {statBelum} belum
              </span>
            </div>

            {/* Timer simulasi */}
            {isSimulasi && (
              <div
                className={cn(
                  "flex items-center gap-1.5 font-heading font-700 text-base",
                  timerColor
                )}
                aria-live="polite"
                aria-label={`Sisa waktu: ${formatDurasi(sisaDetik)}`}
              >
                <Clock className="w-4 h-4" aria-hidden="true" />
                {formatDurasi(sisaDetik)}
              </div>
            )}

            {/* Tombol Selesai */}
            {!isSubmitted && (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
                id="btn-selesai"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                Selesai
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ====== MAIN CONTENT ====== */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid lg:grid-cols-[1fr_280px] gap-6">

        {/* Konten Soal */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <QuestionRenderer
              key={currentSoal.id}
              soal={{
                ...currentSoal,
                pilihanJawaban: currentSoal.pilihanJawaban ?? [],
              }}
              nomor={currentIndex + 1}
              jawabanDipilih={currentSoal.jawabanDipilih}
              isSubmitted={isSubmitted}
              isBookmarked={bookmarkedIds.has(currentSoal.id)}
              onPilih={handlePilih}
              onBookmark={handleBookmark}
              onTandai={handleTandai}
              isTandai={currentSoal.status === "ditandai"}
            />
          </AnimatePresence>

          {/* Navigasi Prev/Next */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-all text-sm font-medium"
              aria-label="Soal sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Sebelumnya
            </button>

            <span className="text-sm text-text-muted">
              {currentIndex + 1} / {soalCBT.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === soalCBT.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-40 disabled:pointer-events-none transition-all text-sm font-medium"
              aria-label="Soal berikutnya"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panel Navigasi Soal (Sidebar) */}
        <aside className="hidden lg:block">
          <div className="card p-4 sticky top-24">
            <h2 className="font-heading font-700 text-sm text-text-primary mb-3">
              Navigasi Soal
            </h2>

            {/* Grid nomor soal */}
            <div
              className="grid grid-cols-5 gap-1.5 mb-4"
              role="navigation"
              aria-label="Daftar nomor soal"
            >
              {soalCBT.map((s, i) => {
                const isCurrent = i === currentIndex;
                let bgColor = "bg-surface text-text-muted border-border";

                if (isCurrent) bgColor = "bg-primary text-white border-primary";
                else if (s.status === "ditandai") bgColor = "bg-accent-light text-accent border-accent/30";
                else if (s.jawabanDipilih) bgColor = "bg-success-light text-success border-success/30";

                return (
                  <button
                    key={s.id}
                    onClick={() => navigateTo(i)}
                    className={cn(
                      "h-9 rounded-lg border text-xs font-semibold transition-all duration-150 hover:scale-105",
                      bgColor
                    )}
                    aria-label={`Soal ${i + 1}${s.jawabanDipilih ? " (sudah dijawab)" : ""}${s.status === "ditandai" ? " (ditandai)" : ""}`}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              {[
                { color: "bg-primary", label: "Soal aktif" },
                { color: "bg-success-light border border-success/30", label: "Sudah dijawab" },
                { color: "bg-accent-light border border-accent/30", label: "Ditandai" },
                { color: "bg-surface border border-border", label: "Belum dijawab" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={cn("w-4 h-4 rounded", color)} aria-hidden="true" />
                  <span className="text-text-secondary">{label}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Dijawab", val: statDijawab, color: "text-success" },
                { label: "Ditandai", val: statTandai, color: "text-accent" },
                { label: "Belum", val: statBelum, color: "text-text-muted" },
              ].map(({ label, val, color }) => (
                <div key={label}>
                  <div className={cn("font-heading font-700 text-lg", color)}>{val}</div>
                  <div className="text-xs text-text-muted">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ====== MODAL KONFIRMASI SUBMIT ====== */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-submit-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            >
              <h3
                id="confirm-submit-title"
                className="font-heading font-700 text-xl text-text-primary mb-2"
              >
                Yakin ingin selesai?
              </h3>

              <div className="space-y-2 mb-6 p-4 bg-surface rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Sudah dijawab</span>
                  <span className="font-semibold text-success">{statDijawab} soal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Ditandai</span>
                  <span className="font-semibold text-accent">{statTandai} soal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Belum dijawab</span>
                  <span className="font-semibold text-danger">{statBelum} soal</span>
                </div>
              </div>

              {statBelum > 0 && (
                <div className="flex items-start gap-2 bg-danger-light text-danger text-sm p-3 rounded-lg mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Masih ada {statBelum} soal yang belum dijawab. Soal yang tidak dijawab akan dianggap salah.</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary hover:bg-surface transition-colors font-medium"
                >
                  Kembali
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
                  id="confirm-submit-btn"
                >
                  {isSubmitting ? "Menyimpan..." : "Ya, Selesai"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
