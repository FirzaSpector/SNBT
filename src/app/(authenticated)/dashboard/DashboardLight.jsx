"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD LIGHT — SoalSNBT.id
   Clean, airy, premium light-mode dashboard.
   Single .jsx file — hardcoded dummy data, drop-in ready.
   
   Palette:
     bg:     #F8F6F2 (warm off-white)
     card:   #FFFFFF (pure white, soft shadow)
     accent: #4338CA (deep indigo)
     text:   #1E1B4B / #64748B / #94A3B8
   ═══════════════════════════════════════════════════════════════ */

// ── Design Tokens ─────────────────────────────────────────────
const C = {
  bg:         "#F8F6F2",
  card:       "#FFFFFF",
  accent:     "#4338CA",
  accentLight:"#EEF2FF",
  accentMid:  "#6366F1",
  text:       "#1E1B4B",
  textMuted:  "#64748B",
  textFaint:  "#94A3B8",
  border:     "#E8E5DF",
  shadow:     "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
  shadowHover:"0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  shadowXl:   "0 8px 30px rgba(67,56,202,0.12), 0 2px 8px rgba(0,0,0,0.06)",
};

// ── Dummy Data ────────────────────────────────────────────────
const USER = {
  name: "Firza",
  initials: "FS",
  level: 1,
  xp: 0,
  xpForNext: 400,
  streak: 0,
  longestStreak: 0,
};

const STATS = [
  {
    label: "Soal Dikerjakan",
    value: "0",
    sub: "Hari ini: 0 sesi",
    icon: BookIcon,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    label: "Akurasi",
    value: "0%",
    sub: "0 benar dari 0",
    icon: TargetIcon,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Streak Aktif",
    value: "0 hari",
    sub: "Terpanjang: 0 hari",
    icon: FlameIcon,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "XP Hari Ini",
    value: "+0",
    sub: "Total: 0 XP",
    icon: BoltIcon,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

// ── Greeting Helper ───────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export default function DashboardLight() {
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const xpProgress = USER.xpForNext > 0
    ? Math.min((USER.xp / USER.xpForNext) * 100, 100)
    : 0;

  return (
    <>
      {/* Google Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes progressFill {
          from { width: 0; }
        }
        .anim-slide { animation: slideUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .anim-fade  { animation: fadeIn 0.5s ease-out both; }
        .anim-scale { animation: scaleIn 0.45s cubic-bezier(.22,1,.36,1) both; }
        .d0  { animation-delay: 0ms;   }
        .d1  { animation-delay: 60ms;  }
        .d2  { animation-delay: 120ms; }
        .d3  { animation-delay: 180ms; }
        .d4  { animation-delay: 240ms; }
        .d5  { animation-delay: 300ms; }
        .d6  { animation-delay: 360ms; }
        .d7  { animation-delay: 420ms; }
        .d8  { animation-delay: 480ms; }
      `}</style>

      <div
        className="min-h-screen pb-8"
        style={{
          backgroundColor: C.bg,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ═══════════════════════════════════════════════════
            TOP NAV BAR — Two Avatar Circles
            ═══════════════════════════════════════════════════ */}
        <nav
          className={`
            sticky top-0 z-40 px-5 py-3
            flex items-center justify-between
            backdrop-blur-xl
            border-b
            ${mounted ? "anim-fade d0" : "opacity-0"}
          `}
          style={{
            backgroundColor: `${C.bg}E6`,
            borderColor: C.border,
          }}
        >
          {/* Brain icon circle */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: C.accent }}
            >
              <BrainIcon />
            </div>

            {/* User initials circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
              style={{
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: "#FFFFFF",
              }}
            >
              {USER.initials}
            </div>
          </div>

          {/* Right side — streak indicator (shown even if 0) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: USER.streak > 0 ? "#FEF3C7" : "#F1F5F9",
              color: USER.streak > 0 ? "#B45309" : C.textMuted,
            }}
          >
            <span className="text-sm">{USER.streak > 0 ? "🔥" : "💤"}</span>
            <span>{USER.streak > 0 ? `${USER.streak} hari` : "No streak"}</span>
          </div>
        </nav>

        {/* ═══ Main Content ═══ */}
        <main className="px-5 pt-6 max-w-lg mx-auto space-y-5">

          {/* ═══════════════════════════════════════════════════
              GREETING SECTION
              ═══════════════════════════════════════════════════ */}
          <section className={`${mounted ? "anim-slide d1" : "opacity-0"}`}>
            <h1
              className="text-[22px] font-extrabold leading-tight"
              style={{ color: C.text }}
            >
              {getGreeting()},{" "}
              <span style={{ color: C.accent }}>
                {USER.name}
              </span>{" "}
              👋
            </h1>
            <p
              className="text-[14px] mt-1.5 leading-relaxed"
              style={{ color: C.textMuted }}
            >
              {USER.streak > 0
                ? `🔥 Streak ${USER.streak} hari! Jangan sampai putus ya!`
                : "Ayo mulai belajar hari ini dan bangun streak-mu!"}
            </p>
          </section>

          {/* ═══════════════════════════════════════════════════
              CTA BUTTONS
              ═══════════════════════════════════════════════════ */}
          <section
            className={`flex gap-3 ${mounted ? "anim-slide d2" : "opacity-0"}`}
          >
            {/* Primary: Mulai Latihan */}
            <Link
              href="/latihan"
              id="cta-mulai-latihan"
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
              <PlayIcon />
              Mulai Latihan
            </Link>

            {/* Secondary: Tryout */}
            <Link
              href="/tryout"
              id="cta-tryout"
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

          {/* ═══════════════════════════════════════════════════
              STAT CARDS — 2x2 Grid
              ═══════════════════════════════════════════════════ */}
          <section className="grid grid-cols-2 gap-4" aria-label="Statistik">
            {STATS.map((stat, i) => {
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
                    ${mounted ? `anim-scale d${i + 3}` : "opacity-0"}
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
                  {/* Icon badge */}
                  <div
                    className={`
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      ${stat.iconBg}
                      mb-3
                    `}
                  >
                    <Icon className={stat.iconColor} />
                  </div>

                  {/* Value */}
                  <div
                    className="text-[24px] font-extrabold leading-none tabular-nums"
                    style={{ color: C.text }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div
                    className="text-[13px] font-semibold mt-1"
                    style={{ color: C.textMuted }}
                  >
                    {stat.label}
                  </div>

                  {/* Sub-info */}
                  <div
                    className="text-[11px] font-medium mt-0.5"
                    style={{ color: C.textFaint }}
                  >
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ═══════════════════════════════════════════════════
              LEVEL & XP PROGRESS CARD
              ═══════════════════════════════════════════════════ */}
          <section
            className={`
              relative overflow-hidden
              ${mounted ? "anim-slide d7" : "opacity-0"}
            `}
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
              style={{
                background: `linear-gradient(180deg, ${C.accent}, #8B5CF6, #A78BFA)`,
              }}
            />

            <div className="p-5 pl-6">
              {/* Top row: Trophy + Level label */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: C.accentLight }}
                  >
                    <TrophyIcon />
                  </div>
                  <div>
                    <div
                      className="text-[16px] font-extrabold"
                      style={{ color: C.text }}
                    >
                      Level {USER.level}
                    </div>
                    <div
                      className="text-[12px] font-medium mt-0.5 leading-tight"
                      style={{ color: C.textMuted }}
                    >
                      {USER.xpForNext - USER.xp} XP lagi untuk naik ke Level{" "}
                      {USER.level + 1}
                    </div>
                  </div>
                </div>

                {/* XP Badge */}
                <div className="text-right">
                  <span
                    className="text-[28px] font-extrabold tabular-nums"
                    style={{ color: C.text }}
                  >
                    {USER.xp}
                  </span>
                  <span
                    className="text-[13px] font-semibold ml-1"
                    style={{ color: C.textFaint }}
                  >
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
                aria-label={`XP progress: ${Math.round(xpProgress)}%`}
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

              {/* Bottom labels */}
              <div
                className="flex justify-between mt-2 text-[11px] font-semibold"
                style={{ color: C.textFaint }}
              >
                <span>Level {USER.level}</span>
                <span>
                  Level {USER.level + 1} ({USER.xpForNext.toLocaleString("id")}{" "}
                  XP)
                </span>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════
              MOTIVATIONAL NUDGE — Empty State
              ═══════════════════════════════════════════════════ */}
          <section
            className={`
              flex items-center gap-4 p-4
              ${mounted ? "anim-slide d8" : "opacity-0"}
            `}
            style={{
              backgroundColor: C.accentLight,
              borderRadius: "16px",
              border: `1px solid ${C.accent}15`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${C.accent}12` }}
            >
              <span className="text-2xl">🚀</span>
            </div>
            <div className="min-w-0">
              <p
                className="text-[13px] font-bold"
                style={{ color: C.text }}
              >
                Mulai perjalanan belajarmu!
              </p>
              <p
                className="text-[12px] mt-0.5 leading-relaxed"
                style={{ color: C.textMuted }}
              >
                Kerjakan soal pertamamu untuk mendapatkan XP dan membangun streak. 💪
              </p>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════
   INLINE SVG ICONS
   Clean, stroke-based, consistent 20x20 sizing
   ═══════════════════════════════════════════════════════════════ */

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.67 3 1.74 4.01L12 18l6.26-6.49A5.47 5.47 0 0 0 20 7.5 5.5 5.5 0 0 0 14.5 2 5.5 5.5 0 0 0 12 2.84 5.5 5.5 0 0 0 9.5 2Z" />
      <path d="M12 2.84V18" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

function TargetIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function FlameIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function BoltIcon({ className }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}
