import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/irt/score
 * 
 * Calculate IRT-weighted score for a completed session.
 * body: { sesiId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sesiId } = await request.json();
    if (!sesiId) {
      return NextResponse.json({ error: "sesiId is required" }, { status: 400 });
    }

    // Get session with answers and question IRT params
    const sesi = await prisma.sesiLatihan.findUnique({
      where: { id: sesiId, userId: user.id },
      include: {
        jawabanUser: {
          include: {
            soal: {
              select: {
                id: true,
                irtDifficulty: true,
                irtDiscrimination: true,
                irtGuessing: true,
                topik: {
                  select: {
                    mapel: {
                      select: { id: true, kode: true, nama: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sesi) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Calculate IRT score per question
    let totalIrtScore = 0;
    let maxPossibleScore = 0;
    const subtestScores: Record<string, { kode: string; nama: string; rawScore: number; irtScore: number; totalSoal: number }> = {};

    for (const jawaban of sesi.jawabanUser) {
      const soal = jawaban.soal;
      const a = soal.irtDiscrimination ?? 1.0;
      const b = soal.irtDifficulty ?? 0;
      const c = soal.irtGuessing ?? 0.2;

      // IRT-weighted score: harder questions worth more
      // Weight = a * (1 + |b|) → higher difficulty & discrimination = more weight
      const weight = a * (1 + Math.abs(b));
      const maxPoints = weight;
      maxPossibleScore += maxPoints;

      const mapelKode = soal.topik?.mapel?.kode ?? "UNKNOWN";
      const mapelNama = soal.topik?.mapel?.nama ?? "Unknown";

      if (!subtestScores[mapelKode]) {
        subtestScores[mapelKode] = { kode: mapelKode, nama: mapelNama, rawScore: 0, irtScore: 0, totalSoal: 0 };
      }
      subtestScores[mapelKode].totalSoal++;

      if (jawaban.isCorrect === true) {
        const score = weight * (1 - c); // Deduct guessing probability from score
        totalIrtScore += score;
        subtestScores[mapelKode].irtScore += score;
        subtestScores[mapelKode].rawScore++;
      }
    }

    // Normalize to 0-1000 scale
    const normalizedScore = maxPossibleScore > 0
      ? Math.round((totalIrtScore / maxPossibleScore) * 1000)
      : 0;

    // Estimate percentile (simplified — in production this would use a distribution table)
    const percentile = Math.min(99, Math.max(1, Math.round(
      50 + (normalizedScore - 500) / 10
    )));

    const response = {
      sesiId,
      totalScore: sesi.soalBenar,
      maxPossibleScore: sesi.totalSoal,
      irtScore: normalizedScore,
      percentile,
      perSubtest: Object.values(subtestScores).map(s => ({
        mapelKode: s.kode,
        mapelNama: s.nama,
        rawScore: s.rawScore,
        irtScore: s.totalSoal > 0 ? Math.round((s.irtScore / (s.totalSoal * 2)) * 1000) : 0,
        totalSoal: s.totalSoal,
      })),
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("IRT Score calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate IRT score" }, { status: 500 });
  }
}
