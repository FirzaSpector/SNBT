import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function MulaiLatihanPage({
  searchParams,
}: {
  searchParams: { mapelId?: string; topikId?: string };
}) {
  const params = searchParams;
  const mapelId = params.mapelId ? parseInt(params.mapelId, 10) : undefined;
  const topikId = params.topikId ? parseInt(params.topikId, 10) : undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Cek subscription tier
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { subscriptionTier: true, subscriptionExpiresAt: true },
  });

  const isPro =
    profile?.subscriptionTier === "pro" &&
    (!profile.subscriptionExpiresAt || profile.subscriptionExpiresAt > new Date());

  const jumlahSoal = 20;

  // Query soal
  const soalList = await prisma.soal.findMany({
    where: {
      isActive: true,
      ...(topikId ? { topikId } : {}),
      ...(mapelId ? { topik: { mapelId } } : {}),
      // Free user hanya bisa akses soal non-premium
      ...(!isPro ? { isPremium: false } : {}),
    },
    include: {
      topik: {
        include: { mapel: true },
      },
    },
    // Ambil lebih banyak lalu random di memori
    take: jumlahSoal * 3,
  });

  const shuffled = soalList.sort(() => Math.random() - 0.5).slice(0, jumlahSoal);

  if (shuffled.length === 0) {
    redirect("/latihan?error=no_questions");
  }

  // Buat sesi
  const sesi = await prisma.sesiLatihan.create({
    data: {
      userId: user.id,
      tipe: "latihan_bebas",
      mapelId: mapelId ?? shuffled[0]?.topik?.mapelId ?? null,
      topikIds: topikId ? [topikId] : [],
      totalSoal: shuffled.length,
    },
  });

  // Redirect ke sesi yang baru dibuat
  redirect(`/latihan/${sesi.id}`);
}
