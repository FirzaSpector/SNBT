"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD MOBILE — SoalSNBT.id
   Single-file, self-contained, hardcoded dummy data.
   Mobile-first Tailwind (base = mobile, sm:/md: = larger)
   Dark cards (#1a1f2e) + purple/violet accent
   ═══════════════════════════════════════════════════════════════ */

// ── Dummy Data ─────────────────────────────────────────────────
const USER = {
  name: "Aqila",
  username: "aqila_nf",
  avatarUrl: null,
  level: 12,
  xp: 14_350,
  xpForCurrentLevel: 14_400, // level 12 threshold
  xpForNextLevel: 16_900,    // level 13 threshold
  streak: 7,
  longestStreak: 14,
  rank: 24,
  tier: "pro",
  targetUniversity: "Universitas Indonesia",
  targetMajor: "Kedokteran",
};

const STATS = [
  {
    label: "Soal Dikerjakan",
    value: "1.247",
    sub: "Hari ini: 3 sesi",
    icon: "📝",
    accent: "from-violet-500/20 to-purple-500/10",
    iconBg: "bg-violet-500/20",
    valueColor: "text-violet-400",
  },
  {
    label: "Akurasi",
    value: "78%",
    sub: "974 benar dari 1.247",
    icon: "🎯",
    accent: "from-emerald-500/20 to-green-500/10",
    iconBg: "bg-emerald-500/20",
    valueColor: "text-emerald-400",
  },
  {
    label: "Streak Aktif",
    value: "7 hari",
    sub: "Terpanjang: 14 hari",
    icon: "🔥",
    accent: "from-amber-500/20 to-orange-500/10",
    iconBg: "bg-amber-500/20",
    valueColor: "text-amber-400",
  },
  {
    label: "XP Hari Ini",
    value: "+250",
    sub: "Total: 14.350 XP",
    icon: "⚡",
    accent: "from-purple-500/20 to-indigo-500/10",
    iconBg: "bg-purple-500/20",
    valueColor: "text-purple-400",
  },
];

const SUBJECTS = [
  { kode: "PU", nama: "Penalaran Umum", warna: "#7c3aed", topik: 12 },
  { kode: "PPU", nama: "Pengetahuan Umum", warna: "#2563eb", topik: 8 },
  { kode: "PBM", nama: "Pemahaman Bacaan", warna: "#059669", topik: 10 },
  { kode: "PK", nama: "Penalaran Kuantitatif", warna: "#d97706", topik: 9 },
  { kode: "LBI", nama: "Literasi B. Indonesia", warna: "#dc2626", topik: 7 },
  { kode: "LBE", nama: "Literasi B. Inggris", warna: "#0891b2", topik: 6 },
];

const RECENT_SESSIONS = [
  { mapel: "Penalaran Umum", warna: "#7c3aed", soal: 20, akurasi: 85, xp: 120, waktu: "2 jam lalu" },
  { mapel: "Penalaran Kuantitatif", warna: "#d97706", soal: 15, akurasi: 73, xp: 85, waktu: "5 jam lalu" },
  { mapel: "Literasi B. Indonesia", warna: "#dc2626", soal: 10, akurasi: 90, xp: 95, waktu: "Kemarin" },
];

const BADGES = [
  { nama: "Speed Demon", icon: "⚡", warna: "#7c3aed", xp: 100, waktu: "2 jam lalu" },
  { nama: "Perfect Score", icon: "💎", warna: "#059669", xp: 200, waktu: "Kemarin" },
  { nama: "7-Day Streak", icon: "🔥", warna: "#d97706", xp: 150, waktu: "2 hari lalu" },
];

const BOTTOM_NAV = [
  { href: "/dashboard", label: "Home", icon: HomeIcon, active: true },
  { href: "/latihan", label: "Latihan", icon: BookIcon, active: false },
  { href: "/tryout", label: "Tryout", icon: ClipboardIcon, active: false },
  { href: "/leaderboard", label: "Ranking", icon: TrophyIcon, active: false },
  { href: "/profil", label: "Profil", icon: UserIcon, active: false },
];

// ── Greeting Helper ────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

// ── Main Component ─────────────────────────────────────────────
export default function DashboardMobile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const xpProgress = Math.min(
    ((USER.xp - USER.xpForCurrentLevel) / (USER.xpForNextLevel - USER.xpForCurrentLevel)) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-[#0f1219] pb-24 font-['Inter',sans-serif]">

      {/* ═══ Inline Keyframes (self-contained) ═══ */}
      <style jsx global>{`
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes xpFill {
          from { width: 0%; }
          to   { width: var(--xp-target); }
        }
        @keyframes shimmerGlow {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0;  }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(124,58,237,0); }
        }
        @keyframes streakBounce {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }
        .anim-card  { animation: cardSlideUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .anim-fade  { animation: fadeIn 0.4s ease-out both; }
        .anim-pulse { animation: pulseRing 2.5s infinite; }
        .anim-streak { animation: streakBounce 2s ease-in-out infinite; }
        .delay-0  { animation-delay: 0ms;   }
        .delay-1  { animation-delay: 80ms;  }
        .delay-2  { animation-delay: 160ms; }
        .delay-3  { animation-delay: 240ms; }
        .delay-4  { animation-delay: 320ms; }
        .delay-5  { animation-delay: 400ms; }
        .delay-6  { animation-delay: 480ms; }
        .delay-7  { animation-delay: 560ms; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          HEADER — Avatar, Greeting, Streak
          ═══════════════════════════════════════════════════════ */}
      <header
        className={`
          sticky top-0 z-40
          bg-[#0f1219]/80 backdrop-blur-xl
          border-b border-white/[0.06]
          px-4 py-3
          transition-all duration-300
          ${mounted ? "anim-fade delay-0" : "opacity-0"}
        `}
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Left: Avatar + Text */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-violet-500/25">
                {USER.avatarUrl ? (
                  <img src={USER.avatarUrl} alt={USER.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  USER.name.charAt(0).toUpperCase()
                )}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0f1219]" />
            </div>

            {/* Greeting */}
            <div className="min-w-0">
              <p className="text-[13px] text-gray-400 leading-tight">{getGreeting()}</p>
              <h1 className="text-[17px] font-bold text-white truncate leading-snug">
                {USER.name} 👋
              </h1>
            </div>
          </div>

          {/* Right: Streak Badge + Level Badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Streak */}
            {USER.streak > 0 && (
              <div className="anim-streak flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1.5 rounded-full">
                <span className="text-sm">🔥</span>
                <span>{USER.streak}</span>
              </div>
            )}

            {/* Level */}
            <div className="anim-pulse flex items-center gap-1 bg-violet-500/15 border border-violet-500/30 text-violet-400 text-xs font-bold px-2.5 py-1.5 rounded-full">
              <span className="text-sm">⚡</span>
              <span>Lv.{USER.level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="px-4 pt-5 max-w-lg mx-auto space-y-5">

        {/* ═══════════════════════════════════════════════════
            XP PROGRESS BAR — Full Width
            ═══════════════════════════════════════════════════ */}
        <section
          className={`
            rounded-2xl overflow-hidden
            bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700
            p-4 relative
            ${mounted ? "anim-card delay-0" : "opacity-0"}
          `}
          aria-label="XP Progress"
        >
          {/* Decorative orb */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.07] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10">
            {/* Top row: Level label + XP count */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span className="font-bold text-white text-[15px]">Level {USER.level}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-white text-xl tabular-nums tracking-tight">
                  {USER.xp.toLocaleString("id")}
                </span>
                <span className="text-white/60 text-[13px] ml-1">XP</span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="w-full h-3 bg-white/20 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(xpProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`XP progress: ${Math.round(xpProgress)}%`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000 ease-out"
                style={{
                  width: mounted ? `${xpProgress}%` : "0%",
                  boxShadow: "0 0 12px rgba(251,191,36,0.4)",
                }}
              />
            </div>

            {/* Bottom row: Level labels */}
            <div className="flex justify-between mt-1.5 text-[12px] text-white/50">
              <span>Level {USER.level}</span>
              <span>{(USER.xpForNextLevel - USER.xp).toLocaleString("id")} XP lagi</span>
              <span>Level {USER.level + 1}</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            STAT CARDS — 2-Column Grid
            ═══════════════════════════════════════════════════ */}
        <section aria-label="Statistik" className="grid grid-cols-2 gap-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`
                bg-[#1a1f2e] rounded-2xl p-4
                border border-white/[0.06]
                min-h-[120px] flex flex-col justify-between
                hover:border-white/[0.12] transition-colors duration-200
                ${mounted ? `anim-card delay-${i + 1}` : "opacity-0"}
              `}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${stat.accent} mb-2.5`}>
                {stat.icon}
              </div>
              {/* Value */}
              <div className={`font-extrabold text-[22px] leading-tight tabular-nums ${stat.valueColor}`}>
                {stat.value}
              </div>
              {/* Label */}
              <div className="text-[13px] font-medium text-gray-400 mt-0.5 leading-tight">
                {stat.label}
              </div>
              {/* Sub */}
              <div className="text-[11px] text-gray-500 mt-1 leading-tight">
                {stat.sub}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════════════════════════════════════════════
            QUICK ACTIONS — CTA Buttons
            ═══════════════════════════════════════════════════ */}
        <section
          className={`
            flex gap-3
            ${mounted ? "anim-card delay-5" : "opacity-0"}
          `}
          aria-label="Aksi Cepat"
        >
          <Link
            href="/latihan"
            id="cta-mulai-latihan"
            className="
              flex-1 flex items-center justify-center gap-2
              bg-gradient-to-r from-violet-600 to-purple-600
              text-white font-bold text-[15px]
              py-3.5 rounded-2xl
              shadow-lg shadow-violet-600/25
              hover:shadow-violet-600/40
              active:scale-[0.97]
              transition-all duration-200
            "
          >
            <PlayIcon />
            Mulai Latihan
          </Link>
          <Link
            href="/tryout"
            id="cta-tryout"
            className="
              flex-1 flex items-center justify-center gap-2
              bg-[#1a1f2e] border border-violet-500/30
              text-violet-400 font-bold text-[15px]
              py-3.5 rounded-2xl
              hover:border-violet-500/50 hover:bg-violet-500/10
              active:scale-[0.97]
              transition-all duration-200
            "
          >
            <ClipboardIcon />
            Tryout
          </Link>
        </section>

        {/* ═══════════════════════════════════════════════════
            MATA PELAJARAN — Horizontal Scroll
            ═══════════════════════════════════════════════════ */}
        <section
          className={`${mounted ? "anim-card delay-5" : "opacity-0"}`}
          aria-label="Mata Pelajaran"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white text-[16px]">Mata Pelajaran</h2>
            <Link href="/latihan" className="text-[13px] text-violet-400 font-semibold hover:text-violet-300 flex items-center gap-1 transition-colors">
              Semua
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
            {SUBJECTS.map((s, i) => (
              <Link
                key={s.kode}
                href={`/latihan?mapel=${s.kode}`}
                id={`mapel-${s.kode.toLowerCase()}`}
                className={`
                  flex-shrink-0 snap-start
                  w-[120px] flex flex-col items-center
                  bg-[#1a1f2e] rounded-2xl p-3.5
                  border border-white/[0.06]
                  hover:border-white/[0.12]
                  active:scale-[0.97]
                  transition-all duration-200
                  ${mounted ? `anim-card delay-${Math.min(i + 3, 7)}` : "opacity-0"}
                `}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[13px] font-bold mb-2 shadow-md"
                  style={{ backgroundColor: s.warna }}
                >
                  {s.kode}
                </div>
                <span className="text-[12px] font-semibold text-gray-300 text-center leading-tight line-clamp-2">
                  {s.nama}
                </span>
                <span className="text-[11px] text-gray-500 mt-1">
                  {s.topik} topik
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SESI TERAKHIR — Recent Activity
            ═══════════════════════════════════════════════════ */}
        <section
          className={`
            bg-[#1a1f2e] rounded-2xl p-4
            border border-white/[0.06]
            ${mounted ? "anim-card delay-6" : "opacity-0"}
          `}
          aria-label="Sesi Terakhir"
        >
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-bold text-white text-[15px] flex items-center gap-2">
              <span className="text-base">🕒</span>
              Sesi Terakhir
            </h2>
            <Link href="/dashboard/analytics" className="text-[12px] text-violet-400 font-semibold hover:text-violet-300 flex items-center gap-1 transition-colors">
              Semua
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_SESSIONS.map((sesi, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Color dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: sesi.warna, boxShadow: `0 0 8px ${sesi.warna}40` }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-gray-200 truncate">
                    {sesi.mapel}
                  </div>
                  <div className="text-[12px] text-gray-500">
                    {sesi.soal} soal · {sesi.akurasi}% benar · {sesi.waktu}
                  </div>
                </div>

                {/* XP */}
                <div className="text-[13px] font-bold text-amber-400 flex-shrink-0">
                  +{sesi.xp} XP
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            BADGE TERBARU
            ═══════════════════════════════════════════════════ */}
        <section
          className={`
            bg-[#1a1f2e] rounded-2xl p-4
            border border-white/[0.06]
            ${mounted ? "anim-card delay-7" : "opacity-0"}
          `}
          aria-label="Badge Terbaru"
        >
          <h2 className="font-bold text-white text-[15px] flex items-center gap-2 mb-3.5">
            <span className="text-base">⭐</span>
            Badge Terbaru
          </h2>

          <div className="space-y-3">
            {BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${badge.warna}22` }}
                >
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-gray-200">{badge.nama}</div>
                  <div className="text-[12px] text-gray-500">
                    +{badge.xp} XP · {badge.waktu}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            TARGET / MOTIVASI CARD
            ═══════════════════════════════════════════════════ */}
        {(USER.targetUniversity || USER.targetMajor) && (
          <section
            className={`
              bg-gradient-to-br from-violet-600/10 to-purple-600/5
              border border-violet-500/20 rounded-2xl p-4
              ${mounted ? "anim-card delay-7" : "opacity-0"}
            `}
            aria-label="Target PTN"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/30">
                <span className="text-lg">🎯</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-violet-400 mb-0.5">Targetmu</p>
                <p className="text-[15px] font-bold text-white leading-tight">
                  {[USER.targetMajor, USER.targetUniversity].filter(Boolean).join(" — ")}
                </p>
                <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">
                  Terus semangat! Setiap soal membawamu satu langkah lebih dekat. 💪
                </p>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM NAV — Fixed + Safe Area Padding
          ═══════════════════════════════════════════════════════ */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-[#0f1219]/95 backdrop-blur-xl
          border-t border-white/[0.08]
        "
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Bottom navigation"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {BOTTOM_NAV.map(({ href, label, icon: Icon, active }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-0.5
                py-1.5 px-3 rounded-xl
                transition-all duration-200
                min-w-[56px]
                ${active
                  ? "text-violet-400"
                  : "text-gray-500 hover:text-gray-300 active:text-gray-200"
                }
              `}
              aria-current={active ? "page" : undefined}
            >
              <div className={`relative ${active ? "" : ""}`}>
                <Icon active={active} />
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                )}
              </div>
              <span className={`text-[11px] font-semibold leading-tight ${active ? "text-violet-400" : ""}`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   INLINE SVG ICON COMPONENTS
   Keep icon sizes consistent: w-5 h-5 for bottom nav
   ═══════════════════════════════════════════════════════════════ */

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BookIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ClipboardIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function TrophyIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function UserIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
