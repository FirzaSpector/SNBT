import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)], {
    errorMap: () => ({ message: "Value harus 1 atau -1" }),
  }),
});

/**
 * POST /api/komentar/[komentarId]/vote
 * Upvote or downvote a comment.
 * body: { value: 1 | -1 }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { komentarId: string } }
) {
  try {
    const { komentarId } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json() as unknown;
    const parsed = voteSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Input tidak valid", details: parsed.error.issues },
        { status: 400 }
      );
    }
    const { value } = parsed.data;

    // Check if user already voted
    const existingVote = await prisma.komentarVote.findUnique({
      where: { userId_komentarId: { userId: user.id, komentarId } },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // Remove vote (toggle off)
        await prisma.$transaction([
          prisma.komentarVote.delete({
            where: { userId_komentarId: { userId: user.id, komentarId } },
          }),
          prisma.komentarSoal.update({
            where: { id: komentarId },
            data: value === 1
              ? { upvotes: { decrement: 1 } }
              : { downvotes: { decrement: 1 } },
          }),
        ]);
        return NextResponse.json({ success: true, action: "removed" });
      } else {
        // Change vote
        await prisma.$transaction([
          prisma.komentarVote.update({
            where: { userId_komentarId: { userId: user.id, komentarId } },
            data: { value },
          }),
          prisma.komentarSoal.update({
            where: { id: komentarId },
            data: value === 1
              ? { upvotes: { increment: 1 }, downvotes: { decrement: 1 } }
              : { upvotes: { decrement: 1 }, downvotes: { increment: 1 } },
          }),
        ]);
        return NextResponse.json({ success: true, action: "changed" });
      }
    }

    // New vote
    await prisma.$transaction([
      prisma.komentarVote.create({
        data: { userId: user.id, komentarId, value },
      }),
      prisma.komentarSoal.update({
        where: { id: komentarId },
        data: value === 1
          ? { upvotes: { increment: 1 } }
          : { downvotes: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, action: "voted" });
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
