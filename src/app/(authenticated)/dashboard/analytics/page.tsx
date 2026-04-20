import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, Target, CheckCircle, TrendingUp, BrainCircuit } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Analitik Diri",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Compile detailed stats per mapel
  const mapelStatData = await prisma.mataPelajaran.findMany({
    include: {
      sesiLatihan: {
        where: { userId: user.id },
      }
    }
  });

  const analytics = mapelStatData.map((mapel) => {
    let totalSoal = 0;
    let totalBenar = 0;
    
    mapel.sesiLatihan.forEach(s => {
      const dikerjakan = s.soalBenar + s.soalSalah + s.soalSkip;
      totalSoal += dikerjakan;
      totalBenar += s.soalBenar;
    });

    const akurasi = totalSoal > 0 ? Math.round((totalBenar / totalSoal) * 100) : 0;
    
    return {
      kode: mapel.kode,
      nama: mapel.nama,
      warna: mapel.warna || "#4F46E5",
      totalSoal,
      totalBenar,
      akurasi
    };
  }).filter(m => m.totalSoal > 0).sort((a,b) => b.totalSoal - a.totalSoal);

  const overallDikerjakan = analytics.reduce((acc, curr) => acc + curr.totalSoal, 0);
  const overallBenar = analytics.reduce((acc, curr) => acc + curr.totalBenar, 0);
  const overallAkurasi = overallDikerjakan > 0 ? Math.round((overallBenar / overallDikerjakan) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-800 text-text-primary mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Laporan Kinerja Belajar
          </h1>
          <p className="text-text-secondary">
            Analisis terperinci terkait kekuatan dan kelemahan kamu.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-primary hover:underline">
          &larr; Kembali
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-l-primary">
          <div className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" /> Soal Dikerjakan
          </div>
          <div className="font-heading text-3xl font-800 text-text-primary">
            {overallDikerjakan.toLocaleString('id')}
          </div>
        </div>
        <div className="card p-6 border-l-4 border-l-success">
          <div className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-success" /> Akurasi Rata-rata
          </div>
          <div className="font-heading text-3xl font-800 text-text-primary">
            {overallAkurasi}%
          </div>
        </div>
        <div className="card p-6 border-l-4 border-l-accent">
          <div className="text-sm font-medium text-text-secondary mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Prediksi Kekuatan
          </div>
          <div className="font-heading text-xl font-800 text-text-primary mt-1">
            {analytics.length > 0 && analytics[0].akurasi > 60 ? analytics[0].nama : "Masih perlu latihan"}
          </div>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          Akurasi per Mata Pelajaran
        </h2>

        {analytics.length > 0 ? (
          <div className="space-y-6">
            {analytics.map(stat => (
              <div key={stat.kode}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="font-semibold text-text-primary">{stat.nama}</span>
                    <span className="text-xs text-text-muted ml-2">({stat.totalSoal} soal)</span>
                  </div>
                  <div className="font-bold text-sm" style={{ color: stat.warna }}>
                    {stat.akurasi}%
                  </div>
                </div>
                <div className="w-full h-3 bg-surface border border-border rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${stat.akurasi}%`, backgroundColor: stat.warna }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-text-secondary">
            Belum ada data latihan yang cukup untuk dianalisa. Coba kerjakan beberapa soal dulu!
          </div>
        )}
      </div>

    </div>
  );
}
