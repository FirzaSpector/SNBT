import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { 
  CheckCircle, 
  XCircle, 
  MinusCircle, 
  Award, 
  Clock, 
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { MathRenderer } from "@/components/question/MathRenderer";

export default async function HasilLatihanPage({
  params,
}: {
  params: { sesiId: string };
}) {
  const { sesiId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil data sesi latihan dan hasil yang sudah disimpan saat submit
  const sesi = await prisma.sesiLatihan.findUnique({
    where: { 
      id: sesiId,
      userId: user.id 
    },
    include: {
      mapel: true,
      jawabanUser: {
        include: {
          soal: {
            include: {
              pembahasan: true,
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  if (!sesi || !sesi.isSelesai) {
    redirect("/latihan");
  }

  // Hitung persentase akurasi
  const totalDiJawab = sesi.soalBenar + sesi.soalSalah;
  const akurasi = totalDiJawab > 0 ? Math.round((sesi.soalBenar / totalDiJawab) * 100) : 0;
  
  // Format durasi
  const menit = Math.floor((sesi.durasiDetik || 0) / 60);
  const detik = (sesi.durasiDetik || 0) % 60;
  const durasiFormatted = `${menit}m ${detik}s`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/dashboard"
          className="flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Dashboard
        </Link>
        <div className="text-sm text-text-muted font-medium bg-surface py-1.5 px-3 rounded-full border border-border">
          {sesi.mapel?.nama || "Latihan Bebas"}
        </div>
      </div>

      <div className="card p-8 mb-8 text-center bg-gradient-to-br from-primary-light to-white border border-primary/20">
        <h1 className="font-heading text-2xl font-800 text-text-primary mb-2">
          Sesi Latihan Selesai! 🎉
        </h1>
        <p className="text-text-secondary mb-8">Kerja bagus! Berikut statistik dari sesi latihanmu kali ini.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="text-sm font-medium text-text-muted mb-1 flex justify-center items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" /> Benar
            </div>
            <div className="text-3xl font-heading font-700 text-success">{sesi.soalBenar}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="text-sm font-medium text-text-muted mb-1 flex justify-center items-center gap-1">
              <XCircle className="w-4 h-4 text-danger" /> Salah
            </div>
            <div className="text-3xl font-heading font-700 text-danger">{sesi.soalSalah}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="text-sm font-medium text-text-muted mb-1 flex justify-center items-center gap-1">
              <MinusCircle className="w-4 h-4 text-text-muted" /> Dilewati
            </div>
            <div className="text-3xl font-heading font-700 text-text-primary">{sesi.soalSkip}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
            <div className="text-sm font-medium text-text-muted mb-1 flex justify-center items-center gap-1">
              <Clock className="w-4 h-4 text-primary" /> Durasi
            </div>
            <div className="text-2xl font-heading font-700 text-primary mt-1">{durasiFormatted}</div>
          </div>
        </div>

        {/* Akurasi & XP */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-xs text-text-muted font-medium">Akurasi</div>
              <div className="text-lg font-heading font-700 text-blue-700">{akurasi}%</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-border shadow-sm">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-light text-accent">
              <span className="font-bold font-heading">XP</span>
            </div>
            <div className="text-left">
              <div className="text-xs text-text-muted font-medium">XP Didapat</div>
              <div className="text-lg font-heading font-700 text-accent">+{sesi.xpEarned}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-700 text-text-primary">
          Review Jawaban
        </h2>
        <Link 
          href="/latihan"
          className="inline-flex items-center gap-2 bg-primary text-white font-medium px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-colors text-sm shadow-sm hover:shadow"
        >
          Latihan Lagi
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* List Review */}
      <div className="space-y-6">
        {sesi.jawabanUser.map((jawaban, idx) => {
          let sttClass = "border-border";
          let icon = <MinusCircle className="w-5 h-5 text-text-muted" />;
          
          if (jawaban.isCorrect === true) {
            sttClass = "border-success bg-success/5";
            icon = <CheckCircle className="w-5 h-5 text-success" />;
          } else if (jawaban.isCorrect === false) {
            sttClass = "border-danger bg-danger/5";
            icon = <XCircle className="w-5 h-5 text-danger" />;
          }

          return (
            <div key={jawaban.id} className={`card p-6 border ${sttClass}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="mt-1">{icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text-muted mb-2">Soal {idx + 1}</div>
                  <div className="content-math text-text-primary space-y-2 text-base">
                    <MathRenderer content={jawaban.soal.konten} />
                  </div>
                </div>
              </div>
              
              <div className="ml-9 p-4 rounded-xl bg-white border border-border shadow-sm">
                <div className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-primary">
                  Jawaban Kamu: 
                  <span className={`px-2.5 py-0.5 rounded-md text-base ${
                    jawaban.isCorrect ? "bg-success/20 text-success" : 
                    (jawaban.jawabanDipilih ? "bg-danger/20 text-danger" : "bg-surface text-text-muted")
                  }`}>
                    {jawaban.jawabanDipilih || "Lewati"}
                  </span>
                </div>
                {jawaban.soal.pembahasan && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="text-xs uppercase font-bold text-primary mb-2 tracking-wider">
                      Pembahasan
                    </div>
                    <div className="text-sm text-text-secondary content-math leading-relaxed">
                      <MathRenderer content={jawaban.soal.pembahasan.kontenTeks} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {sesi.jawabanUser.length === 0 && (
          <div className="text-center py-10 card border-dashed">
            <h3 className="text-text-primary font-medium">Belum ada soal yang dijawab.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
