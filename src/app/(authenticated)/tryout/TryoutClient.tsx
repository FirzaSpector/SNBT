"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, CheckCircle, FileText, Lock, ChevronRight, Play, Users, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EventData {
  id: string;
  nama: string;
  deskripsi: string | null;
  startDate: string;
  endDate: string;
  scoreReleaseAt: string | null;
  isScorePublished: boolean;
  isPro: boolean;
  maxPeserta: number | null;
  totalSoal: number;
  durasiMenit: number;
  participantCount: number;
  isRegistered: boolean;
  status: "selesai" | "berlangsung" | "mendatang";
}

interface TryoutClientProps {
  events: EventData[];
}

export function TryoutClient({ events }: TryoutClientProps) {
  const [activeTab, setActiveTab] = useState<"mendatang" | "selesai">("mendatang");
  const [registering, setRegistering] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(
    new Set(events.filter(e => e.isRegistered).map(e => e.id))
  );

  const upcoming = events.filter(e => e.status === "mendatang" || e.status === "berlangsung");
  const past = events.filter(e => e.status === "selesai");

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    try {
      const res = await fetch("/api/event-tryout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRegisteredEvents(prev => new Set([...Array.from(prev), eventId]));
      toast.success("Berhasil mendaftar! Tandai tanggalnya ya. 📅");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mendaftar");
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", timeZoneName: "short",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-800 text-text-primary mb-2">
          🏆 Tryout SNBT Se-Indonesia
        </h1>
        <p className="text-text-secondary">
          Ikuti Grand Tryout Nasional dan ukur kemampuanmu bersama ribuan peserta dari seluruh Indonesia.
        </p>
      </div>

      <div className="flex gap-4 border-b border-border mb-8">
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "mendatang"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setActiveTab("mendatang")}
        >
          Event Mendatang ({upcoming.length})
        </button>
        <button
          className={`pb-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "selesai"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
          onClick={() => setActiveTab("selesai")}
        >
          Arsip ({past.length})
        </button>
      </div>

      {activeTab === "mendatang" ? (
        <div className="space-y-4">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada event mendatang. Nantikan pengumuman selanjutnya!</p>
            </div>
          ) : (
            upcoming.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Date badge */}
                  <div className="w-full lg:w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex flex-col items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs font-bold text-primary text-center px-2">
                      {formatDate(event.startDate)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-heading font-700 text-xl text-text-primary">{event.nama}</h3>
                      {event.isPro && (
                        <span className="bg-accent-light text-accent text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 mt-1">
                          <Lock className="w-3 h-3" /> PRO
                        </span>
                      )}
                      {event.status === "berlangsung" && (
                        <span className="bg-success-light text-success text-xs font-bold px-2 py-0.5 rounded-md animate-pulse mt-1">
                          LIVE
                        </span>
                      )}
                    </div>

                    {event.deskripsi && (
                      <p className="text-sm text-text-secondary mb-4 line-clamp-2">{event.deskripsi}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.startDate)} — {event.durasiMenit} menit
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        {event.totalSoal} soal
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {event.participantCount.toLocaleString()}{event.maxPeserta ? ` / ${event.maxPeserta.toLocaleString()}` : ""} peserta
                      </span>
                      {event.scoreReleaseAt && (
                        <span className="flex items-center gap-1.5">
                          {event.isScorePublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          Skor rilis: {formatDate(event.scoreReleaseAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 self-center">
                    {registeredEvents.has(event.id) ? (
                      <div className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-success text-success font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Terdaftar
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        disabled={registering === event.id || event.isPro}
                        className={`px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          event.isPro
                            ? "bg-surface text-text-muted border border-border cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary-dark shadow-sm"
                        }`}
                      >
                        {registering === event.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : event.isPro ? (
                          <>
                            <Lock className="w-4 h-4" /> Khusus PRO
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" /> Daftar Sekarang
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {past.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada arsip event.</p>
            </div>
          ) : (
            past.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 flex items-center gap-4"
              >
                <div className="p-2 rounded-lg bg-surface">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-700 text-text-primary truncate">{event.nama}</h3>
                  <div className="flex gap-3 text-xs text-text-muted mt-1">
                    <span>{formatDate(event.startDate)}</span>
                    <span>{event.participantCount.toLocaleString()} peserta</span>
                    <span className="flex items-center gap-1">
                      {event.isScorePublished ? (
                        <><Eye className="w-3 h-3 text-success" /> Skor dipublikasi</>
                      ) : (
                        <><EyeOff className="w-3 h-3 text-text-muted" /> Skor belum dirilis</>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
