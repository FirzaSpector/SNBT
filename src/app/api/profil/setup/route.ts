import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const setupSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  email: z.string().email().optional(),
  fullName: z.string().min(3),
  targetUniversity: z.string().optional().default(""),
  targetMajor: z.string().optional().default(""),
  targetProdiId: z.number().nullable().optional(),
});

function generateReferralCode(username: string): string {
  const prefix = username.slice(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as unknown;
    const data = setupSchema.parse(body);

    const referralCode = generateReferralCode(data.username);

    const profile = await prisma.profile.upsert({
      where: { id: data.userId },
      update: {
        fullName: data.fullName,
        targetUniversity: data.targetUniversity,
        targetMajor: data.targetMajor,
        targetProdiId: data.targetProdiId ?? null,
      },
      create: {
        id: data.userId,
        username: data.username,
        fullName: data.fullName,
        targetUniversity: data.targetUniversity,
        targetMajor: data.targetMajor,
        targetProdiId: data.targetProdiId ?? null,
        referralCode,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Setup profil error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan profil atau data tidak valid." },
      { status: 400 }
    );
  }
}
