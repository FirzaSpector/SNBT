import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { BookOpen, ChevronRight, Filter } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Latihan Soal",
  description: "Latihan soal SNBT adaptif berdasarkan kelemahanmu",
};

interface LatihanPageProps {
  searchParams: Promise<{ mapel?: string }>;
}

export default async function LatihanPage({ searchParams }: LatihanPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { mapel: selectedMapel } = await searchParams;

  // Ambil semua mata pelajaran dengan jumlah soal tersedia
  const mapelList = await prisma.mataPelajaran.findMany({
    include: {
      topik: {
        include: {
          _count: { select: { soal: { where: { isActive: true } } } },
        },
        orderBy: { urutan: "asc" },
      },
    },
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-800 text-text-primary mb-2">
          Pilih Materi Latihan
        </h1>
        <p className="text-text-secondary">
          Pilih mapel dan topik yang ingin kamu latih. Rekomendasi: mulai dari topik yang paling sering keluar di SNBT.
        </p>
      </div>

      {/* Grid Mata Pelajaran */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mapelList.map((mapel) => {
          const totalSoal = mapel.topik.reduce(
            (sum, t) => sum + t._count.soal,
            0
          );
          const isSelected = selectedMapel === mapel.kode;

          return (
            <div
              key={mapel.id}
              className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Header card mapel */}
              <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${mapel.warna ?? "#4F46E5"}15`,
                      color: mapel.warna ?? "#4F46E5",
                    }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-0.5">
                      {mapel.kode}
                    </div>
                    <h2 className="font-heading font-bold text-[15px] text-gray-900 leading-tight">
                      {mapel.nama}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Daftar topik */}
              <div className="p-3">
                <div className="px-2 pb-2 mt-1 mb-2 flex items-center justify-between text-xs font-medium text-gray-500 border-b border-gray-50">
                  <span>Topik Tersedia ({mapel.topik.length})</span>
                  <span>{totalSoal} Soal</span>
                </div>
                
                <div className="space-y-1">
                  {mapel.topik.slice(0, 4).map((topik) => (
                    <Link
                      key={topik.id}
                      href={`/latihan/mulai?topikId=${topik.id}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                      id={`topik-${topik.slug}`}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors block truncate">
                          {topik.nama}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">
                          {topik._count.soal}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>

                {mapel.topik.length > 4 && (
                  <div className="text-center pt-2 pb-1">
                    <span className="text-xs font-medium text-gray-400">
                      +{mapel.topik.length - 4} topik lainnya
                    </span>
                  </div>
                )}

                {/* CTA Latihan Semua */}
                <div className="mt-4 px-2 pb-2">
                  <Link
                    href={`/latihan/mulai?mapelId=${mapel.id}`}
                    className="flex justify-center items-center w-full bg-primary/5 hover:bg-primary text-primary hover:text-white font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 group"
                    id={`latihan-semua-${mapel.kode.toLowerCase()}`}
                  >
                    Latihan Semua Topik
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
