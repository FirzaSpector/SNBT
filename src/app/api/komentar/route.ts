import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * GET /api/komentar?soalId=xxx
 * Returns comments for a question, ordered by votes.
 */
export async function GET(request: NextRequest) {
  try {
    const soalId = request.nextUrl.searchParams.get("soalId");
    if (!soalId) {
      return NextResponse.json({ error: "soalId is required" }, { status: 400 });
    }

    const comments = await prisma.komentarSoal.findMany({
      where: { soalId, parentId: null }, // Only top-level comments
      include: {
        user: {
          select: { id: true, username: true, fullName: true, avatarUrl: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, username: true, fullName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { upvotes: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

/**
 * POST /api/komentar
 * Create a new comment.
 * body: { soalId: string, konten: string, parentId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { soalId, konten, parentId } = await request.json();
    
    // Zod validation
    const schema = z.object({
      soalId: z.string().uuid(),
      konten: z.string().min(1, "Komentar tidak boleh kosong").max(2000, "Maksimal 2000 karakter"),
      parentId: z.string().uuid().optional().nullable(),
    });

    const parsed = schema.safeParse({ soalId, konten, parentId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const comment = await prisma.komentarSoal.create({
      data: {
        soalId,
        userId: user.id,
        konten,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
