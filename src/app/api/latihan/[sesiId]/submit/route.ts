import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { hitungXP } from "@/lib/utils";
import { z } from "zod";

// Validasi body request submit
const submitSchema = z.object({
  jawaban: z.array(
    z.object({
      soalId: z.string().uuid(),
      jawabanDipilih: z.string().nullable(),
      waktuMenjawabDetik: z.number().nullable(),
      isBookmarked: z.boolean().default(false),
    })
  ),
});

/**
 * POST /api/latihan/[sesiId]/submit
 * Menyimpan semua jawaban user, menghitung skor, memberikan XP,
 * dan memeriksa kondisi badge yang mungkin diraih.
 *
 * KEPUTUSAN: Menggunakan transaksi Prisma untuk atomicity —
 * jika salah satu langkah gagal, semua rollback untuk menjaga integritas data.
 */
export async function POST(
  request: Request,
  { params }: { params: { sesiId: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validasi body
  let body: z.infer<typeof submitSchema>;
  try {
    const rawBody = await request.json() as unknown;
    body = submitSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const { sesiId } = params;

  // Verifikasi sesi milik user ini
  const sesi = await prisma.sesiLatihan.findFirst({
    where: {
      id: sesiId,
      userId: user.id,
      isSelesai: false, // Jangan submit ulang
    },
  });

  if (!sesi) {
    return NextResponse.json(
      { error: "Sesi tidak ditemukan atau sudah diselesaikan" },
      { status: 404 }
    );
  }

  // Ambil jawaban benar untuk semua soal yang dikerjakan
  const soalIds = body.jawaban.map((j) => j.soalId);
  const pilihanBenar = await prisma.pilihanJawaban.findMany({
    where: {
      soalId: { in: soalIds },
      isCorrect: true,
    },
    select: { soalId: true, label: true },
  });

  // Buat map soalId → label benar
  const kunciJawaban = new Map(
    pilihanBenar.map((p) => [p.soalId, p.label])
  );

  // Hitung skor
  let soalBenar = 0;
  let soalSalah = 0;
  let soalSkip = 0;

  const jawabanWithCorrect = body.jawaban.map((j) => {
    const kunci = kunciJawaban.get(j.soalId);
    const isCorrect =
      j.jawabanDipilih !== null && kunci !== undefined
        ? j.jawabanDipilih === kunci
        : null;

    if (j.jawabanDipilih === null) soalSkip++;
    else if (isCorrect) soalBenar++;
    else soalSalah++;

    return { ...j, isCorrect };
  });

  const durasiDetik = Math.round(
    (Date.now() - sesi.waktuMulai.getTime()) / 1000
  );

  // Hitung XP yang didapat
  const xpEarned = hitungXP({
    soalBenar,
    totalSoal: soalIds.length,
    durasiDetik,
    isPremiumSession: false,
  });

  // ============================================================
  // TRANSAKSI: Simpan semua data sekaligus
  // ============================================================
  await prisma.$transaction(async (tx) => {
    // 1. Simpan semua jawaban
    await tx.jawabanUser.createMany({
      data: jawabanWithCorrect.map((j) => ({
        sesiId,
        userId: user.id,
        soalId: j.soalId,
        jawabanDipilih: j.jawabanDipilih,
        isCorrect: j.isCorrect,
        waktuMenjawabDetik: j.waktuMenjawabDetik,
        isBookmarked: j.isBookmarked,
      })),
      skipDuplicates: true,
    });

    // 2. Update sesi latihan
    await tx.sesiLatihan.update({
      where: { id: sesiId },
      data: {
        isSelesai: true,
        waktuSelesai: new Date(),
        durasiDetik,
        soalBenar,
        soalSalah,
        soalSkip,
        xpEarned,
      },
    });

    // 3. Update XP dan streak profile user
    const profile = await tx.profile.findUnique({
      where: { id: user.id },
    });

    if (profile) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = profile.streakLastDate
        ? new Date(profile.streakLastDate)
        : null;

      let streakCurrent = profile.streakCurrent;
      let streakLongest = profile.streakLongest;

      if (lastDate) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate.getTime() === yesterday.getTime()) {
          // Belajar kemarin → lanjutkan streak
          streakCurrent += 1;
        } else if (lastDate.getTime() < yesterday.getTime()) {
          // Lewat satu hari → reset streak
          streakCurrent = 1;
        }
        // Kalau sudah belajar hari ini → tidak berubah
      } else {
        streakCurrent = 1;
      }

      streakLongest = Math.max(streakLongest, streakCurrent);

      // Hitung level baru
      const newXP = profile.xp + xpEarned;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

      await tx.profile.update({
        where: { id: user.id },
        data: {
          xp: { increment: xpEarned },
          level: newLevel,
          streakCurrent,
          streakLongest,
          streakLastDate: today,
        },
      });
    }
  });

  // ============================================================
  // CEK BADGE (di luar transaksi untuk performa)
  // ============================================================
  await checkAndAwardBadges(user.id, soalBenar, soalIds.length);

  return NextResponse.json({
    success: true,
    soalBenar,
    soalSalah,
    soalSkip,
    xpEarned,
    durasiDetik,
    akurasi:
      soalIds.length > 0
        ? Math.round((soalBenar / soalIds.length) * 100)
        : 0,
  });
}

/**
 * Fungsi untuk memeriksa dan memberikan badge yang memenuhi kondisi.
 * Dijalankan asinkron setelah submit selesai.
 */
async function checkAndAwardBadges(
  userId: string,
  soalBenar: number,
  totalSoal: number
): Promise<void> {
  const [profile, allBadges, userBadgesExisting] = await Promise.all([
    prisma.profile.findUnique({ where: { id: userId } }),
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId } }),
  ]);

  if (!profile) return;

  const existingBadgeIds = new Set(userBadgesExisting.map((ub) => ub.badgeId));
  const totalJawaban = await prisma.jawabanUser.count({ where: { userId } });
  const akurasi = totalSoal > 0 ? (soalBenar / totalSoal) * 100 : 0;

  const badgesToAward: number[] = [];

  for (const badge of allBadges) {
    if (existingBadgeIds.has(badge.id)) continue;

    const kondisi = badge.kondisi as Record<string, unknown>;

    if (
      kondisi["type"] === "streak" &&
      typeof kondisi["value"] === "number" &&
      profile.streakCurrent >= kondisi["value"]
    ) {
      badgesToAward.push(badge.id);
    } else if (
      kondisi["type"] === "total_soal" &&
      typeof kondisi["value"] === "number" &&
      totalJawaban >= kondisi["value"]
    ) {
      badgesToAward.push(badge.id);
    } else if (
      kondisi["type"] === "akurasi" &&
      typeof kondisi["value"] === "number" &&
      typeof kondisi["min_soal"] === "number" &&
      akurasi >= kondisi["value"] &&
      totalSoal >= kondisi["min_soal"]
    ) {
      badgesToAward.push(badge.id);
    } else if (kondisi["type"] === "first_session" && totalJawaban > 0) {
      badgesToAward.push(badge.id);
    }
  }

  if (badgesToAward.length > 0) {
    await prisma.userBadge.createMany({
      data: badgesToAward.map((badgeId) => ({ userId, badgeId })),
      skipDuplicates: true,
    });
  }
}
