// Tipe-tipe TypeScript untuk seluruh aplikasi SoalSNBT.id
// Sesuai dengan Prisma schema & Supabase database

// ============================================================
// USER & PROFILE
// ============================================================
export interface Profile {
  id: string;
  username: string;
  fullName: string | null;
  school: string | null;
  city: string | null;
  targetUniversity: string | null;
  targetMajor: string | null;
  targetProdiId: number | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  streakCurrent: number;
  streakLongest: number;
  streakLastDate: Date | null;
  subscriptionTier: "free" | "pro";
  subscriptionExpiresAt: Date | null;
  referralCode: string | null;
  referredById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// MATA PELAJARAN & TOPIK
// ============================================================
export interface MataPelajaran {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string | null;
  icon: string | null;
  warna: string | null;
  topik?: Topik[];
  _count?: { soal: number };
}

export interface Topik {
  id: number;
  mapelId: number;
  nama: string;
  slug: string;
  deskripsi: string | null;
  urutan: number;
  mapel?: MataPelajaran;
  _count?: { soal: number };
}

// ============================================================
// SOAL & PILIHAN JAWABAN (+ IRT Parameters)
// ============================================================
export type TipeSoal = "pilgan" | "benar_salah" | "menjodohkan";

export interface Soal {
  id: string;
  topikId: number;
  konten: string;
  kontenHtml: string | null;
  gambarUrl: string | null;
  tipe: TipeSoal;
  tingkatKesulitan: 1 | 2 | 3 | 4 | 5;
  tahun: number | null;
  sumber: string | null;
  hasVisualExplanation: boolean;
  isPremium: boolean;
  isActive: boolean;
  createdAt: Date;
  // IRT Parameters
  irtDifficulty: number | null;
  irtDiscrimination: number | null;
  irtGuessing: number | null;
  irtLastCalculated: Date | null;
  topik?: Topik;
  pilihanJawaban?: PilihanJawaban[];
  pembahasan?: Pembahasan | null;
}

export interface PilihanJawaban {
  id: string;
  soalId: string;
  label: "A" | "B" | "C" | "D" | "E";
  konten: string;
  kontenHtml: string | null;
  isCorrect: boolean;
  urutan: number;
}

// ============================================================
// PEMBAHASAN
// ============================================================
export type TipeVisual = "diagram" | "animasi" | "grafik" | "none" | null;

export interface Pembahasan {
  id: string;
  soalId: string;
  kontenTeks: string;
  kontenHtml: string | null;
  tipeVisual: TipeVisual;
  visualConfig: Record<string, unknown> | null;
  videoUrl: string | null;
  poinPenting: string[];
  rumusTerkait: string[];
  createdAt: Date;
}

// ============================================================
// SESI LATIHAN
// ============================================================
export type TipeSesi = "latihan_bebas" | "simulasi" | "review";

export interface SesiLatihan {
  id: string;
  userId: string;
  tipe: TipeSesi;
  mapelId: number | null;
  topikIds: number[];
  totalSoal: number;
  soalBenar: number;
  soalSalah: number;
  soalSkip: number;
  waktuMulai: Date;
  waktuSelesai: Date | null;
  durasiDetik: number | null;
  xpEarned: number;
  isSelesai: boolean;
  mapel?: MataPelajaran;
  jawabanUser?: JawabanUser[];
  subSesi?: SubSesiLatihan[];
}

export interface JawabanUser {
  id: string;
  sesiId: string;
  userId: string;
  soalId: string;
  jawabanDipilih: string | null;
  isCorrect: boolean | null;
  waktuMenjawabDetik: number | null;
  isBookmarked: boolean;
  createdAt: Date;
  soal?: Soal;
}

// ============================================================
// SUB-SESI LATIHAN — Block Timing per subtest (Feature 3)
// ============================================================
export interface SubSesiLatihan {
  id: string;
  sesiId: string;
  mapelId: number;
  urutan: number;
  durasiMaksDetik: number;
  waktuMulai: Date | null;
  waktuSelesai: Date | null;
  durasiDetik: number | null;
  soalBenar: number;
  soalSalah: number;
  soalSkip: number;
  isCompleted: boolean;
  mapel?: MataPelajaran;
}

// ============================================================
// BADGES & GAMIFIKASI
// ============================================================
export interface Badge {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string | null;
  icon: string | null;
  warna: string | null;
  xpReward: number;
  kondisi: BadgeKondisi;
}

export type BadgeKondisi =
  | { type: "streak"; value: number }
  | { type: "total_soal"; value: number }
  | { type: "akurasi"; value: number; min_soal: number }
  | { type: "first_login" }
  | { type: "first_session" };

export interface UserBadge {
  userId: string;
  badgeId: number;
  earnedAt: Date;
  badge?: Badge;
}

// ============================================================
// TRANSAKSI & PAYMENT
// ============================================================
export type StatusTransaksi = "pending" | "success" | "failed" | "expired";
export type PaketSubscription = "pro_monthly" | "pro_yearly";

export interface Transaksi {
  id: string;
  userId: string;
  midtransOrderId: string;
  midtransTransactionId: string | null;
  paket: PaketSubscription;
  nominal: number;
  status: StatusTransaksi;
  metodeBayar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// PTN MASTER DATA — Universitas & Program Studi (Feature 2)
// ============================================================
export interface UniversitasPTN {
  id: number;
  kode: string;
  nama: string;
  singkatan: string;
  kota: string;
  logoUrl: string | null;
  prodi?: ProdiPTN[];
}

export interface ProdiPTN {
  id: number;
  univId: number;
  kode: string;
  nama: string;
  jenjang: string;
  rumpun: "SAINTEK" | "SOSHUM";
  dayaTampung: number;
  passingGrade: number;
  tahunData: number;
  univ?: UniversitasPTN;
}

// ============================================================
// EVENT TRYOUT — Grand Tryout Nasional (Feature 4)
// ============================================================
export interface EventTryout {
  id: string;
  nama: string;
  deskripsi: string | null;
  bannerUrl: string | null;
  startDate: Date;
  endDate: Date;
  scoreReleaseAt: Date | null;
  isScorePublished: boolean;
  isPro: boolean;
  maxPeserta: number | null;
  totalSoal: number;
  durasiMenit: number;
  createdAt: Date;
  _count?: { peserta: number };
}

export interface EventPeserta {
  id: string;
  eventId: string;
  userId: string;
  sesiId: string | null;
  skorIrt: number | null;
  peringkat: number | null;
  registeredAt: Date;
  event?: EventTryout;
  user?: Profile;
}

// ============================================================
// LEARNING MATERIALS — Modul & Konten (Feature 5)
// ============================================================
export type TipeMateriKonten = "teks" | "video" | "pdf";

export interface MateriModul {
  id: string;
  topikId: number;
  judul: string;
  slug: string;
  deskripsi: string | null;
  thumbnailUrl: string | null;
  isPremium: boolean;
  urutan: number;
  createdAt: Date;
  updatedAt: Date;
  topik?: Topik;
  konten?: MateriKonten[];
}

export interface MateriKonten {
  id: string;
  modulId: string;
  tipe: TipeMateriKonten;
  judul: string;
  konten: string | null;
  kontenHtml: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  durasiMenit: number | null;
  urutan: number;
}

// ============================================================
// QUESTION COMMENTS — Diskusi per soal (Feature 6)
// ============================================================
export interface KomentarSoal {
  id: string;
  soalId: string;
  userId: string;
  parentId: string | null;
  konten: string;
  upvotes: number;
  downvotes: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<Profile, "id" | "username" | "fullName" | "avatarUrl">;
  replies?: KomentarSoal[];
  votes?: KomentarVote[];
}

export interface KomentarVote {
  userId: string;
  komentarId: string;
  value: 1 | -1;
  createdAt: Date;
}

// ============================================================
// REFERRAL SYSTEM (Feature 7)
// ============================================================
export type TipeReferralReward = "xp" | "subscription_days";

export interface ReferralReward {
  id: string;
  referrerId: string;
  referredId: string;
  tipe: TipeReferralReward;
  nilai: number;
  createdAt: Date;
}

export interface ReferralStats {
  referralCode: string;
  totalReferred: number;
  totalXpEarned: number;
  totalDaysEarned: number;
  recentReferrals: Array<{
    username: string;
    date: Date;
    reward: number;
  }>;
}

// ============================================================
// IRT SCORING (Feature 1)
// ============================================================
export interface IrtCalculationLog {
  id: number;
  totalSoal: number;
  totalResponses: number;
  avgDifficulty: number;
  calculatedAt: Date;
  durationMs: number;
}

export interface IrtScoredResult {
  sesiId: string;
  totalScore: number;
  maxPossibleScore: number;
  irtScore: number;      // Normalized 0-1000 IRT scale
  percentile: number;    // Estimated percentile
  perSubtest: Array<{
    mapelKode: string;
    mapelNama: string;
    rawScore: number;
    irtScore: number;
    totalSoal: number;
  }>;
}

// ============================================================
// PTN PREDICTION (Feature 2)
// ============================================================
export type StatusPrediksi = "aman" | "berjuang" | "sulit";

export interface PrediksiKelulusan {
  prodiId: number;
  prodiNama: string;
  univNama: string;
  univSingkatan: string;
  dayaTampung: number;
  passingGrade: number;
  userIrtScore: number;
  percentage: number;       // 0-100
  status: StatusPrediksi;
  color: "green" | "yellow" | "red";
}

// ============================================================
// LEADERBOARD
// ============================================================
export interface LeaderboardEntry {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  city: string | null;
  level: number;
  xpMingguIni: number;
  totalSesi: number;
  totalBenar: number;
  rank?: number;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

// ============================================================
// FORM TYPES
// ============================================================
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ProfileFormData {
  fullName: string;
  school: string;
  city: string;
  targetUniversity: string;
  targetMajor: string;
  targetProdiId: number | null;
}

// ============================================================
// CBT (COMPUTER BASED TEST) INTERFACE
// ============================================================
export interface SoalCBT extends Soal {
  nomor: number;
  status: "belum" | "dijawab" | "ditandai" | "skip";
  jawabanDipilih: string | null;
  waktuMulaiDetik: number | null;
}

export interface HasilCBT {
  sesiId: string;
  totalSoal: number;
  soalBenar: number;
  soalSalah: number;
  soalSkip: number;
  akurasi: number;
  durasiDetik: number;
  xpEarned: number;
  irtScore?: number;
  breakdown: BreakdownMateri[];
}

export interface BreakdownMateri {
  mapelId: number;
  mapelNama: string;
  totalSoal: number;
  soalBenar: number;
  akurasi: number;
  irtScore?: number;
}

// ============================================================
// AI TUTOR
// ============================================================
export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AITutorContext {
  soalId?: string;
  soalKonten?: string;
  jawabanUser?: string;
  isCorrect?: boolean;
}
