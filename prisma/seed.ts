import { PrismaClient } from "@prisma/client";

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

  const univData = [
    // UNIVERSITAS (PULAU SUMATERA)
    { kode: "USK", nama: "Universitas Syiah Kuala", singkatan: "USK", kota: "Banda Aceh" },
    { kode: "UNIMAL", nama: "Universitas Malikussaleh", singkatan: "Unimal", kota: "Aceh Utara" },
    { kode: "USU", nama: "Universitas Sumatera Utara", singkatan: "USU", kota: "Medan" },
    { kode: "UNIMED", nama: "Universitas Negeri Medan", singkatan: "Unimed", kota: "Medan" },
    { kode: "UNAND", nama: "Universitas Andalas", singkatan: "Unand", kota: "Padang" },
    { kode: "UNP", nama: "Universitas Negeri Padang", singkatan: "UNP", kota: "Padang" },
    { kode: "UNRI", nama: "Universitas Riau", singkatan: "Unri", kota: "Pekanbaru" },
    { kode: "UNJA", nama: "Universitas Jambi", singkatan: "Unja", kota: "Jambi" },
    { kode: "UNIB", nama: "Universitas Bengkulu", singkatan: "Unib", kota: "Bengkulu" },
    { kode: "UNSRI", nama: "Universitas Sriwijaya", singkatan: "Unsri", kota: "Palembang" },
    { kode: "UNILA", nama: "Universitas Lampung", singkatan: "Unila", kota: "Bandar Lampung" },
    
    // UNIVERSITAS (PULAU JAWA)
    { kode: "UNTIRTA", nama: "Universitas Sultan Ageng Tirtayasa", singkatan: "Untirta", kota: "Serang" },
    { kode: "UI", nama: "Universitas Indonesia", singkatan: "UI", kota: "Depok" },
    { kode: "UNJ", nama: "Universitas Negeri Jakarta", singkatan: "UNJ", kota: "Jakarta" },
    { kode: "UPNVJ", nama: "UPN Veteran Jakarta", singkatan: "UPNVJ", kota: "Jakarta" },
    { kode: "IPB", nama: "Institut Pertanian Bogor", singkatan: "IPB", kota: "Bogor" },
    { kode: "ITB", nama: "Institut Teknologi Bandung", singkatan: "ITB", kota: "Bandung" },
    { kode: "UNPAD", nama: "Universitas Padjadjaran", singkatan: "Unpad", kota: "Bandung" },
    { kode: "UPI", nama: "Universitas Pendidikan Indonesia", singkatan: "UPI", kota: "Bandung" },
    { kode: "UNSOED", nama: "Universitas Jenderal Soedirman", singkatan: "Unsoed", kota: "Purwokerto" },
    { kode: "UNTIDAR", nama: "Universitas Tidar", singkatan: "Untidar", kota: "Magelang" },
    { kode: "UNS", nama: "Universitas Sebelas Maret", singkatan: "UNS", kota: "Surakarta" },
    { kode: "UNDIP", nama: "Universitas Diponegoro", singkatan: "Undip", kota: "Semarang" },
    { kode: "UNNES", nama: "Universitas Negeri Semarang", singkatan: "Unnes", kota: "Semarang" },
    { kode: "UGM", nama: "Universitas Gadjah Mada", singkatan: "UGM", kota: "Yogyakarta" },
    { kode: "UNY", nama: "Universitas Negeri Yogyakarta", singkatan: "UNY", kota: "Yogyakarta" },
    { kode: "UPNVY", nama: "UPN Veteran Yogyakarta", singkatan: "UPNVY", kota: "Sleman" },
    { kode: "UB", nama: "Universitas Brawijaya", singkatan: "UB", kota: "Malang" },
    { kode: "UM", nama: "Universitas Negeri Malang", singkatan: "UM", kota: "Malang" },
    { kode: "UNEJ", nama: "Universitas Jember", singkatan: "Unej", kota: "Jember" },
    { kode: "UNAIR", nama: "Universitas Airlangga", singkatan: "Unair", kota: "Surabaya" },
    { kode: "ITS", nama: "Institut Teknologi Sepuluh Nopember", singkatan: "ITS", kota: "Surabaya" },
    { kode: "UNESA", nama: "Universitas Negeri Surabaya", singkatan: "Unesa", kota: "Surabaya" },
    { kode: "UPNVJT", nama: "UPN Veteran Jawa Timur", singkatan: "UPNVJT", kota: "Surabaya" },
    { kode: "UTM", nama: "Universitas Trunojoyo Madura", singkatan: "UTM", kota: "Bangkalan" },

    // UNIVERSITAS (BALI & NUSA TENGGARA)
    { kode: "UNUD", nama: "Universitas Udayana", singkatan: "Unud", kota: "Denpasar" },
    { kode: "UNDIKSHA", nama: "Universitas Pendidikan Ganesha", singkatan: "Undiksha", kota: "Singaraja" },
    { kode: "UNRAM", nama: "Universitas Mataram", singkatan: "Unram", kota: "Mataram" },
    { kode: "UNDANA", nama: "Universitas Nusa Cendana", singkatan: "Undana", kota: "Kupang" },

    // UNIVERSITAS (KALIMANTAN)
    { kode: "UNTAN", nama: "Universitas Tanjungpura", singkatan: "Untan", kota: "Pontianak" },
    { kode: "UPR", nama: "Universitas Palangka Raya", singkatan: "UPR", kota: "Palangka Raya" },
    { kode: "ULM", nama: "Universitas Lambung Mangkurat", singkatan: "ULM", kota: "Banjarmasin" },
    { kode: "UNMUL", nama: "Universitas Mulawarman", singkatan: "Unmul", kota: "Samarinda" },
    { kode: "UBT", nama: "Universitas Borneo Tarakan", singkatan: "UBT", kota: "Tarakan" },

    // UNIVERSITAS (SULAWESI)
    { kode: "UNHAS", nama: "Universitas Hasanuddin", singkatan: "Unhas", kota: "Makassar" },
    { kode: "UNM", nama: "Universitas Negeri Makassar", singkatan: "UNM", kota: "Makassar" },
    { kode: "UNSRAT", nama: "Universitas Sam Ratulangi", singkatan: "Unsrat", kota: "Manado" },
    { kode: "UNIMA", nama: "Universitas Negeri Manado", singkatan: "Unima", kota: "Minahasa" },
    { kode: "UNTAD", nama: "Universitas Tadulako", singkatan: "Untad", kota: "Palu" },
    { kode: "UHO", nama: "Universitas Halu Oleo", singkatan: "UHO", kota: "Kendari" },
    { kode: "UNG", nama: "Universitas Negeri Gorontalo", singkatan: "UNG", kota: "Gorontalo" },

    // UNIVERSITAS (MALUKU & PAPUA)
    { kode: "UNPATTI", nama: "Universitas Pattimura", singkatan: "Unpatti", kota: "Ambon" },
    { kode: "UNKHAIR", nama: "Universitas Khairun", singkatan: "Unkhair", kota: "Ternate" },
    { kode: "UNCEN", nama: "Universitas Cenderawasih", singkatan: "Uncen", kota: "Jayapura" },
    { kode: "UNIPA", nama: "Universitas Papua", singkatan: "Unipa", kota: "Manokwari" },
    { kode: "MUSAMUS", nama: "Universitas Musamus", singkatan: "Unmus", kota: "Merauke" },

    // INSTITUT
    { kode: "ITERA", nama: "Institut Teknologi Sumatera", singkatan: "Itera", kota: "Lampung Selatan" },
    { kode: "ITK", nama: "Institut Teknologi Kalimantan", singkatan: "ITK", kota: "Balikpapan" },
    { kode: "ISI-YK", nama: "Institut Seni Indonesia Yogyakarta", singkatan: "ISI Yogyakarta", kota: "Bantul" },
    { kode: "ISI-SKA", nama: "Institut Seni Indonesia Surakarta", singkatan: "ISI Surakarta", kota: "Surakarta" },
    { kode: "ISI-DPS", nama: "Institut Seni Indonesia Denpasar", singkatan: "ISI Denpasar", kota: "Denpasar" },
    { kode: "ISBI-BDG", nama: "Institut Seni Budaya Indonesia Bandung", singkatan: "ISBI Bandung", kota: "Bandung" },

    // POLITEKNIK
    { kode: "POLMAN", nama: "Politeknik Manufaktur Bandung", singkatan: "POLMAN", kota: "Bandung" },
    { kode: "PNJ", nama: "Politeknik Negeri Jakarta", singkatan: "PNJ", kota: "Depok" },
    { kode: "POLMED", nama: "Politeknik Negeri Medan", singkatan: "POLMED", kota: "Medan" },
    { kode: "POLBAN", nama: "Politeknik Negeri Bandung", singkatan: "POLBAN", kota: "Bandung" },
    { kode: "POLINES", nama: "Politeknik Negeri Semarang", singkatan: "POLINES", kota: "Semarang" },
    { kode: "POLSRI", nama: "Politeknik Negeri Sriwijaya", singkatan: "POLSRI", kota: "Palembang" },
    { kode: "POLINELA", nama: "Politeknik Negeri Lampung", singkatan: "POLINELA", kota: "Bandar Lampung" },
    { kode: "POLNAM", nama: "Politeknik Negeri Ambon", singkatan: "POLNAM", kota: "Ambon" },
    { kode: "PNP", nama: "Politeknik Negeri Padang", singkatan: "PNP", kota: "Padang" },
    { kode: "PNB", nama: "Politeknik Negeri Bali", singkatan: "PNB", kota: "Badung" },
    { kode: "POLNEP", nama: "Politeknik Negeri Pontianak", singkatan: "POLNEP", kota: "Pontianak" },
    { kode: "PNUP", nama: "Politeknik Negeri Ujung Pandang", singkatan: "PNUP", kota: "Makassar" },
    { kode: "POLIMDO", nama: "Politeknik Negeri Manado", singkatan: "POLIMDO", kota: "Manado" },
    { kode: "PPNS", nama: "Politeknik Perkapalan Negeri Surabaya", singkatan: "PPNS", kota: "Surabaya" },
    { kode: "POLIBAN", nama: "Politeknik Negeri Banjarmasin", singkatan: "POLIBAN", kota: "Banjarmasin" },
    { kode: "PNL", nama: "Politeknik Negeri Lhokseumawe", singkatan: "PNL", kota: "Lhokseumawe" },
    { kode: "PNK", nama: "Politeknik Negeri Kupang", singkatan: "PNK", kota: "Kupang" },
    { kode: "PENS", nama: "Politeknik Elektronika Negeri Surabaya", singkatan: "PENS", kota: "Surabaya" },
    { kode: "POLIJE", nama: "Politeknik Negeri Jember", singkatan: "POLIJE", kota: "Jember" },
    { kode: "PPNP", nama: "Politeknik Pertanian Negeri Pangkajene Kepulauan", singkatan: "PPNP", kota: "Pangkajene" },
    { kode: "PPNK", nama: "Politeknik Pertanian Negeri Kupang", singkatan: "PPNK", kota: "Kupang" },
    { kode: "POLIKANT", nama: "Politeknik Perikanan Negeri Tual", singkatan: "POLIKANT", kota: "Tual" },
    { kode: "POLINEMA", nama: "Politeknik Negeri Malang", singkatan: "POLINEMA", kota: "Malang" },
    { kode: "POLITANI-SMD", nama: "Politeknik Pertanian Negeri Samarinda", singkatan: "POLITANI Samarinda", kota: "Samarinda" },
    { kode: "PPNP-PYK", nama: "Politeknik Pertanian Negeri Payakumbuh", singkatan: "PPNP", kota: "Payakumbuh" },
    { kode: "POLNES", nama: "Politeknik Negeri Samarinda", singkatan: "POLNES", kota: "Samarinda" },
    { kode: "POLIMEDIA", nama: "Politeknik Negeri Media Kreatif", singkatan: "POLIMEDIA", kota: "Jakarta" },
    { kode: "POLMANBABEL", nama: "Politeknik Manufaktur Negeri Bangka Belitung", singkatan: "POLMANBABEL", kota: "Bangka" },
    { kode: "POLIBATAM", nama: "Politeknik Negeri Batam", singkatan: "POLIBATAM", kota: "Batam" },
    { kode: "POLNUSTAR", nama: "Politeknik Negeri Nusa Utara", singkatan: "POLNUSTAR", kota: "Sangihe" },
    { kode: "POLBENG", nama: "Politeknik Negeri Bengkalis", singkatan: "POLBENG", kota: "Bengkalis" },
    { kode: "POLTEKBA", nama: "Politeknik Negeri Balikpapan", singkatan: "POLTEKBA", kota: "Balikpapan" },
    { kode: "POLTERA", nama: "Politeknik Negeri Madura", singkatan: "POLTERA", kota: "Sampang" },
    { kode: "POLIMARIN", nama: "Politeknik Maritim Negeri Indonesia", singkatan: "POLIMARIN", kota: "Semarang" },
    { kode: "POLIWANGI", nama: "Politeknik Negeri Banyuwangi", singkatan: "POLIWANGI", kota: "Banyuwangi" },
    { kode: "PNM", nama: "Politeknik Negeri Madiun", singkatan: "PNM", kota: "Madiun" },
    { kode: "POLINEF", nama: "Politeknik Negeri Fakfak", singkatan: "POLINEF", kota: "Fakfak" },
    { kode: "POLTESA", nama: "Politeknik Negeri Sambas", singkatan: "POLTESA", kota: "Sambas" },
    { kode: "POLITALA", nama: "Politeknik Negeri Tanah Laut", singkatan: "POLITALA", kota: "Pelaihari" },
    { kode: "POLSUB", nama: "Politeknik Negeri Subang", singkatan: "POLSUB", kota: "Subang" },
    { kode: "POLITAP", nama: "Politeknik Negeri Ketapang", singkatan: "POLITAP", kota: "Ketapang" },
    { kode: "PNC", nama: "Politeknik Negeri Cilacap", singkatan: "PNC", kota: "Cilacap" },
    { kode: "POLINDRA", nama: "Politeknik Negeri Indramayu", singkatan: "POLINDRA", kota: "Indramayu" },
    { kode: "PNN", nama: "Politeknik Negeri Nunukan", singkatan: "PNN", kota: "Nunukan" },

    // UIN (Universitas Islam Negeri di bawah Kemenag yang masuk SNBT)
    { kode: "UIN-JKT", nama: "UIN Syarif Hidayatullah Jakarta", singkatan: "UIN Jakarta", kota: "Jakarta" },
    { kode: "UIN-SUKA", nama: "UIN Sunan Kalijaga", singkatan: "UIN Suka", kota: "Yogyakarta" },
    { kode: "UIN-SGD", nama: "UIN Sunan Gunung Djati", singkatan: "UIN Bandung", kota: "Bandung" },
    { kode: "UIN-SA", nama: "UIN Sunan Ampel", singkatan: "UINSA", kota: "Surabaya" },
    { kode: "UIN-MALANG", nama: "UIN Maulana Malik Ibrahim", singkatan: "UIN Malang", kota: "Malang" },
    { kode: "UIN-WALI", nama: "UIN Walisongo", singkatan: "UIN Walisongo", kota: "Semarang" },
    { kode: "UIN-AM", nama: "UIN Alauddin", singkatan: "UIN Alauddin", kota: "Makassar" },
    { kode: "UIN-SU", nama: "UIN Sumatera Utara", singkatan: "UINSU", kota: "Medan" },
  ];

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

  const prodiData = [
    // UI
    { univKode: "UI", kode: "FK-UI", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 150, passingGrade: 750 },
    { univKode: "UI", kode: "FH-UI", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 300, passingGrade: 680 },
    { univKode: "UI", kode: "CS-UI", nama: "Ilmu Komputer", rumpun: "SAINTEK", dayaTampung: 100, passingGrade: 720 },
    { univKode: "UI", kode: "FE-UI", nama: "Akuntansi", rumpun: "SOSHUM", dayaTampung: 120, passingGrade: 700 },
    { univKode: "UI", kode: "PSI-UI", nama: "Psikologi", rumpun: "SOSHUM", dayaTampung: 100, passingGrade: 690 },
    // ITB
    { univKode: "ITB", kode: "STEI", nama: "Teknik Elektro & Informatika", rumpun: "SAINTEK", dayaTampung: 350, passingGrade: 730 },
    { univKode: "ITB", kode: "FTTM", nama: "Teknik Pertambangan & Perminyakan", rumpun: "SAINTEK", dayaTampung: 120, passingGrade: 680 },
    { univKode: "ITB", kode: "FITB", nama: "Teknik Geologi", rumpun: "SAINTEK", dayaTampung: 80, passingGrade: 660 },
    { univKode: "ITB", kode: "SBM", nama: "Manajemen", rumpun: "SOSHUM", dayaTampung: 90, passingGrade: 710 },
    // UGM
    { univKode: "UGM", kode: "FK-UGM", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 180, passingGrade: 740 },
    { univKode: "UGM", kode: "FT-UGM", nama: "Teknik Elektro", rumpun: "SAINTEK", dayaTampung: 100, passingGrade: 690 },
    { univKode: "UGM", kode: "FEB-UGM", nama: "Manajemen", rumpun: "SOSHUM", dayaTampung: 120, passingGrade: 690 },
    { univKode: "UGM", kode: "FISIP-UGM", nama: "Ilmu Komunikasi", rumpun: "SOSHUM", dayaTampung: 80, passingGrade: 670 },
    // ITS
    { univKode: "ITS", kode: "IF-ITS", nama: "Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 120, passingGrade: 700 },
    { univKode: "ITS", kode: "TE-ITS", nama: "Teknik Elektro", rumpun: "SAINTEK", dayaTampung: 100, passingGrade: 670 },
    { univKode: "ITS", kode: "TK-ITS", nama: "Teknik Kimia", rumpun: "SAINTEK", dayaTampung: 100, passingGrade: 650 },
    // UNAIR
    { univKode: "UNAIR", kode: "FK-UNAIR", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 160, passingGrade: 730 },
    { univKode: "UNAIR", kode: "FH-UNAIR", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 200, passingGrade: 650 },
    { univKode: "UNAIR", kode: "PSI-UNAIR", nama: "Psikologi", rumpun: "SOSHUM", dayaTampung: 80, passingGrade: 660 },
    // UNDIP
    { univKode: "UNDIP", kode: "FK-UNDIP", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 160, passingGrade: 720 },
    { univKode: "UNDIP", kode: "IF-UNDIP", nama: "Informatika", rumpun: "SAINTEK", dayaTampung: 80, passingGrade: 660 },
    // UNPAD
    { univKode: "UNPAD", kode: "FK-UNPAD", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 170, passingGrade: 735 },
    { univKode: "UNPAD", kode: "FH-UNPAD", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 250, passingGrade: 660 },
    { univKode: "UNPAD", kode: "IKOM-UNPAD", nama: "Ilmu Komunikasi", rumpun: "SOSHUM", dayaTampung: 100, passingGrade: 670 },
    // UB
    { univKode: "UB", kode: "FK-UB", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 140, passingGrade: 710 },
    { univKode: "UB", kode: "IF-UB", nama: "Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 80, passingGrade: 650 },
    { univKode: "UB", kode: "FH-UB", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 150, passingGrade: 640 },
    // UNS
    { univKode: "UNS", kode: "FK-UNS", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 120, passingGrade: 700 },
    { univKode: "UNS", kode: "IF-UNS", nama: "Informatika", rumpun: "SAINTEK", dayaTampung: 60, passingGrade: 630 },
    // USU
    { univKode: "USU", kode: "FK-USU", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 140, passingGrade: 700 },
    { univKode: "USU", kode: "FH-USU", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 180, passingGrade: 620 },
    // IPB
    { univKode: "IPB", kode: "IF-IPB", nama: "Ilmu Komputer", rumpun: "SAINTEK", dayaTampung: 80, passingGrade: 670 },
    { univKode: "IPB", kode: "TP-IPB", nama: "Teknologi Pangan", rumpun: "SAINTEK", dayaTampung: 60, passingGrade: 640 },
    // UNHAS
    { univKode: "UNHAS", kode: "FK-UNHAS", nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 150, passingGrade: 710 },
    { univKode: "UNHAS", kode: "FH-UNHAS", nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 200, passingGrade: 620 },
  ];

  for (const p of prodiData) {
    const univId = univMap[p.univKode];
    if (!univId) continue;
    await prisma.prodiPTN.upsert({
      where: { univId_kode: { univId, kode: p.kode } },
      update: {},
      create: {
        univId,
        kode: p.kode,
        nama: p.nama,
        rumpun: p.rumpun,
        dayaTampung: p.dayaTampung,
        passingGrade: p.passingGrade,
      },
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
