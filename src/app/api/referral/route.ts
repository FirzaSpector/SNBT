import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const applyReferralSchema = z.object({
  code: z.string().min(1, "Kode referral wajib diisi").max(20),
});

/**
 * GET /api/referral
 * Get current user's referral code + stats.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { referralCode: true, username: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Generate referral code if not exists
    if (!profile.referralCode) {
      const code = generateReferralCode(profile.username);
      profile = await prisma.profile.update({
        where: { id: user.id },
        data: { referralCode: code },
        select: { referralCode: true, username: true },
      });
    }

    // Get referral stats
    const totalReferred = await prisma.profile.count({
      where: { referredById: user.id },
    });

    const rewards = await prisma.referralReward.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        referred: { select: { username: true, fullName: true } },
      },
    });

    const totalXpEarned = rewards
      .filter(r => r.tipe === "xp")
      .reduce((sum, r) => sum + r.nilai, 0);

    const totalDaysEarned = rewards
      .filter(r => r.tipe === "subscription_days")
      .reduce((sum, r) => sum + r.nilai, 0);

    return NextResponse.json({
      success: true,
      data: {
        referralCode: profile.referralCode,
        totalReferred,
        totalXpEarned,
        totalDaysEarned,
        recentReferrals: rewards.slice(0, 10).map(r => ({
          username: r.referred.username,
          fullName: r.referred.fullName,
          reward: r.nilai,
          tipe: r.tipe,
          date: r.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching referral:", error);
    return NextResponse.json({ error: "Failed to fetch referral data" }, { status: 500 });
  }
}

/**
 * POST /api/referral
 * Apply a referral code.
 * body: { code: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json() as unknown;
    const parsed = applyReferralSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Input tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }
    const { code } = parsed.data;

    // Check if user already has a referrer
    const currentProfile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { referredById: true },
    });

    if (currentProfile?.referredById) {
      return NextResponse.json({ error: "Already used a referral code" }, { status: 400 });
    }

    // Find referrer by code
    const referrer = await prisma.profile.findUnique({
      where: { referralCode: code },
      select: { id: true, subscriptionTier: true },
    });

    if (!referrer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    if (referrer.id === user.id) {
      return NextResponse.json({ error: "Cannot use your own referral code" }, { status: 400 });
    }

    // Apply referral
    await prisma.$transaction([
      // Link referred user
      prisma.profile.update({
        where: { id: user.id },
        data: { referredById: referrer.id },
      }),
      // Grant XP to referrer
      prisma.profile.update({
        where: { id: referrer.id },
        data: { xp: { increment: 100 } },
      }),
      // Log XP reward
      prisma.referralReward.create({
        data: {
          referrerId: referrer.id,
          referredId: user.id,
          tipe: "xp",
          nilai: 100,
        },
      }),
      // If referrer is pro, grant 3 extra days
      ...(referrer.subscriptionTier !== "free" ? [
        prisma.referralReward.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            tipe: "subscription_days",
            nilai: 3,
          },
        }),
      ] : []),
    ]);

    return NextResponse.json({ success: true, message: "Referral code applied! Referrer rewarded." });
  } catch (error) {
    console.error("Error applying referral:", error);
    return NextResponse.json({ error: "Failed to apply referral code" }, { status: 500 });
  }
}

function generateReferralCode(username: string): string {
  const prefix = username.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}
