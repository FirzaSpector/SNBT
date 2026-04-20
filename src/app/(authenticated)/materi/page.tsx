import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { BookOpen, ChevronRight, Clock, FileText, Play, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Materi Belajar",
  description: "Pelajari materi SNBT dari dasar — teks, video, dan rangkuman PDF.",
};

export default async function MateriPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { subscriptionTier: true },
  });

  // Get all modules grouped by mapel/topik
  const mapelList = await prisma.mataPelajaran.findMany({
    include: {
      topik: {
        include: {
          materiModul: {
            include: {
              _count: { select: { konten: true } },
            },
            orderBy: { urutan: "asc" },
          },
        },
        orderBy: { urutan: "asc" },
      },
    },
    orderBy: { id: "asc" },
  });

  const isPro = profile?.subscriptionTier !== "free";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-800 text-text-primary mb-2">
          📚 Materi Belajar
        </h1>
        <p className="text-text-secondary">
          Pelajari konsep dasar sebelum mengerjakan soal. Modul disusun per topik dengan teks, video, dan rangkuman.
        </p>
      </div>

      {/* Content per mapel */}
      <div className="space-y-8">
        {mapelList.map((mapel) => {
          const totalModuls = mapel.topik.reduce((sum, t) => sum + t.materiModul.length, 0);
          if (totalModuls === 0) return null;

          return (
            <div key={mapel.id}>
              {/* Mapel header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: mapel.warna ?? "#4F46E5" }}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-700 text-lg text-text-primary">{mapel.nama}</h2>
                  <p className="text-xs text-text-muted">{totalModuls} modul tersedia</p>
                </div>
              </div>

              {/* Topics with modules */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mapel.topik.map((topik) =>
                  topik.materiModul.map((modul) => {
                    const isLocked = modul.isPremium && !isPro;

                    const cardContent = (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${mapel.warna ?? "#4F46E5"}15` }}
                          >
                            <FileText className="w-5 h-5" style={{ color: mapel.warna ?? "#4F46E5" }} />
                          </div>
                          {modul.isPremium && (
                            <span className="bg-accent-light text-accent text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Lock className="w-3 h-3" /> PRO
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading font-700 text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {modul.judul}
                        </h3>
                        <p className="text-xs text-text-muted mb-3">{topik.nama}</p>
                        {modul.deskripsi && (
                          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                            {modul.deskripsi}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {modul._count.konten} konten
                          </span>
                        </div>
                      </>
                    );

                    if (isLocked) {
                      return (
                        <div
                          key={modul.id}
                          className="card p-5 opacity-60 cursor-not-allowed"
                        >
                          {cardContent}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={modul.id}
                        href={`/materi/${modul.id}`}
                        className="card p-5 group transition-all duration-200 hover:shadow-lg hover:border-primary/30"
                      >
                        {cardContent}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
