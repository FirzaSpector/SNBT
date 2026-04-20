import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, FileText, Play, Download, Clock, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface ModulPageProps {
  params: Promise<{ modulId: string }>;
}

export async function generateMetadata({ params }: ModulPageProps): Promise<Metadata> {
  const { modulId } = await params;
  const modul = await prisma.materiModul.findUnique({
    where: { id: modulId },
    select: { judul: true, deskripsi: true },
  });
  return {
    title: modul?.judul || "Materi",
    description: modul?.deskripsi || "Modul pembelajaran SNBT",
  };
}

export default async function ModulDetailPage({ params }: ModulPageProps) {
  const { modulId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const modul = await prisma.materiModul.findUnique({
    where: { id: modulId },
    include: {
      topik: {
        select: {
          id: true,
          nama: true,
          mapel: { select: { id: true, kode: true, nama: true, warna: true } },
        },
      },
      konten: {
        orderBy: { urutan: "asc" },
      },
    },
  });

  if (!modul) notFound();

  const mapelColor = modul.topik?.mapel?.warna ?? "#4F46E5";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/materi" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Materi
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span style={{ color: mapelColor }}>{modul.topik?.mapel?.nama}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-text-primary font-medium">{modul.topik?.nama}</span>
      </nav>

      {/* Module header */}
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: mapelColor }}
          >
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-800 text-text-primary mb-2">
              {modul.judul}
            </h1>
            {modul.deskripsi && (
              <p className="text-text-secondary">{modul.deskripsi}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {modul.konten.length} bagian
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content sections */}
      <div className="space-y-8">
        {modul.konten.map((item, index) => (
          <section key={item.id} className="card p-6 sm:p-8">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: mapelColor }}
              >
                {index + 1}
              </div>
              <div className="flex items-center gap-2 flex-1">
                {item.tipe === "teks" && <FileText className="w-4 h-4 text-text-muted" />}
                {item.tipe === "video" && <Play className="w-4 h-4 text-red-500" />}
                {item.tipe === "pdf" && <Download className="w-4 h-4 text-blue-500" />}
                <h2 className="font-heading font-700 text-lg text-text-primary">{item.judul}</h2>
              </div>
              {item.durasiMenit && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.durasiMenit} menit
                </span>
              )}
            </div>

            {/* Text content */}
            {item.tipe === "teks" && item.konten && (
              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
                {item.konten}
              </div>
            )}

            {/* Video embed */}
            {item.tipe === "video" && item.videoUrl && (
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                {item.videoUrl.includes("youtube.com") || item.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={item.videoUrl.replace("watch?v=", "embed/")}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={item.judul}
                  />
                ) : (
                  <video src={item.videoUrl} controls className="w-full h-full" />
                )}
              </div>
            )}

            {/* PDF download */}
            {item.tipe === "pdf" && item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            )}
          </section>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <Link
          href="/materi"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Materi
        </Link>
        <Link
          href={`/latihan?topikId=${modul.topikId}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          Latihan Soal
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
