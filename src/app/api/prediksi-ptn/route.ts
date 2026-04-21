import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/prediksi-ptn
 * 
 * Returns passing prediction for user's target program.
 * Compares user's latest tryout IRT score against passing grade.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile with target prodi
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        targetProdi: {
          include: {
            univ: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!profile.targetProdi) {
      return NextResponse.json({
        success: true,
        data: null,
        message: "Belum memilih program studi target. Silakan update profil.",
      });
    }

    // Get user's latest completed session to estimate IRT score
    const latestSession = await prisma.sesiLatihan.findFirst({
      where: { userId: user.id, isSelesai: true },
      orderBy: { waktuSelesai: "desc" },
      include: {
        jawabanUser: {
          include: {
            soal: {
              select: {
                irtDifficulty: true,
                irtDiscrimination: true,
                irtGuessing: true,
              },
            },
          },
        },
      },
    });

    let userIrtScore = 0;

    if (latestSession) {
      let totalIrtScore = 0;
      let maxPossibleScore = 0;

      for (const jawaban of latestSession.jawabanUser) {
        const a = jawaban.soal.irtDiscrimination ?? 1.0;
        const b = jawaban.soal.irtDifficulty ?? 0;
        const c = jawaban.soal.irtGuessing ?? 0.2;
        const weight = a * (1 + Math.abs(b));
        maxPossibleScore += weight;

        if (jawaban.isCorrect === true) {
          totalIrtScore += weight * (1 - c);
        }
      }

      userIrtScore = maxPossibleScore > 0
        ? Math.round((totalIrtScore / maxPossibleScore) * 1000)
        : 0;
    } else {
      // No sessions yet — estimate from 0
      userIrtScore = 0;
    }

    const prodi = profile.targetProdi;
    const passingGrade = prodi.passingGrade;

    // Calculate percentage: how close is the user to the passing grade
    const percentage = Math.min(100, Math.max(0, Math.round((userIrtScore / passingGrade) * 100)));

    let status: "aman" | "berjuang" | "sulit";
    let color: "green" | "yellow" | "red";

    if (percentage >= 70) {
      status = "aman";
      color = "green";
    } else if (percentage >= 40) {
      status = "berjuang";
      color = "yellow";
    } else {
      status = "sulit";
      color = "red";
    }

    return NextResponse.json({
      success: true,
      data: {
        prodiId: prodi.id,
        prodiNama: prodi.nama,
        univNama: prodi.univ.nama,
        univSingkatan: prodi.univ.singkatan,
        dayaTampung: prodi.dayaTampung,
        passingGrade,
        userIrtScore,
        percentage,
        status,
        color,
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json({ error: "Failed to calculate prediction" }, { status: 500 });
  }
}
