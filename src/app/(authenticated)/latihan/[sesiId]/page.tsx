import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LatihanSession } from "@/components/question/LatihanSession";

export default async function LatihanSesiPage({
  params,
}: {
  params: Promise<{ sesiId: string }>;
}) {
  const { sesiId } = await params;
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil sesi beserta jawabannya (yang isinya referensi ke soal)
  const sesi = await prisma.sesiLatihan.findUnique({
    where: {
      id: sesiId,
      userId: user.id,
    },
    include: {
      mapel: true,
      jawabanUser: {
        include: {
          soal: {
            include: {
              pilihanJawaban: {
                orderBy: { urutan: "asc" },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc", 
        },
      },
    },
  });

  if (!sesi) {
    // Sesi tidak ditemukan atau bukan milik user ini
    redirect("/latihan");
  }

  if (sesi.isSelesai) {
    // Jika sesi sudah selesai, redirect ke halaman hasil
    redirect(`/latihan/${sesiId}/hasil`);
  }

  // Transform data dari `jawabanUser` ke format `SoalCBT[]`
  // Di sini jawabanUser sudah di-generate pada saat `mulai` (ideal). 
  // Jika soal belum ada di jawabanUser, kita perlu fetching berdasar topikIds, mapelId - tapi API /api/latihan/mulai seharusnya menghubungkan hal ini.
  
  // Karena saat ini API '/api/latihan/mulai' belum memasukkan dummy jawabanUser, 
  // kita lakukan query soal berdasar topikIds sesi ini.
  const soalList = await prisma.soal.findMany({
    where: {
      isActive: true,
      ...(sesi.topikIds.length > 0 ? { topikId: { in: sesi.topikIds } } : {}),
      ...(sesi.mapelId && sesi.topikIds.length === 0 ? { topik: { mapelId: sesi.mapelId } } : {}),
    },
    include: {
      pilihanJawaban: {
        orderBy: { urutan: "asc" },
      },
      pembahasan: true,
    },
    take: sesi.totalSoal > 0 ? sesi.totalSoal : 20,
  });

  // Map untuk LatihanSession (biarkan LatihanSession yang akan menambahkan state `status`, dll via useState, 
  // kalau mau implement resume, LatihanSession perlu modifikasi, tapi untuk sekarang kita lewatkan soal-soal ini)
  
  // Jika tidak ada soal, redirect kembali
  if (soalList.length === 0) {
    redirect("/latihan?error=no_questions");
  }

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-64px)] pb-20 sm:pb-0">
      <LatihanSession 
        soalList={soalList as any} 
        sesiId={sesi.id} 
        userId={user.id}
        mapelNama={sesi.mapel?.nama || "Latihan Bebas"}
      />
    </div>
  );
}
