"use client";

import { useState, useEffect } from "react";
import { Target, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import type { PrediksiKelulusan } from "@/types";

/**
 * Dashboard widget showing PTN passing prediction.
 * Color-coded gauge: 🟢 Aman (>70%), 🟡 Berjuang (40-70%), 🔴 Sulit (<40%)
 */
export function PrediksiPTNCard() {
  const [prediksi, setPrediksi] = useState<PrediksiKelulusan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prediksi-ptn")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setPrediksi(result.data);
        } else if (result.message) {
          setError(result.message);
        }
      })
      .catch(() => setError("Gagal memuat prediksi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-surface rounded w-1/3 mb-4" />
        <div className="h-8 bg-surface rounded w-2/3 mb-2" />
        <div className="h-3 bg-surface rounded w-1/2" />
      </div>
    );
  }

  if (error || !prediksi) {
    return (
      <div className="card p-6 border-l-4 border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-surface">
            <Target className="w-5 h-5 text-text-muted" />
          </div>
          <h3 className="font-heading font-700 text-text-primary">Prediksi Kelulusan PTN</h3>
        </div>
        <p className="text-sm text-text-secondary">
          {error || "Tambahkan target program studi di profil untuk melihat prediksi."}
        </p>
      </div>
    );
  }

  const colorMap = {
    green: { bg: "bg-emerald-50", border: "border-emerald-500", text: "text-emerald-700", bar: "bg-emerald-500", label: "Aman" },
    yellow: { bg: "bg-amber-50", border: "border-amber-500", text: "text-amber-700", bar: "bg-amber-500", label: "Berjuang" },
    red: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", bar: "bg-red-500", label: "Sulit" },
  };

  const colors = colorMap[prediksi.color];

  return (
    <div className={`card p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Target className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div>
            <h3 className="font-heading font-700 text-text-primary">Prediksi Kelulusan</h3>
            <p className="text-xs text-text-muted">{prediksi.univSingkatan} — {prediksi.prodiNama}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
          {prediksi.status === "aman" && <TrendingUp className="w-3 h-3 inline mr-1" />}
          {prediksi.status === "berjuang" && <Minus className="w-3 h-3 inline mr-1" />}
          {prediksi.status === "sulit" && <TrendingDown className="w-3 h-3 inline mr-1" />}
          {colors.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-muted">Skor kamu: {prediksi.userIrtScore}</span>
          <span className="text-text-muted">Passing Grade: {prediksi.passingGrade}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${Math.min(100, prediksi.percentage)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={`font-bold ${colors.text}`}>{prediksi.percentage}%</span>
          <span className="text-text-muted">Daya tampung: {prediksi.dayaTampung} kursi</span>
        </div>
      </div>

      <p className="text-xs text-text-secondary">
        {prediksi.status === "aman" && "Terus pertahankan! Skor kamu sudah di atas rata-rata passing grade."}
        {prediksi.status === "berjuang" && "Masih ada peluang! Tingkatkan lagi skor kamu dengan latihan rutin."}
        {prediksi.status === "sulit" && "Jangan menyerah! Fokus latihan di topik yang lemah untuk menaikkan skor."}
      </p>
    </div>
  );
}
