"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Check, Share2, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
import type { ReferralStats } from "@/types";

/**
 * Dashboard widget with referral code, copy button, share links, and stats.
 */
export function ReferralCard() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral")
      .then(res => res.json())
      .then(result => {
        if (result.success) setStats(result.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const copyCode = async () => {
    if (!stats?.referralCode) return;
    await navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    toast.success("Kode referral disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!stats?.referralCode) return;
    const text = `Yuk latihan SNBT bareng di SoalSNBT.id! Pakai kode referral ku: ${stats.referralCode} untuk bonus XP! 🎓`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareTwitter = () => {
    if (!stats?.referralCode) return;
    const text = `Persiapan SNBT 2026? Cobain SoalSNBT.id! Pakai kode ${stats.referralCode} dan dapatkan bonus XP! 🚀 #SNBT2026 #UTBK`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-4 bg-surface rounded w-1/3 mb-4" />
        <div className="h-10 bg-surface rounded mb-3" />
        <div className="h-3 bg-surface rounded w-1/2" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="card p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-700 text-text-primary">Ajak Teman, Dapat XP!</h3>
          <p className="text-xs text-text-muted">+100 XP setiap teman yang mendaftar</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-white border-2 border-dashed border-primary/40 rounded-lg px-4 py-2.5 text-center">
          <span className="font-mono font-bold text-lg text-primary tracking-widest">
            {stats.referralCode}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Share buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={shareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
        <button
          onClick={shareTwitter}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Twitter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-text-muted mb-0.5">
            <Users className="w-3 h-3" />
          </div>
          <p className="font-bold text-text-primary">{stats.totalReferred}</p>
          <p className="text-xs text-text-muted">Teman</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-primary">{stats.totalXpEarned}</p>
          <p className="text-xs text-text-muted">XP Earned</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-accent">{stats.totalDaysEarned}</p>
          <p className="text-xs text-text-muted">Bonus Days</p>
        </div>
      </div>
    </div>
  );
}
