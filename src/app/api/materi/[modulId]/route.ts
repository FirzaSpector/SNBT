import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/materi/[modulId]
 * Returns full module with all content items.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ modulId: string }> }
) {
  try {
    const { modulId } = await params;

    const modul = await prisma.materiModul.findUnique({
      where: { id: modulId },
      include: {
        topik: {
          select: {
            id: true,
            nama: true,
            slug: true,
            mapel: { select: { id: true, kode: true, nama: true, warna: true } },
          },
        },
        konten: {
          orderBy: { urutan: "asc" },
        },
      },
    });

    if (!modul) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: modul });
  } catch (error) {
    console.error("Error fetching module:", error);
    return NextResponse.json({ error: "Failed to fetch module" }, { status: 500 });
  }
}
