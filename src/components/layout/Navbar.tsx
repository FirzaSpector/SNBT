"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  Trophy,
  User,
  LogOut,
  ChevronDown,
  Flame,
  Star,
  Settings,
  Menu,
  X,
  Brain,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { cn, getInitials, hitungLevel, xpUntukLevel } from "@/lib/utils";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  profile: Profile | null;
}

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/latihan", label: "Latihan", icon: BookOpen },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/tryout", label: "Tryout", icon: ClipboardList },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Deteksi scroll untuk efek blur navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-profile-menu]")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Kalkulasi XP progress ke level berikutnya
  const currentXP = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const xpForNext = xpUntukLevel(currentLevel + 1);
  const xpForCurrent = xpUntukLevel(currentLevel);
  const xpProgress = Math.min(
    ((currentXP - xpForCurrent) / (xpForNext - xpForCurrent)) * 100,
    100
  );

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass border-b border-white/20 shadow-md"
            : "bg-white/95 border-b border-border"
        )}
        style={{ height: "var(--nav-height)" }}
        role="navigation"
        aria-label="Navigasi utama"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="SoalSNBT.id - Halaman Utama"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-800 text-lg text-primary hidden sm:block">
              SoalSNBT
              <span className="text-accent">.id</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Menu utama">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: XP + Streak + Avatar */}
          {profile ? (
            <div className="flex items-center gap-3">
              {/* Streak Badge */}
              {profile.streakCurrent > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="streak-badge hidden sm:flex"
                  aria-label={`Streak ${profile.streakCurrent} hari`}
                  title={`Streak aktif: ${profile.streakCurrent} hari berturut-turut`}
                >
                  <Flame className="w-3 h-3" aria-hidden="true" />
                  {profile.streakCurrent}
                </motion.div>
              )}

              {/* XP Bar + Level */}
              <div className="hidden lg:flex items-center gap-2" aria-label={`Level ${currentLevel}, XP ${currentXP}`}>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                  <span className="text-xs font-semibold text-text-secondary">Lv.{currentLevel}</span>
                </div>
                <div className="w-20 xp-bar" aria-label={`Progress XP: ${Math.round(xpProgress)}%`} role="progressbar" aria-valuenow={Math.round(xpProgress)} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">{currentXP} XP</span>
              </div>

              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Profile Dropdown */}
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setIsProfileOpen((v) => !v)}
                  className="flex items-center gap-2 hover:bg-surface rounded-lg p-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-label="Menu profil"
                  id="profile-menu-button"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.fullName ?? profile.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {getInitials(profile.fullName ?? profile.username)}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-text-secondary transition-transform duration-200 hidden sm:block",
                      isProfileOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-1 z-50"
                      role="menu"
                      aria-labelledby="profile-menu-button"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {profile.fullName ?? profile.username}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          @{profile.username}
                        </p>
                        {profile.subscriptionTier === "pro" && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                            <Star className="w-2.5 h-2.5" aria-hidden="true" />
                            PRO
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <DropdownItem
                          href="/profil"
                          icon={User}
                          label="Profil Saya"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          href="/dashboard/analytics"
                          icon={Star}
                          label="Analitik Saya"
                          onClick={() => setIsProfileOpen(false)}
                        />
                        <DropdownItem
                          href="/pengaturan"
                          icon={Settings}
                          label="Pengaturan"
                          onClick={() => setIsProfileOpen(false)}
                        />
                      </div>

                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-light transition-colors duration-150"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* CTA untuk guest */
            <div className="flex items-center gap-2">
              <div className="hidden sm:block mr-2">
                <ThemeToggle />
              </div>
              <Link
                href="/login"
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-lg"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shadow-sm animate-pulse-glow"
              >
                Daftar Gratis
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-border shadow-lg md:hidden overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1" aria-label="Menu mobile">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-text-secondary hover:bg-surface"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}

              {profile && (
                <div className="pt-2 border-t border-border mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-danger hover:bg-danger-light rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Keluar
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer agar konten tidak tertutup navbar */}
      <div style={{ height: "var(--nav-height)" }} aria-hidden="true" />
    </>
  );
}

// ============================================================
// Sub-komponen: Dropdown Menu Item
// ============================================================
function DropdownItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors duration-150"
      role="menuitem"
    >
      <Icon className="w-4 h-4 text-text-secondary" aria-hidden="true" />
      {label}
    </Link>
  );
}
