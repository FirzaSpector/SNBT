import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/universitas
 * 
 * Returns all universities with their study programs.
 * Used for dropdowns in profile setup.
 */
import { unstable_cache } from "next/cache";

const getCachedUniversitas = unstable_cache(
  async () => {
    return prisma.universitasPTN.findMany({
      include: {
        prodi: {
          orderBy: { nama: "asc" },
          select: {
            id: true,
            kode: true,
            nama: true,
            jenjang: true,
            rumpun: true,
            dayaTampung: true,
            passingGrade: true,
          },
        },
      },
      orderBy: { nama: "asc" },
    });
  },
  ["universitas-prodi-list-v3"],
  { revalidate: 86400 } // cache for 24 hours
);

export async function GET() {
  try {
    const universitas = await getCachedUniversitas();

    return NextResponse.json({ success: true, data: universitas });
  } catch (error) {
    console.error("Error fetching universitas:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}
