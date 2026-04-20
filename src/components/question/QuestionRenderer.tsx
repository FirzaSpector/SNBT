"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, XCircle, BookOpen, Flag, Bookmark } from "lucide-react";
import type { Soal, PilihanJawaban } from "@/types";
import { MathRenderer } from "./MathRenderer";
import { cn } from "@/lib/utils";

// ============================================================
// DIFFICULTY BADGE
// ============================================================
const DIFFICULTY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: "Mudah", color: "bg-success-light text-success" },
  2: { label: "Sedang", color: "bg-accent-light text-accent" },
  3: { label: "Menengah", color: "bg-orange-100 text-orange-600" },
  4: { label: "Sulit", color: "bg-danger-light text-danger" },
  5: { label: "HOTS", color: "bg-purple-100 text-purple-600" },
};

interface QuestionRendererProps {
  soal: Soal & { pilihanJawaban: PilihanJawaban[] };
  nomor: number;
  jawabanDipilih: string | null;
  isSubmitted: boolean;        // Apakah sesi sudah selesai (tampilkan jawaban benar)
  isBookmarked: boolean;
  onPilih: (label: string) => void;
  onBookmark: () => void;
  onTandai?: () => void;       // Tandai soal untuk review nanti
  isTandai?: boolean;
}

// Label pilihan jawaban
const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

export function QuestionRenderer({
  soal,
  nomor,
  jawabanDipilih,
  isSubmitted,
  isBookmarked,
  onPilih,
  onBookmark,
  onTandai,
  isTandai = false,
}: QuestionRendererProps) {
  const diff = DIFFICULTY_CONFIG[soal.tingkatKesulitan] ?? DIFFICULTY_CONFIG[3];

  // Tentukan styling pilihan jawaban berdasarkan state
  const getPilihanClass = (pilihan: PilihanJawaban): string => {
    const isDipilih = jawabanDipilih === pilihan.label;

    if (!isSubmitted) {
      // Sebelum submit: hanya tampilkan selected state
      return isDipilih
        ? "dipilih border-primary bg-primary-light"
        : "border-border bg-white hover:border-primary hover:bg-primary-light";
    }

    // Setelah submit: tampilkan benar/salah
    if (pilihan.isCorrect) {
      return "jawaban-benar border-success bg-success-light";
    }
    if (isDipilih && !pilihan.isCorrect) {
      return "jawaban-salah border-danger bg-danger-light";
    }
    return "border-border bg-white opacity-60";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="card p-6 sm:p-8"
    >
      {/* ====== HEADER SOAL ====== */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Nomor soal */}
          <div
            className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-heading font-700 text-sm flex-shrink-0"
            aria-label={`Soal nomor ${nomor}`}
          >
            {nomor}
          </div>

          {/* Topik & Kesulitan */}
          <div className="flex items-center gap-2 flex-wrap">
            {soal.topik && (
              <span className="text-xs font-medium text-text-secondary bg-surface px-2.5 py-1 rounded-full border border-border">
                {soal.topik.nama}
              </span>
            )}
            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", diff.color)}>
              {diff.label}
            </span>
            {soal.isPremium && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-light text-accent border border-accent/20">
                ⭐ PRO
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Tandai untuk review */}
          {onTandai && (
            <button
              onClick={onTandai}
              className={cn(
                "p-2 rounded-lg transition-all duration-150",
                isTandai
                  ? "bg-accent-light text-accent"
                  : "text-text-muted hover:bg-surface hover:text-accent"
              )}
              aria-label={isTandai ? "Hapus tanda" : "Tandai soal untuk review"}
              aria-pressed={isTandai}
            >
              <Flag className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {/* Bookmark */}
          <button
            onClick={onBookmark}
            className={cn(
              "p-2 rounded-lg transition-all duration-150",
              isBookmarked
                ? "bg-primary-light text-primary"
                : "text-text-muted hover:bg-surface hover:text-primary"
            )}
            aria-label={isBookmarked ? "Hapus bookmark" : "Simpan soal"}
            aria-pressed={isBookmarked}
          >
            <Bookmark
              className={cn("w-4 h-4", isBookmarked && "fill-primary")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* ====== KONTEN SOAL ====== */}
      <div className="mb-6">
        <MathRenderer
          content={soal.konten}
          className="text-text-primary text-base leading-relaxed"
        />

        {/* Gambar soal (jika ada) */}
        {soal.gambarUrl && (
          <div className="mt-4 rounded-xl overflow-hidden border border-border">
            <Image
              src={soal.gambarUrl}
              alt="Gambar pendukung soal"
              width={600}
              height={400}
              className="w-full object-contain max-h-64"
            />
          </div>
        )}
      </div>

      {/* ====== PILIHAN JAWABAN ====== */}
      <div
        className="space-y-3"
        role="radiogroup"
        aria-label={`Pilihan jawaban soal nomor ${nomor}`}
      >
        {soal.pilihanJawaban
          .sort((a, b) => a.urutan - b.urutan)
          .map((pilihan) => {
            const isDipilih = jawabanDipilih === pilihan.label;
            const isBenar = isSubmitted && pilihan.isCorrect;
            const isSalah = isSubmitted && isDipilih && !pilihan.isCorrect;

            return (
              <motion.button
                key={pilihan.id}
                onClick={() => !isSubmitted && onPilih(pilihan.label)}
                disabled={isSubmitted}
                whileHover={!isSubmitted ? { scale: 1.005 } : {}}
                whileTap={!isSubmitted ? { scale: 0.998 } : {}}
                className={cn(
                  "pilihan-jawaban w-full text-left flex items-start gap-4 group",
                  getPilihanClass(pilihan),
                  isSubmitted && "cursor-default"
                )}
                role="radio"
                aria-checked={isDipilih}
                aria-label={`Pilihan ${pilihan.label}: ${pilihan.konten.replace(/<[^>]*>/g, "")}`}
                id={`pilihan-${pilihan.id}`}
              >
                {/* Label Huruf */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center font-heading font-700 text-sm flex-shrink-0 transition-all",
                    isDipilih && !isSubmitted
                      ? "bg-primary text-white"
                      : isBenar
                      ? "bg-success text-white"
                      : isSalah
                      ? "bg-danger text-white"
                      : "bg-border text-text-secondary group-hover:bg-primary group-hover:text-white"
                  )}
                  aria-hidden="true"
                >
                  {pilihan.label}
                </div>

                {/* Konten Pilihan */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <MathRenderer content={pilihan.konten} className="text-sm" />
                </div>

                {/* Icon benar/salah setelah submit */}
                <AnimatePresence>
                  {isSubmitted && (isBenar || isSalah) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {isBenar ? (
                        <CheckCircle
                          className="w-5 h-5 text-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircle
                          className="w-5 h-5 text-danger"
                          aria-hidden="true"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
      </div>

      {/* ====== PEMBAHASAN (tampil setelah submit) ====== */}
      <AnimatePresence>
        {isSubmitted && soal.pembahasan && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-6 overflow-hidden"
          >
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                <h3 className="font-heading font-700 text-base text-text-primary">
                  Pembahasan
                </h3>
              </div>

              {/* Poin penting */}
              {soal.pembahasan.poinPenting.length > 0 && (
                <div className="bg-primary-light rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                    Poin Kunci
                  </p>
                  <ul className="space-y-1.5">
                    {soal.pembahasan.poinPenting.map((poin, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                        <span className="text-primary font-bold flex-shrink-0">•</span>
                        <MathRenderer content={poin} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Pembahasan lengkap */}
              <MathRenderer
                content={soal.pembahasan.kontenTeks}
                className="text-text-secondary text-sm leading-relaxed"
              />

              {/* Rumus terkait */}
              {soal.pembahasan.rumusTerkait.length > 0 && (
                <div className="mt-4 bg-surface rounded-xl p-4 border border-border">
                  <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wide">
                    Rumus yang Digunakan
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {soal.pembahasan.rumusTerkait.map((rumus, i) => (
                      <div
                        key={i}
                        className="bg-white border border-border rounded-lg px-3 py-1.5"
                      >
                        <MathRenderer content={`$${rumus}$`} className="text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
