import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";
import { DashboardSkeleton } from "./DashboardSkeleton";

/**
 * Dashboard Server Component — mengambil semua data awal dari DB
 * sebelum merender halaman. Ini menghindari waterfall fetching.
 */
export const metadata = {
  title: "Dashboard Belajar",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Ambil data paralel: profil + statistik latihan 7 hari terakhir + badge terbaru
  const [profile, recentSessions, earnedBadges, mapelList] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user.id } }),

    // Sesi 7 hari terakhir untuk chart tren harian
    prisma.sesiLatihan.findMany({
      where: {
        userId: user.id,
        isSelesai: true,
        waktuMulai: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { waktuMulai: "asc" },
      select: {
        waktuMulai: true,
        soalBenar: true,
        soalSalah: true,
        soalSkip: true,
        xpEarned: true,
        durasiDetik: true,
        mapelId: true,
        mapel: { select: { kode: true, nama: true, warna: true } },
      },
    }),

    // Badge yang sudah diraih
    prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
      take: 3,
    }),

    // Semua mata pelajaran dengan jumlah soal
    prisma.mataPelajaran.findMany({
      include: {
        _count: {
          select: { topik: true },
        },
      },
      orderBy: { id: "asc" },
    }),
  ]);

  if (!profile) redirect("/setup-profil");

  // Hitung total statistik
  const totalSoalDikerjakan = await prisma.jawabanUser.count({
    where: { userId: user.id },
  });

  const totalSoalBenar = await prisma.jawabanUser.count({
    where: { userId: user.id, isCorrect: true },
  });

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        profile={{
          ...profile,
          streakLastDate: profile.streakLastDate ? new Date(profile.streakLastDate) : null,
          subscriptionExpiresAt: profile.subscriptionExpiresAt ? new Date(profile.subscriptionExpiresAt) : null,
          subscriptionTier: profile.subscriptionTier as "free" | "pro",
        }}
        recentSessions={recentSessions.map((s) => ({
          ...s,
          waktuMulai: new Date(s.waktuMulai),
        }))}
        earnedBadges={earnedBadges.map((ub) => ({
          ...ub,
          earnedAt: new Date(ub.earnedAt),
        }))}
        mapelList={mapelList}
        stats={{
          totalSoalDikerjakan,
          totalSoalBenar,
          akurasi: totalSoalDikerjakan > 0
            ? Math.round((totalSoalBenar / totalSoalDikerjakan) * 100)
            : 0,
        }}
      />
    </Suspense>
  );
}
