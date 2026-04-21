import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ============================================================
// HELPER: Buat soal dengan pilihan jawaban dan pembahasan
// ============================================================
interface SoalData {
  topikId: number;
  konten: string;
  tingkatKesulitan: number;
  tahun?: number;
  sumber?: string;
  isPremium?: boolean;
  pilihan: { label: string; konten: string; isCorrect?: boolean }[];
  pembahasan: {
    kontenTeks: string;
    poinPenting: string[];
    rumusTerkait: string[];
  };
}

async function buatSoal(data: SoalData) {
  return prisma.soal.create({
    data: {
      topikId: data.topikId,
      konten: data.konten,
      tingkatKesulitan: data.tingkatKesulitan,
      tahun: data.tahun,
      sumber: data.sumber,
      isPremium: data.isPremium ?? false,
      pilihanJawaban: {
        create: data.pilihan.map((p, i) => ({
          label: p.label,
          konten: p.konten,
          isCorrect: p.isCorrect ?? false,
          urutan: i + 1,
        })),
      },
      pembahasan: {
        create: {
          kontenTeks: data.pembahasan.kontenTeks,
          poinPenting: data.pembahasan.poinPenting,
          rumusTerkait: data.pembahasan.rumusTerkait,
        },
      },
    },
  });
}

async function main() {
  console.log("🚀 Memulai proses seeding database lengkap...\n");

  // ============================================================
  // 1. MATA PELAJARAN
  // ============================================================
  console.log("📚 Seeding Mata Pelajaran...");

  const tps = await prisma.mataPelajaran.upsert({
    where: { kode: "TPS" },
    update: {},
    create: {
      kode: "TPS",
      nama: "Tes Potensi Skolastik",
      deskripsi: "Mengukur kemampuan kognitif, penalaran logis, dan pemahaman umum.",
      icon: "Brain",
      warna: "#4F46E5",
    },
  });

  const mat = await prisma.mataPelajaran.upsert({
    where: { kode: "MAT" },
    update: {},
    create: {
      kode: "MAT",
      nama: "Penalaran Matematika",
      deskripsi: "Mengukur kemampuan menggunakan matematika secara logis dan kontekstual.",
      icon: "FunctionSquare",
      warna: "#8B5CF6",
    },
  });

  const lbi = await prisma.mataPelajaran.upsert({
    where: { kode: "LBI" },
    update: {},
    create: {
      kode: "LBI",
      nama: "Literasi Bahasa Indonesia",
      deskripsi: "Mengukur kemampuan memahami, menganalisis, dan mengevaluasi teks berbahasa Indonesia.",
      icon: "BookOpen",
      warna: "#EC4899",
    },
  });

  const lbe = await prisma.mataPelajaran.upsert({
    where: { kode: "LBE" },
    update: {},
    create: {
      kode: "LBE",
      nama: "Literasi Bahasa Inggris",
      deskripsi: "Mengukur kemampuan memahami dan menganalisis teks berbahasa Inggris.",
      icon: "Globe",
      warna: "#14B8A6",
    },
  });

  // ============================================================
  // 2. TOPIK
  // ============================================================
  console.log("📋 Seeding Topik...");

  // --- TPS Topik ---
  const topikPU = await prisma.topik.upsert({
    where: { slug: "penalaran-umum" },
    update: {},
    create: { mapelId: tps.id, nama: "Penalaran Umum", slug: "penalaran-umum", deskripsi: "Kemampuan berpikir logis dan membuat kesimpulan.", urutan: 1 },
  });

  const topikPK = await prisma.topik.upsert({
    where: { slug: "pengetahuan-kuantitatif" },
    update: {},
    create: { mapelId: tps.id, nama: "Pengetahuan Kuantitatif", slug: "pengetahuan-kuantitatif", deskripsi: "Pengetahuan tentang konsep bilangan dan kuantitas.", urutan: 2 },
  });

  const topikPPU = await prisma.topik.upsert({
    where: { slug: "pengetahuan-pemahaman-umum" },
    update: {},
    create: { mapelId: tps.id, nama: "Pengetahuan & Pemahaman Umum", slug: "pengetahuan-pemahaman-umum", deskripsi: "Kemampuan memahami dan menganalisis informasi umum.", urutan: 3 },
  });

  const topikPBM = await prisma.topik.upsert({
    where: { slug: "pemahaman-bacaan-menulis" },
    update: {},
    create: { mapelId: tps.id, nama: "Pemahaman Bacaan & Menulis", slug: "pemahaman-bacaan-menulis", deskripsi: "Kemampuan memahami bacaan dan kaidah penulisan.", urutan: 4 },
  });

  // --- Matematika Topik ---
  const topikAljabar = await prisma.topik.upsert({
    where: { slug: "aljabar" },
    update: {},
    create: { mapelId: mat.id, nama: "Aljabar", slug: "aljabar", deskripsi: "Persamaan, pertidaksamaan, dan fungsi.", urutan: 1 },
  });

  const topikGeometri = await prisma.topik.upsert({
    where: { slug: "geometri" },
    update: {},
    create: { mapelId: mat.id, nama: "Geometri", slug: "geometri", deskripsi: "Bangun datar, bangun ruang, dan transformasi.", urutan: 2 },
  });

  const topikAritmatika = await prisma.topik.upsert({
    where: { slug: "aritmatika-sosial" },
    update: {},
    create: { mapelId: mat.id, nama: "Aritmatika Sosial", slug: "aritmatika-sosial", deskripsi: "Diskon, bunga, pajak, dan untung rugi.", urutan: 3 },
  });

  const topikStatistika = await prisma.topik.upsert({
    where: { slug: "statistika-peluang" },
    update: {},
    create: { mapelId: mat.id, nama: "Statistika & Peluang", slug: "statistika-peluang", deskripsi: "Mean, median, modus, dan probabilitas.", urutan: 4 },
  });

  const topikBarisan = await prisma.topik.upsert({
    where: { slug: "barisan-deret" },
    update: {},
    create: { mapelId: mat.id, nama: "Barisan & Deret", slug: "barisan-deret", deskripsi: "Barisan aritmetika, geometri, dan deret.", urutan: 5 },
  });

  // --- Literasi B. Indonesia Topik ---
  const topikIdePokok = await prisma.topik.upsert({
    where: { slug: "ide-pokok-simpulan" },
    update: {},
    create: { mapelId: lbi.id, nama: "Ide Pokok & Simpulan", slug: "ide-pokok-simpulan", deskripsi: "Menentukan ide pokok dan menarik simpulan dari teks.", urutan: 1 },
  });

  const topikMaknaKata = await prisma.topik.upsert({
    where: { slug: "makna-kata-kalimat" },
    update: {},
    create: { mapelId: lbi.id, nama: "Makna Kata & Kalimat", slug: "makna-kata-kalimat", deskripsi: "Memahami makna kata, frasa, dan kalimat dalam konteks.", urutan: 2 },
  });

  const topikAnalisisTeks = await prisma.topik.upsert({
    where: { slug: "analisis-teks" },
    update: {},
    create: { mapelId: lbi.id, nama: "Analisis & Evaluasi Teks", slug: "analisis-teks", deskripsi: "Menganalisis struktur, argumen, dan kelemahan teks.", urutan: 3 },
  });

  // --- Literasi B. Inggris Topik ---
  const topikReadingComp = await prisma.topik.upsert({
    where: { slug: "reading-comprehension" },
    update: {},
    create: { mapelId: lbe.id, nama: "Reading Comprehension", slug: "reading-comprehension", deskripsi: "Understanding main ideas and details in English texts.", urutan: 1 },
  });

  const topikVocabContext = await prisma.topik.upsert({
    where: { slug: "vocabulary-in-context" },
    update: {},
    create: { mapelId: lbe.id, nama: "Vocabulary in Context", slug: "vocabulary-in-context", deskripsi: "Inferring meaning of words from context.", urutan: 2 },
  });

  const topikInference = await prisma.topik.upsert({
    where: { slug: "inference-analysis" },
    update: {},
    create: { mapelId: lbe.id, nama: "Inference & Analysis", slug: "inference-analysis", deskripsi: "Drawing conclusions and analyzing arguments.", urutan: 3 },
  });

  // ============================================================
  // 3. SOAL — Lengkap per topik (existing soal preserved via create)
  // ============================================================
  console.log("📝 Seeding Soal...\n");

  // Check if soal already exist to avoid duplicates
  const existingSoalCount = await prisma.soal.count();
  if (existingSoalCount > 0) {
    console.log(`  ℹ️  ${existingSoalCount} soal sudah ada, skip seeding soal.\n`);
  } else {
    // ============================
    // TPS — PENALARAN UMUM (8 soal)
    // ============================
    console.log("  → TPS: Penalaran Umum");

    await buatSoal({
      topikId: topikPU.id,
      konten: "Semua kucing adalah mamalia.\nSebagian hewan peliharaan adalah kucing.\n\nSimpulan yang tepat adalah...",
      tingkatKesulitan: 1, tahun: 2024, sumber: "SNBT 2024",
      pilihan: [
        { label: "A", konten: "Semua hewan peliharaan adalah mamalia." },
        { label: "B", konten: "Sebagian mamalia adalah hewan peliharaan.", isCorrect: true },
        { label: "C", konten: "Semua mamalia adalah kucing." },
        { label: "D", konten: "Sebagian kucing bukan hewan peliharaan." },
        { label: "E", konten: "Tidak ada kucing yang mamalia." },
      ],
      pembahasan: {
        kontenTeks: "Premis 1: Semua kucing ⊂ mamalia (Universal Positif).\nPremis 2: Sebagian hewan peliharaan ∩ kucing (Partikular Positif).\n\nKarena sebagian hewan peliharaan adalah kucing, dan semua kucing adalah mamalia, maka sebagian hewan peliharaan adalah mamalia. Ini ekuivalen dengan: **sebagian mamalia adalah hewan peliharaan**.",
        poinPenting: ["Jika ada premis 'sebagian', kesimpulan pasti partikular (sebagian)."],
        rumusTerkait: [],
      },
    });

    await buatSoal({
      topikId: topikPU.id,
      konten: "Jika hujan turun, maka jalanan basah.\nJalanan tidak basah.\n\nKesimpulan yang valid adalah...",
      tingkatKesulitan: 1, tahun: 2023, sumber: "SNBT 2023",
      pilihan: [
        { label: "A", konten: "Hujan turun." },
        { label: "B", konten: "Hujan tidak turun.", isCorrect: true },
        { label: "C", konten: "Jalanan basah." },
        { label: "D", konten: "Mungkin hujan turun." },
        { label: "E", konten: "Tidak dapat disimpulkan." },
      ],
      pembahasan: {
        kontenTeks: "Ini adalah penerapan **Modus Tollens**.\n\nJika $P \\\\rightarrow Q$ dan $\\\\neg Q$, maka $\\\\neg P$.\n\nP = Hujan turun, Q = Jalanan basah.\nDiketahui: $P \\\\rightarrow Q$ dan $\\\\neg Q$ (jalanan TIDAK basah).\nKesimpulan: $\\\\neg P$ — Hujan TIDAK turun.",
        poinPenting: ["Modus Tollens: Jika P→Q dan ¬Q, maka ¬Q → ¬P."],
        rumusTerkait: ["P \\\\rightarrow Q, \\\\neg Q \\\\vdash \\\\neg P"],
      },
    });

    await buatSoal({
      topikId: topikPU.id,
      konten: "Perhatikan pola berikut:\n2, 6, 18, 54, ...\n\nBilangan selanjutnya adalah...",
      tingkatKesulitan: 1, tahun: 2024, sumber: "SNBT 2024",
      pilihan: [
        { label: "A", konten: "108" },
        { label: "B", konten: "162", isCorrect: true },
        { label: "C", konten: "148" },
        { label: "D", konten: "180" },
        { label: "E", konten: "216" },
      ],
      pembahasan: {
        kontenTeks: "Polanya adalah barisan geometri dengan rasio $r = 3$.\n\n$2 \\\\times 3 = 6$\n$6 \\\\times 3 = 18$\n$18 \\\\times 3 = 54$\n$54 \\\\times 3 = \\\\mathbf{162}$",
        poinPenting: ["Identifikasi rasio tetap antar suku berurutan untuk mengenali barisan geometri."],
        rumusTerkait: ["U_n = a \\\\cdot r^{n-1}"],
      },
    });

    await buatSoal({
      topikId: topikPU.id,
      konten: "Andi lebih tua dari Budi. Cici lebih muda dari Budi. Dedi seumuran dengan Andi. Siapa yang paling muda?",
      tingkatKesulitan: 1, tahun: 2023, sumber: "SNBT 2023",
      pilihan: [
        { label: "A", konten: "Andi" },
        { label: "B", konten: "Budi" },
        { label: "C", konten: "Cici", isCorrect: true },
        { label: "D", konten: "Dedi" },
        { label: "E", konten: "Andi dan Dedi" },
      ],
      pembahasan: {
        kontenTeks: "Dari informasi yang diberikan:\n- Andi > Budi (Andi lebih tua)\n- Cici < Budi (Cici lebih muda)\n- Dedi = Andi\n\nUrutan dari tua ke muda: Andi = Dedi > Budi > **Cici**.\nJadi Cici paling muda.",
        poinPenting: ["Susun urutan dari informasi parsial yang diberikan."],
        rumusTerkait: [],
      },
    });

    // ============================
    // MATEMATIKA — ALJABAR (4 soal)
    // ============================
    console.log("  → Matematika: Aljabar");

    await buatSoal({
      topikId: topikAljabar.id,
      konten: "Himpunan penyelesaian dari pertidaksamaan $2x - 3 > 7$ adalah...",
      tingkatKesulitan: 1, tahun: 2024, sumber: "SNBT 2024",
      pilihan: [
        { label: "A", konten: "$x > 2$" },
        { label: "B", konten: "$x > 5$", isCorrect: true },
        { label: "C", konten: "$x < 5$" },
        { label: "D", konten: "$x > 3$" },
        { label: "E", konten: "$x \\\\geq 5$" },
      ],
      pembahasan: {
        kontenTeks: "$2x - 3 > 7$\n$2x > 10$\n$x > 5$",
        poinPenting: ["Pertidaksamaan linear diselesaikan seperti persamaan, perhatikan tanda saat dikali/dibagi bilangan negatif."],
        rumusTerkait: [],
      },
    });

    await buatSoal({
      topikId: topikAljabar.id,
      konten: "Akar-akar persamaan kuadrat $x^2 - 7x + 12 = 0$ adalah...",
      tingkatKesulitan: 2, tahun: 2023, sumber: "UTBK 2023",
      pilihan: [
        { label: "A", konten: "$2$ dan $6$" },
        { label: "B", konten: "$3$ dan $4$", isCorrect: true },
        { label: "C", konten: "$-3$ dan $-4$" },
        { label: "D", konten: "$1$ dan $12$" },
        { label: "E", konten: "$-2$ dan $-6$" },
      ],
      pembahasan: {
        kontenTeks: "Faktorkan: $(x-3)(x-4) = 0$\n\nAkar-akar: $x = 3$ atau $x = 4$.",
        poinPenting: ["Cari faktor dari c yang jumlahnya = -b/a."],
        rumusTerkait: ["x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}"],
      },
    });

    // ============================
    // LITERASI B. INDONESIA (2 soal)
    // ============================
    console.log("  → Literasi Bahasa Indonesia");

    await buatSoal({
      topikId: topikIdePokok.id,
      konten: "Bacalah paragraf berikut!\n\nPerubahan iklim telah menyebabkan kenaikan permukaan air laut secara global. Menurut data IPCC, dalam satu abad terakhir, permukaan laut telah naik sekitar 20 cm.\n\nIde pokok paragraf di atas adalah...",
      tingkatKesulitan: 1, tahun: 2024, sumber: "SNBT 2024",
      pilihan: [
        { label: "A", konten: "Data IPCC tentang permukaan laut." },
        { label: "B", konten: "Kota pesisir sering mengalami banjir." },
        { label: "C", konten: "Dampak perubahan iklim terhadap kenaikan permukaan air laut.", isCorrect: true },
        { label: "D", konten: "Cara mengatasi banjir di kota pesisir." },
        { label: "E", konten: "Tren kenaikan suhu global." },
      ],
      pembahasan: {
        kontenTeks: "Ide pokok terletak di kalimat pertama (deduktif): \"Perubahan iklim telah menyebabkan kenaikan permukaan air laut secara global.\"",
        poinPenting: ["Ide pokok biasanya ada di kalimat pertama (deduktif) atau terakhir (induktif)."],
        rumusTerkait: [],
      },
    });

    await buatSoal({
      topikId: topikAnalisisTeks.id,
      konten: "Kalimat efektif yang sesuai dengan kaidah kebahasaan Indonesia adalah...",
      tingkatKesulitan: 2, tahun: 2023, sumber: "SNBT 2023",
      pilihan: [
        { label: "A", konten: "Para siswa-siswa sedang belajar di perpustakaan." },
        { label: "B", konten: "Dia menerangkan tentang pentingnya pendidikan." },
        { label: "C", konten: "Kami membahas masalah yang berkaitan dengan lingkungan hidup.", isCorrect: true },
        { label: "D", konten: "Banyak anak-anak bermain di taman." },
        { label: "E", konten: "Para hadirin dimohon untuk berdiri." },
      ],
      pembahasan: {
        kontenTeks: "Pilihan C sudah memenuhi syarat kalimat efektif: hemat, logis, dan tidak ada pleonasme.",
        poinPenting: ["Hindari pengulangan makna (pleonasme) seperti 'para siswa-siswa'."],
        rumusTerkait: [],
      },
    });

    // ============================
    // LITERASI B. INGGRIS (2 soal)
    // ============================
    console.log("  → Literasi Bahasa Inggris");

    await buatSoal({
      topikId: topikReadingComp.id,
      konten: "Read the following passage:\n\nThe Amazon rainforest produces approximately 20% of the world's oxygen. However, deforestation has reduced its area by nearly 17% over the past 50 years.\n\nWhat is the main concern expressed in the passage?",
      tingkatKesulitan: 1, tahun: 2024, sumber: "SNBT 2024",
      pilihan: [
        { label: "A", konten: "The Amazon is the largest forest." },
        { label: "B", konten: "Deforestation threatens a major oxygen source.", isCorrect: true },
        { label: "C", konten: "Oxygen levels are declining worldwide." },
        { label: "D", konten: "Governments must protect forests." },
        { label: "E", konten: "The Amazon covers 20% of Earth." },
      ],
      pembahasan: {
        kontenTeks: "The passage highlights two contrasting facts: the Amazon's role in oxygen production (20%) and the threat of deforestation (17% reduction). The main concern is that deforestation threatens this major oxygen source.",
        poinPenting: ["Identify contrast signals like 'however' to find the main concern."],
        rumusTerkait: [],
      },
    });

    await buatSoal({
      topikId: topikVocabContext.id,
      konten: "The word 'ubiquitous' in the sentence 'Smartphones have become ubiquitous in modern society' most nearly means...",
      tingkatKesulitan: 2, tahun: 2023, sumber: "SNBT 2023",
      pilihan: [
        { label: "A", konten: "expensive" },
        { label: "B", konten: "dangerous" },
        { label: "C", konten: "everywhere", isCorrect: true },
        { label: "D", konten: "complicated" },
        { label: "E", konten: "unnecessary" },
      ],
      pembahasan: {
        kontenTeks: "'Ubiquitous' means existing or being everywhere at the same time. In context, it describes how smartphones are found everywhere in modern society.",
        poinPenting: ["Use context clues to infer meaning of unfamiliar words."],
        rumusTerkait: [],
      },
    });
  }

  // ============================================================
  // 4. BADGES
  // ============================================================
  console.log("🏆 Seeding Badges...");

  const badgesData = [
    { kode: "first_login", nama: "Selamat Datang!", deskripsi: "Login pertama kali ke platform.", icon: "Star", warna: "#F59E0B", xpReward: 10, kondisi: { type: "first_login" } },
    { kode: "first_session", nama: "Langkah Pertama", deskripsi: "Menyelesaikan sesi latihan pertama.", icon: "Zap", warna: "#8B5CF6", xpReward: 25, kondisi: { type: "first_session" } },
    { kode: "streak_3", nama: "Konsisten!", deskripsi: "Streak 3 hari berturut-turut.", icon: "Flame", warna: "#EF4444", xpReward: 50, kondisi: { type: "streak", value: 3 } },
    { kode: "streak_7", nama: "Semangat Membara!", deskripsi: "Streak 7 hari berturut-turut.", icon: "Flame", warna: "#F97316", xpReward: 100, kondisi: { type: "streak", value: 7 } },
    { kode: "streak_30", nama: "Pejuang Sejati!", deskripsi: "Streak 30 hari berturut-turut.", icon: "Trophy", warna: "#EAB308", xpReward: 500, kondisi: { type: "streak", value: 30 } },
    { kode: "soal_50", nama: "Rajin Berlatih", deskripsi: "Mengerjakan 50 soal.", icon: "BookOpen", warna: "#3B82F6", xpReward: 50, kondisi: { type: "total_soal", value: 50 } },
    { kode: "soal_500", nama: "Mesin Soal", deskripsi: "Mengerjakan 500 soal.", icon: "Award", warna: "#6366F1", xpReward: 200, kondisi: { type: "total_soal", value: 500 } },
    { kode: "akurasi_90", nama: "Otak Encer", deskripsi: "Akurasi 90%+ dalam minimal 20 soal.", icon: "Target", warna: "#10B981", xpReward: 150, kondisi: { type: "akurasi", value: 90, min_soal: 20 } },
  ];

  for (const badge of badgesData) {
    await prisma.badge.upsert({
      where: { kode: badge.kode },
      update: {},
      create: badge,
    });
  }

  // ============================================================
  // 5. UNIVERSITAS PTN — Master Data (Feature 2)
  // ============================================================
  console.log("🏛️  Seeding Universitas PTN...");

  // Force clean slate for Prodi to avoid duplicates/deprecated data from previous seeds
  await prisma.prodiPTN.deleteMany();

  const univDataPath = path.join(process.cwd(), 'prisma', 'data', 'universitas.json');
  const univDataRaw = fs.readFileSync(univDataPath, 'utf-8');
  const univData: { kode: string; nama: string; singkatan: string; kota: string }[] = JSON.parse(univDataRaw);

  const univMap: Record<string, number> = {};
  for (const u of univData) {
    const univ = await prisma.universitasPTN.upsert({
      where: { kode: u.kode },
      update: {},
      create: u,
    });
    univMap[u.kode] = univ.id;
  }

  // ============================================================
  // 6. PROGRAM STUDI PTN — dengan Passing Grade estimasi
  // ============================================================
  console.log("📖 Seeding Program Studi PTN...");

  const prodiDataPath = path.join(process.cwd(), 'prisma', 'data', 'prodi.json');
  const prodiDataRaw = fs.readFileSync(prodiDataPath, 'utf-8');
  const prodiData: { univKode: string; kode: string; nama: string; rumpun: string; dayaTampung: number; passingGrade: number }[] = JSON.parse(prodiDataRaw);

  const formattedProdiData = prodiData.map(p => {
    const univId = univMap[p.univKode];
    if (!univId) return null;
    return {
      univId,
      kode: p.kode,
      nama: p.nama,
      rumpun: p.rumpun,
      dayaTampung: p.dayaTampung,
      passingGrade: p.passingGrade,
    };
  }).filter(Boolean) as any[];

  // Execute in batches to avoid payload too large, skipped duplicates.
  const batchSize = 1000;
  for (let i = 0; i < formattedProdiData.length; i += batchSize) {
    const batch = formattedProdiData.slice(i, i + batchSize);
    await prisma.prodiPTN.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  // ============================================================
  // 7. EVENT TRYOUT (Feature 4)
  // ============================================================
  console.log("🎯 Seeding Event Tryout...");

  const now = new Date();
  const pastEvent = new Date(now);
  pastEvent.setDate(pastEvent.getDate() - 14);
  const pastEventEnd = new Date(pastEvent);
  pastEventEnd.setHours(pastEventEnd.getHours() + 4);

  const futureEvent = new Date(now);
  futureEvent.setDate(futureEvent.getDate() + 30);
  const futureEventEnd = new Date(futureEvent);
  futureEventEnd.setHours(futureEventEnd.getHours() + 4);

  const scoreRelease = new Date(pastEvent);
  scoreRelease.setDate(scoreRelease.getDate() + 3);
  scoreRelease.setHours(15, 0, 0, 0); // 3 PM WIB

  // Check existing events
  const existingEvents = await prisma.eventTryout.count();
  if (existingEvents === 0) {
    await prisma.eventTryout.create({
      data: {
        nama: "Tryout Akbar SNBT Nasional Vol. 1",
        deskripsi: "Tryout nasional pertama tahun 2026 dengan peringkat nasional. Ikuti dan ukur kemampuanmu bersama ribuan peserta dari seluruh Indonesia!",
        startDate: pastEvent,
        endDate: pastEventEnd,
        scoreReleaseAt: scoreRelease,
        isScorePublished: true,
        isPro: false,
        maxPeserta: 50000,
        totalSoal: 155,
        durasiMenit: 195,
      },
    });

    await prisma.eventTryout.create({
      data: {
        nama: "Tryout Akbar SNBT Nasional Vol. 2",
        deskripsi: "Grand tryout nasional kedua dengan soal prediksi terbaru! Ranking nasional dan analisis mendalam per subtest. Gratis untuk semua pengguna.",
        startDate: futureEvent,
        endDate: futureEventEnd,
        scoreReleaseAt: new Date(futureEventEnd.getTime() + 3 * 24 * 60 * 60 * 1000),
        isScorePublished: false,
        isPro: false,
        maxPeserta: 100000,
        totalSoal: 155,
        durasiMenit: 195,
      },
    });

    await prisma.eventTryout.create({
      data: {
        nama: "Tryout Premium — Prediksi SNBT 2026",
        deskripsi: "Paket soal eksklusif yang disusun oleh tim ahli berdasarkan tren soal SNBT terbaru. Termasuk pembahasan video per soal.",
        startDate: new Date(futureEvent.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureEvent.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        isScorePublished: false,
        isPro: true,
        maxPeserta: 5000,
        totalSoal: 155,
        durasiMenit: 195,
      },
    });
  }

  // ============================================================
  // 8. MATERI MODUL (Feature 5)
  // ============================================================
  console.log("📚 Seeding Materi Modul...");

  const existingModul = await prisma.materiModul.count();
  if (existingModul === 0) {
    // Modul Penalaran Umum
    const modulPU = await prisma.materiModul.create({
      data: {
        topikId: topikPU.id,
        judul: "Pengantar Penalaran Deduktif & Induktif",
        slug: "pengantar-penalaran-deduktif-induktif",
        deskripsi: "Pelajari dasar-dasar penalaran logis yang menjadi fondasi TPS SNBT. Modul ini mencakup silogisme, modus ponens, modus tollens, dan penalaran induktif.",
        urutan: 1,
        konten: {
          create: [
            {
              tipe: "teks",
              judul: "Apa itu Penalaran Deduktif?",
              konten: "## Penalaran Deduktif\n\nPenalaran deduktif adalah proses berpikir dari **premis umum** ke **kesimpulan khusus**. Jika premis-premisnya benar dan logikanya valid, maka kesimpulannya **pasti benar**.\n\n### Contoh Silogisme\n\n**Premis Mayor**: Semua mamalia bernapas dengan paru-paru.\n**Premis Minor**: Kucing adalah mamalia.\n**Kesimpulan**: Kucing bernapas dengan paru-paru. ✅\n\n### Modus Ponens\n\nJika $P \\rightarrow Q$ dan $P$ benar, maka $Q$ benar.\n\n**Contoh**:\n- Jika hujan turun (P), maka jalanan basah (Q).\n- Hujan turun (P benar).\n- Maka jalanan basah (Q benar). ✅\n\n### Modus Tollens\n\nJika $P \\rightarrow Q$ dan $\\neg Q$, maka $\\neg P$.\n\n**Contoh**:\n- Jika Raja mau ujian (P), maka dia belajar (Q).\n- Raja tidak belajar ($\\neg Q$).\n- Maka Raja tidak mau ujian ($\\neg P$). ✅",
              urutan: 1,
            },
            {
              tipe: "teks",
              judul: "Penalaran Induktif & Pola Bilangan",
              konten: "## Penalaran Induktif\n\nPenalaran induktif adalah proses berpikir dari **kasus-kasus khusus** ke **kesimpulan umum**. Kesimpulan induktif bersifat **probabilistik** (mungkin benar, tapi tidak pasti).\n\n### Mengenali Pola Bilangan\n\n**Barisan Aritmetika**: Selisih antar suku tetap.\n- 2, 5, 8, 11, 14, ... → beda = 3\n\n**Barisan Geometri**: Rasio antar suku tetap.\n- 3, 6, 12, 24, ... → rasio = 2\n\n**Barisan Fibonacci**: Setiap suku = jumlah dua suku sebelumnya.\n- 1, 1, 2, 3, 5, 8, 13, 21, ...\n\n### Tips SNBT\n\n1. Cek selisih dulu (aritmetika?).\n2. Cek rasio (geometri?).\n3. Cek pola selisih dari selisih (bertingkat?).\n4. Cek jumlah dua suku sebelumnya (Fibonacci?).",
              urutan: 2,
            },
            {
              tipe: "video",
              judul: "Video: Trik Cepat Penalaran Logis SNBT",
              videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              durasiMenit: 15,
              urutan: 3,
            },
          ],
        },
      },
    });

    // Modul Aljabar
    await prisma.materiModul.create({
      data: {
        topikId: topikAljabar.id,
        judul: "Fondasi Aljabar untuk SNBT",
        slug: "fondasi-aljabar-snbt",
        deskripsi: "Kuasai konsep dasar aljabar: persamaan linear, kuadrat, dan sistem persamaan yang sering muncul di SNBT.",
        urutan: 1,
        konten: {
          create: [
            {
              tipe: "teks",
              judul: "Persamaan Linear & Kuadrat",
              konten: "## Persamaan Linear\n\nBentuk umum: $ax + b = 0$\n\nPenyelesaian: $x = -\\frac{b}{a}$\n\n## Persamaan Kuadrat\n\nBentuk umum: $ax^2 + bx + c = 0$\n\n### Rumus ABC (Kuadratik)\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n### Diskriminan\n\n$D = b^2 - 4ac$\n\n- $D > 0$: Dua akar real berbeda.\n- $D = 0$: Satu akar real (kembar).\n- $D < 0$: Tidak ada akar real.\n\n### Teorema Vieta\n\nUntuk $ax^2 + bx + c = 0$ dengan akar $x_1$ dan $x_2$:\n- $x_1 + x_2 = -\\frac{b}{a}$\n- $x_1 \\cdot x_2 = \\frac{c}{a}$",
              urutan: 1,
            },
            {
              tipe: "teks",
              judul: "Sistem Persamaan Linear Dua Variabel",
              konten: "## SPLDV\n\nSistem persamaan linear dua variabel memiliki bentuk:\n$$\\begin{cases} a_1x + b_1y = c_1 \\\\ a_2x + b_2y = c_2 \\end{cases}$$\n\n### Metode Eliminasi\n\nSamakan koefisien salah satu variabel, lalu kurangkan persamaan.\n\n### Metode Substitusi\n\nNyatakan satu variabel dalam variabel lain, lalu substitusi.\n\n### Contoh\n\n$x + y = 10$ dan $2x - y = 5$\n\nEliminasi: $(x+y) + (2x-y) = 15 \\Rightarrow 3x = 15 \\Rightarrow x = 5$\n\nSubstitusi: $5 + y = 10 \\Rightarrow y = 5$",
              urutan: 2,
            },
          ],
        },
      },
    });

    // Modul Reading Comprehension
    await prisma.materiModul.create({
      data: {
        topikId: topikReadingComp.id,
        judul: "Mastering Reading Comprehension for SNBT",
        slug: "mastering-reading-comprehension-snbt",
        deskripsi: "Learn strategies for quickly identifying main ideas, supporting details, and author's purpose in English texts.",
        urutan: 1,
        konten: {
          create: [
            {
              tipe: "teks",
              judul: "Finding the Main Idea",
              konten: "## Main Idea Strategies\n\n### What is the Main Idea?\n\nThe main idea is the **central point** the author is trying to communicate. It answers the question: *\"What is this passage mostly about?\"*\n\n### How to Find It\n\n1. **Read the first and last sentences** of each paragraph.\n2. **Look for repeated words or concepts** — those are likely the topic.\n3. **Ask yourself**: What claim is the author making about the topic?\n\n### Common Traps\n\n- ❌ **Too specific**: A supporting detail, not the main idea.\n- ❌ **Too broad**: Covers more than what the passage discusses.\n- ✅ **Just right**: Captures the central point of the passage.\n\n### Practice Pattern\n\nFor SNBT English Literacy, passages are typically 150-300 words. You have about 2-3 minutes per question. **Skim first, then read carefully.**",
              urutan: 1,
            },
          ],
        },
      },
    });

    // Modul Ide Pokok B. Indonesia
    await prisma.materiModul.create({
      data: {
        topikId: topikIdePokok.id,
        judul: "Teknik Menemukan Ide Pokok & Simpulan",
        slug: "teknik-menemukan-ide-pokok-simpulan",
        deskripsi: "Pelajari cara cepat menemukan gagasan utama, simpulan, dan implikasi dari teks bacaan SNBT.",
        urutan: 1,
        konten: {
          create: [
            {
              tipe: "teks",
              judul: "Paragraf Deduktif vs Induktif",
              konten: "## Menentukan Ide Pokok\n\n### Paragraf Deduktif\n\nIde pokok di **awal paragraf** (kalimat pertama), diikuti kalimat-kalimat penjelas.\n\n**Contoh**:\n> *Indonesia memiliki keanekaragaman hayati yang luar biasa.* Terdapat lebih dari 17.000 spesies tumbuhan dan 300.000 spesies hewan. Hutan hujan tropiknya menjadi rumah bagi orangutan, harimau sumatera, dan ribuan spesies burung.\n\nIde pokok: Indonesia memiliki keanekaragaman hayati yang luar biasa.\n\n### Paragraf Induktif\n\nIde pokok di **akhir paragraf**, didahului oleh bukti/contoh.\n\n### Paragraf Campuran\n\nIde pokok di **awal dan akhir** (pengulangan dengan variasi).\n\n### Tips Cepat SNBT\n\n1. Baca kalimat pertama dan terakhir.\n2. Cari kalimat yang paling umum (bukan detail/data).\n3. Eliminasi pilihan yang terlalu sempit atau terlalu luas.",
              urutan: 1,
            },
          ],
        },
      },
    });
  }

  console.log("\n✅ Seeding selesai! Database siap digunakan.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
