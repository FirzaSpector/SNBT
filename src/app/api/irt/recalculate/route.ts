import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/irt/recalculate
 * 
 * Cron-triggered endpoint to recalculate IRT parameters for all questions.
 * Protected by CRON_SECRET header.
 * 
 * Simplified 3PL IRT model:
 * - difficulty (b): inverse of proportion correct, z-score scaled
 * - discrimination (a): point-biserial correlation approximation
 * - guessing (c): 1/number_of_options (typically 0.2 for 5-choice)
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "snbt-irt-secret-2026";
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    // Get all active questions with their answer statistics
    const soalStats = await prisma.soal.findMany({
      where: { isActive: true },
      select: {
        id: true,
        pilihanJawaban: { select: { id: true } },
        jawabanUser: {
          select: {
            isCorrect: true,
            waktuMenjawabDetik: true,
          },
        },
      },
    });

    let totalUpdated = 0;
    let totalResponses = 0;
    let sumDifficulty = 0;

    for (const soal of soalStats) {
      const answers = soal.jawabanUser.filter(a => a.isCorrect !== null);
      if (answers.length < 5) continue; // Need minimum 5 responses for meaningful IRT

      const totalAnswers = answers.length;
      const correctAnswers = answers.filter(a => a.isCorrect === true).length;
      const proportionCorrect = correctAnswers / totalAnswers;
      const numOptions = soal.pilihanJawaban.length || 5;

      // c parameter: guessing probability
      const c = 1 / numOptions;

      // b parameter: difficulty (higher = harder)
      // Scale from proportion correct to IRT difficulty scale (-3 to +3)
      // Using probit-like transformation
      const adjustedProportion = Math.max(0.01, Math.min(0.99, proportionCorrect));
      const b = -2.5 * (adjustedProportion - 0.5); // Linear mapping: 0% correct = +1.25, 100% = -1.25

      // a parameter: discrimination
      // Approximation based on variance of responses
      // Higher variance in response times for correct vs incorrect suggests better discrimination
      const correctTimes = answers.filter(a => a.isCorrect).map(a => a.waktuMenjawabDetik || 60);
      const incorrectTimes = answers.filter(a => !a.isCorrect).map(a => a.waktuMenjawabDetik || 60);
      
      let a = 1.0; // Default discrimination
      if (correctTimes.length > 0 && incorrectTimes.length > 0) {
        const avgCorrectTime = correctTimes.reduce((s, t) => s + t, 0) / correctTimes.length;
        const avgIncorrectTime = incorrectTimes.reduce((s, t) => s + t, 0) / incorrectTimes.length;
        // If correct answers are faster, question has good discrimination
        const timeDiff = Math.abs(avgCorrectTime - avgIncorrectTime);
        a = Math.max(0.5, Math.min(2.5, 1.0 + timeDiff / 60));
      }

      // Update question with IRT parameters
      await prisma.soal.update({
        where: { id: soal.id },
        data: {
          irtDifficulty: Math.round(b * 1000) / 1000,
          irtDiscrimination: Math.round(a * 1000) / 1000,
          irtGuessing: Math.round(c * 1000) / 1000,
          irtLastCalculated: new Date(),
        },
      });

      totalUpdated++;
      totalResponses += totalAnswers;
      sumDifficulty += b;
    }

    const durationMs = Date.now() - startTime;
    const avgDifficulty = totalUpdated > 0 ? sumDifficulty / totalUpdated : 0;

    // Log the calculation
    await prisma.irtCalculationLog.create({
      data: {
        totalSoal: totalUpdated,
        totalResponses,
        avgDifficulty: Math.round(avgDifficulty * 1000) / 1000,
        durationMs,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalSoalUpdated: totalUpdated,
        totalResponses,
        avgDifficulty: Math.round(avgDifficulty * 1000) / 1000,
        durationMs,
      },
    });
  } catch (error) {
    console.error("IRT Recalculation error:", error);
    return NextResponse.json(
      { error: "Failed to recalculate IRT parameters" },
      { status: 500 }
    );
  }
}
