import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/materi
 * Returns learning modules filtered by topikId or all.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topikId = searchParams.get("topikId");
    const mapelId = searchParams.get("mapelId");

    const whereClause: Record<string, unknown> = {};
    if (topikId) whereClause.topikId = parseInt(topikId);
    if (mapelId) whereClause.topik = { mapelId: parseInt(mapelId) };

    const moduls = await prisma.materiModul.findMany({
      where: whereClause,
      include: {
        topik: {
          select: {
            id: true,
            nama: true,
            slug: true,
            mapel: { select: { id: true, kode: true, nama: true, warna: true } },
          },
        },
        _count: { select: { konten: true } },
      },
      orderBy: { urutan: "asc" },
    });

    return NextResponse.json({ success: true, data: moduls });
  } catch (error) {
    console.error("Error fetching materi:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
