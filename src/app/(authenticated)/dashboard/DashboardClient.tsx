"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Flame,
  Trophy,
  Target,
  Zap,
  Clock,
  Star,
  ArrowRight,
  Play,
  BarChart2,
} from "lucide-react";
import type { Profile } from "@/types";
import { cn, xpUntukLevel, relativeTime } from "@/lib/utils";
import { PrediksiPTNCard } from "@/components/dashboard/PrediksiPTNCard";
import { ReferralCard } from "@/components/dashboard/ReferralCard";

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD CLIENT — LIGHT MODE
   Clean, airy, premium light theme.
   
   Palette:
     bg:     #F8F6F2 (warm off-white)
     card:   #FFFFFF (pure white, soft shadow)
     accent: #4338CA (deep indigo)
   ═══════════════════════════════════════════════════════════════ */

// ── Design Tokens ─────────────────────────────────────────────
const C = {
  bg: "#F8F6F2",
  card: "#FFFFFF",
  accent: "#4338CA",
  accentLight: "#EEF2FF",
  accentMid: "#6366F1",
  text: "#1E1B4B",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  border: "#E8E5DF",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
  shadowHover: "0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
};

// ============================================================
// TYPES DATA PROPS
// ============================================================
interface DashboardClientProps {
  profile: Profile;
  recentSessions: Array<{
    waktuMulai: Date;
    soalBenar: number;
    soalSalah: number;
    soalSkip: number;
    xpEarned: number;
    durasiDetik: number | null;
    mapelId: number | null;
    mapel: { kode: string; nama: string; warna: string | null } | null;
  }>;
  earnedBadges: Array<{
    earnedAt: Date;
    badge: {
      id: number;
      kode: string;
      nama: string;
      icon: string | null;
      warna: string | null;
      xpReward: number;
    };
  }>;
  mapelList: Array<{
    id: number;
    kode: string;
    nama: string;
    icon: string | null;
    warna: string | null;
    _count: { topik: number };
  }>;
  stats: {
    totalSoalDikerjakan: number;
    totalSoalBenar: number;
    akurasi: number;
  };
}

export function DashboardClient({
  profile,
  recentSessions,
  earnedBadges,
  mapelList,
  stats,
}: DashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLevel = profile.level;
  const xpForNext = xpUntukLevel(currentLevel + 1);
  const xpForCurrent = xpUntukLevel(currentLevel);
  const xpProgress = Math.min(
    ((profile.xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100,
    100
  );

  // XP hari ini
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const xpHariIni = recentSessions
    .filter((s) => new Date(s.waktuMulai) >= today)
    .reduce((sum, s) => sum + s.xpEarned, 0);

  const sesiHariIni = recentSessions.filter(
    (s) => new Date(s.waktuMulai) >= today
  ).length;

  const greeting = () => {
    const jam = new Date().getHours();
    if (jam < 12) return "Selamat pagi";
    if (jam < 15) return "Selamat siang";
    if (jam < 18) return "Selamat sore";
    return "Selamat malam";
  };

  const STAT_CARDS = [
    {
      label: "Soal Dikerjakan",
      value: stats.totalSoalDikerjakan.toLocaleString("id"),
      icon: BookOpen,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      sub: `Hari ini: ${sesiHariIni} sesi`,
    },
    {
      label: "Akurasi",
      value: `${stats.akurasi}%`,
      icon: Target,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      sub: `${stats.totalSoalBenar} benar dari ${stats.totalSoalDikerjakan}`,
    },
    {
      label: "Streak Aktif",
      value: `${profile.streakCurrent} hari`,
      icon: Flame,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      sub: `Terpanjang: ${profile.streakLongest} hari`,
    },
    {
      label: "XP Hari Ini",
      value: `+${xpHariIni}`,
      icon: Zap,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      sub: `Total: ${profile.xp.toLocaleString("id")} XP`,
    },
  ];

  return (
    <>
      {/* ═══ Animation keyframes (self-contained, no framer-motion needed) ═══ */}
      <style jsx global>{`
        @keyframes dashSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes dashScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes dashFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .dash-slide { animation: dashSlideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .dash-scale { animation: dashScaleIn 0.45s cubic-bezier(.22,1,.36,1) both; }
        .dash-fade  { animation: dashFadeIn 0.5s ease-out both; }
        .dd0 { animation-delay: 0ms;   }
        .dd1 { animation-delay: 60ms;  }
        .dd2 { animation-delay: 120ms; }
        .dd3 { animation-delay: 180ms; }
        .dd4 { animation-delay: 240ms; }
        .dd5 { animation-delay: 300ms; }
        .dd6 { animation-delay: 360ms; }
        .dd7 { animation-delay: 420ms; }
        .dd8 { animation-delay: 480ms; }
        .dd9 { animation-delay: 540ms; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="min-h-screen pb-8"
        style={{
          backgroundColor: C.bg,
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        }}
      >
        {/* ═══════════════════════════════════════
            GREETING HEADER
            ═══════════════════════════════════════ */}
        <div className="px-4 sm:px-6 pt-6 max-w-3xl mx-auto">
          <section className={mounted ? "dash-slide dd0" : "opacity-0"}>
            {/* Top bar: streak + level badges */}
            <div className="flex items-center gap-2 mb-3">
              {profile.streakCurrent > 0 && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#FEF3C7", color: "#B45309" }}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {profile.streakCurrent} hari
                </div>
              )}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: C.accentLight, color: C.accent }}
              >
                <Zap className="w-3.5 h-3.5" />
                Lv.{currentLevel}
              </div>
            </div>

            <h1
              className="text-[22px] sm:text-[26px] font-extrabold leading-tight"
              style={{ color: C.text }}
            >
              {greeting()},{" "}
              <span style={{ color: C.accent }}>
                {profile.fullName?.split(" ")[0] ?? profile.username}
              </span>{" "}
              👋
            </h1>
            <p
              className="text-[14px] mt-1.5 leading-relaxed"
              style={{ color: C.textMuted }}
            >
              {profile.streakCurrent > 0
                ? `🔥 Streak ${profile.streakCurrent} hari! Jangan sampai putus ya!`
                : "Ayo mulai belajar hari ini dan bangun streak-mu!"}
            </p>
          </section>
        </div>

        {/* ═══ Main Content ═══ */}
        <main className="px-4 sm:px-6 pt-5 max-w-3xl mx-auto space-y-5">

          {/* ═══════════════════════════════════════
              CTA BUTTONS
              ═══════════════════════════════════════ */}
          <section className={`flex gap-3 ${mounted ? "dash-slide dd1" : "opacity-0"}`}>
            <Link
              href="/latihan"
              id="dashboard-quick-latihan"
              className="
                flex-1 flex items-center justify-center gap-2
                font-bold text-[15px] text-white
                py-3.5 rounded-xl
                transition-all duration-200
                hover:shadow-lg hover:-translate-y-0.5
                active:scale-[0.97]
              "
              style={{
                backgroundColor: C.accent,
                boxShadow: `0 4px 14px ${C.accent}30`,
                borderRadius: "12px",
              }}
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Mulai Latihan
            </Link>

            <Link
              href="/tryout"
              id="dashboard-quick-tryout"
              className="
                flex items-center justify-center gap-2
                font-bold text-[15px]
                px-6 py-3.5
                border-2
                transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                active:scale-[0.97]
              "
              style={{
                color: C.accent,
                borderColor: `${C.accent}30`,
                backgroundColor: C.card,
                borderRadius: "12px",
              }}
            >
              Tryout
            </Link>
          </section>

          {/* ═══════════════════════════════════════
              STAT CARDS — 2x2 Grid
              ═══════════════════════════════════════ */}
          <section className="grid grid-cols-2 gap-4" aria-label="Statistik">
            {STAT_CARDS.map((stat, i) => {
              const Icon = stat.icon;
              const isHovered = hoveredCard === i;
              return (
                <div
                  key={stat.label}
                  className={`
                    p-4 min-h-[140px]
                    flex flex-col justify-between
                    cursor-default
                    transition-all duration-200
                    ${mounted ? `dash-scale dd${i + 2}` : "opacity-0"}
                  `}
                  style={{
                    backgroundColor: C.card,
                    borderRadius: "16px",
                    border: `1px solid ${isHovered ? `${C.accent}20` : C.border}`,
                    boxShadow: isHovered ? C.shadowHover : C.shadow,
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.iconBg)}>
                    <Icon className={cn("w-5 h-5", stat.iconColor)} aria-hidden="true" />
                  </div>
                  <div className="text-[24px] font-extrabold leading-none tabular-nums" style={{ color: C.text }}>
                    {stat.value}
                  </div>
                  <div className="text-[13px] font-semibold mt-1" style={{ color: C.textMuted }}>
                    {stat.label}
                  </div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: C.textFaint }}>
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ═══════════════════════════════════════
              LEVEL & XP PROGRESS CARD
              ═══════════════════════════════════════ */}
          <section
            className={`relative overflow-hidden ${mounted ? "dash-slide dd6" : "opacity-0"}`}
            style={{
              backgroundColor: C.card,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              boxShadow: C.shadow,
            }}
            aria-label="Level Progress"
          >
            {/* Left accent gradient strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
              style={{ background: `linear-gradient(180deg, ${C.accent}, #8B5CF6, #A78BFA)` }}
            />

            <div className="p-5 pl-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.accentLight }}>
                    <Trophy className="w-5 h-5" style={{ color: C.accent }} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[16px] font-extrabold" style={{ color: C.text }}>
                      Level {currentLevel}
                    </div>
                    <div className="text-[12px] font-medium mt-0.5" style={{ color: C.textMuted }}>
                      {xpForNext - profile.xp} XP lagi untuk naik ke Level {currentLevel + 1}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[28px] font-extrabold tabular-nums" style={{ color: C.text }}>
                    {profile.xp.toLocaleString("id")}
                  </span>
                  <span className="text-[13px] font-semibold ml-1" style={{ color: C.textFaint }}>
                    XP
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "#F1F5F9" }}
                role="progressbar"
                aria-valuenow={Math.round(xpProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${Math.max(xpProgress, 2)}%` : "0%",
                    background: `linear-gradient(90deg, ${C.accent}, #6366F1, #8B5CF6)`,
                    boxShadow: xpProgress > 0 ? `0 0 10px ${C.accent}40` : "none",
                  }}
                />
              </div>

              <div className="flex justify-between mt-2 text-[11px] font-semibold" style={{ color: C.textFaint }}>
                <span>Level {currentLevel}</span>
                <span>Level {currentLevel + 1} ({xpForNext.toLocaleString("id")} XP)</span>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════
              MATA PELAJARAN — Horizontal Scroll
              ═══════════════════════════════════════ */}
          <section className={mounted ? "dash-slide dd7" : "opacity-0"}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[16px]" style={{ color: C.text }}>
                Pilih Mata Pelajaran
              </h2>
              <Link
                href="/latihan"
                className="text-[13px] font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: C.accent }}
              >
                Lihat semua
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scroll">
              {mapelList.slice(0, 8).map((mapel) => (
                <Link
                  key={mapel.id}
                  href={`/latihan?mapel=${mapel.kode}`}
                  id={`mapel-${mapel.kode.toLowerCase()}`}
                  className="
                    flex-shrink-0 snap-start
                    w-[110px] flex flex-col items-center
                    p-3.5
                    transition-all duration-200
                    hover:-translate-y-0.5
                    active:scale-[0.97]
                  "
                  style={{
                    backgroundColor: C.card,
                    borderRadius: "16px",
                    border: `1px solid ${C.border}`,
                    boxShadow: C.shadow,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[12px] font-bold mb-2 shadow-sm"
                    style={{ backgroundColor: mapel.warna ?? "#4F46E5" }}
                  >
                    {mapel.kode.slice(0, 3)}
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight line-clamp-2" style={{ color: C.text }}>
                    {mapel.nama}
                  </span>
                  <span className="text-[10px] mt-1" style={{ color: C.textFaint }}>
                    {mapel._count.topik} topik
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ═══════════════════════════════════════
              CONTENT GRID — Sessions + Badges
              ═══════════════════════════════════════ */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Sesi Terakhir */}
            <section
              className={mounted ? "dash-slide dd8" : "opacity-0"}
              style={{
                backgroundColor: C.card,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                boxShadow: C.shadow,
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="font-bold text-[15px] flex items-center gap-2" style={{ color: C.text }}>
                    <Clock className="w-4 h-4" style={{ color: C.accent }} aria-hidden="true" />
                    Sesi Terakhir
                  </h2>
                  <Link
                    href="/dashboard/analytics"
                    className="text-[12px] font-semibold flex items-center gap-1 hover:opacity-80"
                    style={{ color: C.accent }}
                  >
                    Semua
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>

                {recentSessions.length > 0 ? (
                  <div className="space-y-3">
                    {recentSessions.slice(0, 3).reverse().map((sesi, i) => {
                      const total = sesi.soalBenar + sesi.soalSalah + sesi.soalSkip;
                      const akurasi = total > 0 ? Math.round((sesi.soalBenar / total) * 100) : 0;
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: sesi.mapel?.warna ?? C.accent }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-semibold truncate" style={{ color: C.text }}>
                              {sesi.mapel?.nama ?? "Latihan"}
                            </div>
                            <div className="text-[12px]" style={{ color: C.textFaint }}>
                              {total} soal · {akurasi}% benar
                            </div>
                          </div>
                          <div className="text-[13px] font-bold flex-shrink-0" style={{ color: "#D97706" }}>
                            +{sesi.xpEarned} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BarChart2 className="w-8 h-8 mx-auto mb-2" style={{ color: C.border }} aria-hidden="true" />
                    <p className="text-[13px]" style={{ color: C.textFaint }}>
                      Belum ada sesi latihan.<br />Ayo mulai sekarang!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Badge Terbaru */}
            <section
              className={mounted ? "dash-slide dd9" : "opacity-0"}
              style={{
                backgroundColor: C.card,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                boxShadow: C.shadow,
              }}
            >
              <div className="p-4">
                <h2 className="font-bold text-[15px] flex items-center gap-2 mb-3.5" style={{ color: C.text }}>
                  <Star className="w-4 h-4" style={{ color: "#D97706" }} aria-hidden="true" />
                  Badge Terbaru
                </h2>

                {earnedBadges.length > 0 ? (
                  <div className="space-y-3">
                    {earnedBadges.map((ub) => (
                      <div key={ub.badge.id} className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: ub.badge.warna ?? C.accent }}
                        >
                          🏆
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate" style={{ color: C.text }}>
                            {ub.badge.nama}
                          </div>
                          <div className="text-[11px]" style={{ color: C.textFaint }}>
                            +{ub.badge.xpReward} XP · {relativeTime(ub.earnedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: C.border }} aria-hidden="true" />
                    <p className="text-[13px]" style={{ color: C.textFaint }}>
                      Belum ada badge.<br />Mulai belajar untuk meraihnya!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ═══════════════════════════════════════
              PREDIKSI PTN & REFERRAL
              ═══════════════════════════════════════ */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={mounted ? "dash-slide dd9" : "opacity-0"}>
              <PrediksiPTNCard />
            </div>
            <div className={mounted ? "dash-slide dd9" : "opacity-0"}>
              <ReferralCard />
            </div>
          </div>

          {/* ═══════════════════════════════════════
              TARGET / MOTIVASI
              ═══════════════════════════════════════ */}
          {(profile.targetUniversity || profile.targetMajor) && (
            <section
              className={`flex items-start gap-3 p-4 ${mounted ? "dash-slide dd9" : "opacity-0"}`}
              style={{
                backgroundColor: C.accentLight,
                borderRadius: "16px",
                border: `1px solid ${C.accent}15`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: C.accent }}
              >
                <Target className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold" style={{ color: C.accent }}>Targetmu</p>
                <p className="text-[15px] font-bold leading-tight" style={{ color: C.text }}>
                  {[profile.targetMajor, profile.targetUniversity]
                    .filter(Boolean)
                    .join(" — ")}
                </p>
                <p className="text-[12px] mt-1 leading-relaxed" style={{ color: C.textMuted }}>
                  Terus semangat! Setiap soal membawamu satu langkah lebih dekat. 💪
                </p>
              </div>
            </section>
          )}

        </main>
      </div>
    </>
  );
}
