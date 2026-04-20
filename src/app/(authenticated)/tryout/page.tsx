import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { TryoutClient } from "./TryoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tryout SNBT",
  description: "Simulasi SNBT nasional — ukur kemampuanmu dengan ranking real-time.",
};

export default async function TryoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get all events from DB
  const events = await prisma.eventTryout.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { peserta: true } },
      peserta: {
        where: { userId: user.id },
        take: 1,
      },
    },
  });

  const now = new Date();
  const serializedEvents = events.map(e => ({
    id: e.id,
    nama: e.nama,
    deskripsi: e.deskripsi,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate.toISOString(),
    scoreReleaseAt: e.scoreReleaseAt?.toISOString() || null,
    isScorePublished: e.isScorePublished,
    isPro: e.isPro,
    maxPeserta: e.maxPeserta,
    totalSoal: e.totalSoal,
    durasiMenit: e.durasiMenit,
    participantCount: e._count.peserta,
    isRegistered: e.peserta.length > 0,
    status: (e.endDate < now ? "selesai" : e.startDate <= now ? "berlangsung" : "mendatang") as "selesai" | "berlangsung" | "mendatang",
  }));

  return <TryoutClient events={serializedEvents} />;
}
