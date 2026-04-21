import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LatihanSession } from "@/components/question/LatihanSession";
import type { Soal, PilihanJawaban, Pembahasan } from "@/types";

/**
 * Halaman sesi latihan aktif.
 * Mengambil soal dan data sesi, lalu render LatihanSession.
 */
export default async function LatihanSesiPage({
  params,
}: {
  params: { sesiId: string };
}) {
  const { sesiId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil sesi beserta jawabannya
  const sesi = await prisma.sesiLatihan.findUnique({
    where: {
      id: sesiId,
      userId: user.id,
    },
    include: {
      mapel: true,
      jawabanUser: {
        include: {
          soal: {
            include: {
              pilihanJawaban: {
                orderBy: { urutan: "asc" },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!sesi) {
    redirect("/latihan");
  }

  if (sesi.isSelesai) {
    redirect(`/latihan/${sesiId}/hasil`);
  }

  // Query soal berdasar topikIds / mapelId sesi
  const soalList = await prisma.soal.findMany({
    where: {
      isActive: true,
      ...(sesi.topikIds.length > 0 ? { topikId: { in: sesi.topikIds } } : {}),
      ...(sesi.mapelId && sesi.topikIds.length === 0 ? { topik: { mapelId: sesi.mapelId } } : {}),
    },
    include: {
      pilihanJawaban: {
        orderBy: { urutan: "asc" },
      },
      pembahasan: true,
    },
    take: sesi.totalSoal > 0 ? sesi.totalSoal : 20,
  });

  if (soalList.length === 0) {
    redirect("/latihan?error=no_questions");
  }

  // Transform Prisma result to match the Soal & PilihanJawaban interface
  // This avoids `as any` by explicitly mapping the types
  const typedSoalList: Array<Soal & { pilihanJawaban: PilihanJawaban[] }> = soalList.map((soal) => ({
    id: soal.id,
    topikId: soal.topikId,
    konten: soal.konten,
    kontenHtml: soal.kontenHtml,
    gambarUrl: soal.gambarUrl,
    tipe: soal.tipe as Soal["tipe"],
    tingkatKesulitan: soal.tingkatKesulitan as Soal["tingkatKesulitan"],
    tahun: soal.tahun,
    sumber: soal.sumber,
    hasVisualExplanation: soal.hasVisualExplanation,
    isPremium: soal.isPremium,
    isActive: soal.isActive,
    createdAt: soal.createdAt,
    irtDifficulty: soal.irtDifficulty,
    irtDiscrimination: soal.irtDiscrimination,
    irtGuessing: soal.irtGuessing,
    irtLastCalculated: soal.irtLastCalculated,
    pembahasan: soal.pembahasan as Pembahasan | null,
    pilihanJawaban: soal.pilihanJawaban.map((p) => ({
      id: p.id,
      soalId: p.soalId,
      label: p.label as PilihanJawaban["label"],
      konten: p.konten,
      kontenHtml: p.kontenHtml,
      isCorrect: p.isCorrect,
      urutan: p.urutan,
    })),
  }));

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-64px)] pb-20 sm:pb-0">
      <LatihanSession
        soalList={typedSoalList}
        sesiId={sesi.id}
        userId={user.id}
        mapelNama={sesi.mapel?.nama || "Latihan Bebas"}
      />
    </div>
  );
}
