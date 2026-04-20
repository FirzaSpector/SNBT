"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Trophy,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Flame,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

// ============================================================
// DATA STATIS LANDING PAGE
// ============================================================
const STATS = [
  { label: "Soal Tersedia", value: "10.000+", icon: BookOpen, color: "text-primary" },
  { label: "Siswa Aktif", value: "25.000+", icon: Users, color: "text-accent" },
  { label: "Rata-rata Kenaikan Skor", value: "+42%", icon: TrendingUp, color: "text-success" },
  { label: "Lolos PTN", value: "8.300+", icon: Trophy, color: "text-primary" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI Tutor Personal",
    description:
      "Tanya apapun ke AI tutor kamu. Ia tahu kelemahan kamu dan menjelaskan soal dengan cara yang paling mudah dimengerti.",
    color: "bg-primary-light text-primary",
    gradient: "from-primary/10 to-violet-100",
  },
  {
    icon: BarChart3,
    title: "Analitik Visual Mendalam",
    description:
      "Lihat performa kamu lewat grafik interaktif. Ketahui topik mana yang perlu diperkuat sebelum hari H.",
    color: "bg-success-light text-success",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: Zap,
    title: "Simulasi CBT Real",
    description:
      "Rasakan nuansa ujian asli. Timer, antarmuka CBT persis SNBT, dan skor langsung setelah selesai.",
    color: "bg-accent-light text-accent",
    gradient: "from-amber-50 to-orange-50",
  },
  {
    icon: Target,
    title: "Latihan Adaptif",
    description:
      "Sistem rekomendasi soal berdasarkan kelemahanmu. Belajar lebih efisien, bukan lebih lama.",
    color: "bg-primary-light text-primary",
    gradient: "from-indigo-50 to-blue-50",
  },
  {
    icon: Trophy,
    title: "Gamifikasi & Leaderboard",
    description:
      "Kumpulkan XP, raih badge, dan bersaing di leaderboard. Belajar terasa seperti main game.",
    color: "bg-accent-light text-accent",
    gradient: "from-yellow-50 to-amber-50",
  },
  {
    icon: Shield,
    title: "Pembahasan Super Lengkap",
    description:
      "Setiap soal dilengkapi pembahasan visual, diagram interaktif, dan poin-poin kunci yang mudah diingat.",
    color: "bg-success-light text-success",
    gradient: "from-green-50 to-emerald-50",
  },
];

const TESTIMONIALS = [
  {
    nama: "Dhea Aulia",
    sekolah: "SMAN 3 Jakarta",
    ptn: "Teknik Informatika UI",
    foto: "DA",
    teks: "Awalnya aku ga yakin bisa lolos TI UI, tapi setelah rutin latihan di SoalSNBT.id selama 3 bulan, skor TPS ku naik dari 520 ke 680! AI tutornya beneran membantu banget buat ngerti rumus yang susah.",
    stars: 5,
    warna: "#4F46E5",
  },
  {
    nama: "Rizky Firmansyah",
    sekolah: "SMAN 1 Surabaya",
    ptn: "Kedokteran UNAIR",
    foto: "RF",
    teks: "Simulasi CBT-nya persis banget kayak ujian asli. Jadi waktu hari H aku udah ga grogi karena udah terbiasa dengan tampilannya. Alhamdulillah keterima Kedokteran UNAIR!",
    stars: 5,
    warna: "#7C3AED",
  },
  {
    nama: "Nadia Putri Santoso",
    sekolah: "SMAN 8 Bandung",
    ptn: "Manajemen FEB UGM",
    foto: "NS",
    teks: "Fitur analitiknya bikin aku tahu persis di mana kelemahanku. Ternyata aku lemah di penalaran umum, dan setelah fokus latihan di sana, skor akhirku jauh lebih baik.",
    stars: 5,
    warna: "#0891B2",
  },
];

const PRICING = [
  {
    nama: "Gratis",
    harga: "Rp 0",
    periode: "selamanya",
    deskripsi: "Mulai belajar tanpa kartu kredit",
    fitur: [
      "50 soal TPS gratis",
      "3 simulasi tryout per bulan",
      "Pembahasan teks dasar",
      "Leaderboard public",
    ],
    cta: "Daftar Gratis",
    href: "/register",
    highlight: false,
  },
  {
    nama: "PRO",
    harga: "Rp 79.000",
    periode: "per bulan",
    deskripsi: "Gaspol persiapan SNBT tanpa batas",
    fitur: [
      "10.000+ soal semua mapel",
      "Tryout simulasi unlimited",
      "Pembahasan visual + diagram D3.js",
      "AI Tutor personal unlimited",
      "Analitik performa mendalam",
      "XP 1.5x lebih cepat",
      "Latihan adaptif AI-powered",
      "Download ringkasan materi (PDF)",
    ],
    cta: "Mulai Uji Coba Gratis 7 Hari",
    href: "/register?plan=pro",
    highlight: true,
    badge: "Paling Populer",
  },
  {
    nama: "PRO Tahunan",
    harga: "Rp 599.000",
    periode: "per tahun",
    hargaBulanan: "≈ Rp 49.900/bln",
    deskripsi: "Hemat 37% dibanding bayar bulanan",
    fitur: [
      "Semua fitur PRO",
      "Hemat Rp 349.000/tahun",
      "Prioritas fitur baru",
      "Badge eksklusif Tahunan",
    ],
    cta: "Langganan Tahunan",
    href: "/register?plan=pro_yearly",
    highlight: false,
    badge: "Hemat 37%",
  },
];

// ============================================================
// MATA PELAJARAN yang tersedia
// ============================================================
const MAPEL_LIST = [
  { kode: "TPS", nama: "Tes Potensi Skolastik", warna: "#4F46E5", soal: "2.500+" },
  { kode: "MAT", nama: "Matematika", warna: "#7C3AED", soal: "1.800+" },
  { kode: "FIS", nama: "Fisika", warna: "#0891B2", soal: "1.200+" },
  { kode: "KIM", nama: "Kimia", warna: "#059669", soal: "1.100+" },
  { kode: "BIO", nama: "Biologi", warna: "#16A34A", soal: "1.000+" },
  { kode: "IND", nama: "Bahasa Indonesia", warna: "#DC2626", soal: "900+" },
  { kode: "EKO", nama: "Ekonomi", warna: "#D97706", soal: "800+" },
  { kode: "GEO", nama: "Geografi", warna: "#0284C7", soal: "600+" },
];

// ============================================================
// LANDING PAGE COMPONENT
// ============================================================
export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
        aria-label="Hero section"
      >
        {/* Background Gradient */}
        <div
          className="absolute inset-0 gradient-hero opacity-5 pointer-events-none"
          aria-hidden="true"
        />
        {/* Decorative Circles */}
        <div
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge Announcement */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-light text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Platform Terlengkap Persiapan SNBT 2026
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-800 text-text-primary mb-6 leading-tight"
          >
            Belajar SNBT{" "}
            <span className="text-gradient">lebih cerdas</span>,{" "}
            <br className="hidden sm:block" />
            lebih visual, lebih seru
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            10.000+ soal SNBT dengan pembahasan visual interaktif, AI tutor personal,
            dan analitik mendalam. Buat kamu yang serius masuk PTN impian.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base animate-pulse-glow"
              id="hero-cta-register"
            >
              Mulai Gratis Sekarang
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              href="/tryout/demo"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 text-base hover:-translate-y-0.5"
              id="hero-cta-demo"
            >
              Coba Tryout Demo
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
              Tanpa kartu kredit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
              Gratis selamanya (plan dasar)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" aria-hidden="true" />
              25.000+ siswa aktif
            </span>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section
        className="py-16 px-4 bg-white border-y border-border"
        aria-label="Statistik platform"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon
                className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                aria-hidden="true"
              />
              <div className="font-heading text-3xl font-800 text-text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ MATA PELAJARAN SECTION ============ */}
      <section className="py-20 px-4" aria-label="Mata pelajaran yang tersedia">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-800 text-text-primary mb-4">
              Lengkap untuk TPS & TKA
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Semua mata pelajaran SNBT tersedia dengan soal terstruktur dari level mudah hingga HOTS.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MAPEL_LIST.map((mapel, i) => (
              <motion.div
                key={mapel.kode}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card card-hover p-5 text-center group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-heading font-800 text-sm"
                  style={{ backgroundColor: mapel.warna }}
                  aria-hidden="true"
                >
                  {mapel.kode.slice(0, 3)}
                </div>
                <div className="font-semibold text-text-primary text-sm mb-1">
                  {mapel.nama}
                </div>
                <div className="text-xs text-text-secondary">
                  {mapel.soal} soal
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section
        className="py-20 px-4 bg-white"
        aria-label="Fitur unggulan"
        id="fitur"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-800 text-text-primary mb-4">
              Kenapa pilih SoalSNBT.id?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Bukan sekadar kumpulan soal — ini adalah ekosistem belajar yang dirancang untuk kamu lulus.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card card-hover p-6 bg-gradient-to-br ${feat.gradient}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4`}
                  aria-hidden="true"
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-700 text-lg text-text-primary mb-2">
                  {feat.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS SECTION ============ */}
      <section
        className="py-20 px-4 bg-surface"
        aria-label="Testimoni pengguna"
        id="testimoni"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-800 text-text-primary mb-4">
              Mereka sudah buktikan 🎉
            </h2>
            <p className="text-text-secondary">
              Ribuan siswa yang kini kuliah di PTN impian mereka berkat SoalSNBT.id
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.nama}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-6"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label="Rating 5 bintang">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star
                      key={si}
                      className="w-4 h-4 text-accent fill-accent"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.teks}&rdquo;
                </p>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: t.warna }}
                    aria-hidden="true"
                  >
                    {t.foto}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary text-sm">
                      {t.nama}
                    </div>
                    <div className="text-xs text-text-secondary">{t.sekolah}</div>
                    <div
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: t.warna }}
                    >
                      ✓ {t.ptn}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section
        className="py-20 px-4 bg-white"
        aria-label="Harga dan paket"
        id="harga"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-800 text-text-primary mb-4">
              Harga transparan, tanpa biaya tersembunyi
            </h2>
            <p className="text-text-secondary">
              Mulai gratis, upgrade kapan saja kalau sudah siap gaspol.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.nama}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card p-6 relative ${
                  plan.highlight
                    ? "border-2 border-primary shadow-xl scale-[1.02]"
                    : ""
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                      plan.highlight
                        ? "bg-primary text-white"
                        : "bg-accent text-white"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-heading font-700 text-xl text-text-primary mb-1">
                    {plan.nama}
                  </h3>
                  <p className="text-text-secondary text-sm">{plan.deskripsi}</p>
                </div>

                <div className="mb-6">
                  <span className="font-heading text-3xl font-800 text-text-primary">
                    {plan.harga}
                  </span>
                  <span className="text-text-secondary text-sm ml-1">
                    /{plan.periode}
                  </span>
                  {plan.hargaBulanan && (
                    <div className="text-xs text-success font-semibold mt-1">
                      {plan.hargaBulanan}
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.fitur.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        className="w-4 h-4 text-success mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 px-4 rounded-xl transition-all duration-200 ${
                    plan.highlight
                      ? "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      : "bg-surface text-text-primary hover:bg-border border border-border"
                  }`}
                  id={`pricing-cta-${plan.nama.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA SECTION ============ */}
      <section
        className="py-20 px-4"
        aria-label="Call to action terakhir"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-primary rounded-3xl p-12 text-white relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <Flame className="w-12 h-12 mx-auto mb-4 text-accent" aria-hidden="true" />
              <h2 className="font-heading text-3xl font-800 mb-4">
                Mulai perjalananmu ke PTN impian hari ini
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Bergabung dengan 25.000+ siswa yang sudah membuktikan metode belajar visual dan adaptif kami.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-primary-light transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                id="final-cta-register"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        className="bg-[#111827] text-white py-12 px-4"
        aria-label="Footer"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-heading font-700 text-lg">
                  SoalSNBT<span className="text-accent">.id</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Platform latihan SNBT terlengkap untuk pelajar Indonesia. Belajar cerdas, masuk PTN impian.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Latihan Soal", "Simulasi Tryout", "AI Tutor", "Leaderboard"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm">Mapel</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {["TPS", "Matematika", "Fisika", "Kimia", "Biologi"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm">Info</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog SNBT
                  </Link>
                </li>
                <li>
                  <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 SoalSNBT.id. Hak cipta dilindungi.</p>
            <p>Made with ❤️ untuk pejuang PTN Indonesia</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
