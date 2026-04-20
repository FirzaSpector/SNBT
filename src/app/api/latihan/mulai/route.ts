import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * POST /api/latihan/mulai
 * Membuat sesi latihan baru dan mengembalikan soal-soalnya.
 *
 * KEPUTUSAN: Query soal dilakukan secara random di database (ORDER BY RANDOM())
 * untuk variasi soal setiap sesi. Soal premium difilter berdasarkan tier user.
 */

const mulaiSchema = z.object({
  topikId: z.number().int().positive().optional(),
  mapelId: z.number().int().positive().optional(),
  jumlahSoal: z.number().int().min(5).max(50).default(20),
  tingkatMin: z.number().int().min(1).max(5).default(1),
  tingkatMax: z.number().int().min(1).max(5).default(5),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof mulaiSchema>;
  try {
    const rawBody = await request.json() as unknown;
    body = mulaiSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  // Cek subscription tier user
  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { subscriptionTier: true, subscriptionExpiresAt: true },
  });

  const isPro =
    profile?.subscriptionTier === "pro" &&
    (!profile.subscriptionExpiresAt ||
      profile.subscriptionExpiresAt > new Date());

  // Query soal dengan filter yang sesuai
  const soalList = await prisma.soal.findMany({
    where: {
      isActive: true,
      ...(body.topikId ? { topikId: body.topikId } : {}),
      ...(body.mapelId
        ? { topik: { mapelId: body.mapelId } }
        : {}),
      tingkatKesulitan: {
        gte: body.tingkatMin,
        lte: body.tingkatMax,
      },
      // Free user hanya bisa akses soal non-premium
      ...(!isPro ? { isPremium: false } : {}),
    },
    include: {
      pilihanJawaban: {
        orderBy: { urutan: "asc" },
      },
      topik: {
        include: { mapel: true },
      },
    },
    // Ambil lebih banyak lalu random di aplikasi untuk menghindari ORDER BY RANDOM() yang slow
    take: body.jumlahSoal * 3,
  });

  // Shuffle dan ambil sejumlah yang diminta
  const shuffled = soalList.sort(() => Math.random() - 0.5).slice(0, body.jumlahSoal);

  if (shuffled.length === 0) {
    return NextResponse.json(
      { error: "Tidak ada soal yang tersedia untuk kriteria ini" },
      { status: 404 }
    );
  }

  // Buat record sesi latihan
  const sesi = await prisma.sesiLatihan.create({
    data: {
      userId: user.id,
      tipe: "latihan_bebas",
      mapelId: body.mapelId ?? shuffled[0]?.topik?.mapelId ?? null,
      topikIds: body.topikId ? [body.topikId] : [],
      totalSoal: shuffled.length,
    },
  });

  // Kembalikan soal tanpa informasi jawaban benar (security)
  const soalResponse = shuffled.map((soal) => ({
    ...soal,
    pilihanJawaban: soal.pilihanJawaban.map((p) => ({
      id: p.id,
      soalId: p.soalId,
      label: p.label,
      konten: p.konten,
      kontenHtml: p.kontenHtml,
      urutan: p.urutan,
      // JANGAN kirim isCorrect ke client sebelum submit!
    })),
    pembahasan: null, // Pembahasan hanya tersedia setelah submit
  }));

  return NextResponse.json({
    sesiId: sesi.id,
    soal: soalResponse,
    totalSoal: shuffled.length,
    isPro,
  });
}
