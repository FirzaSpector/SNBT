-- ============================================================
-- SoalSNBT.id — Supabase Migration 001: Initial Schema
-- Jalankan di Supabase SQL Editor atau via CLI
-- ============================================================

-- Enable ekstensi yang dibutuhkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES — Extend auth.users Supabase
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(30) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  school VARCHAR(150),
  city VARCHAR(100),
  target_university VARCHAR(150),
  target_major VARCHAR(150),
  avatar_url TEXT,
  xp INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  streak_current INTEGER DEFAULT 0 NOT NULL,
  streak_longest INTEGER DEFAULT 0 NOT NULL,
  streak_last_date DATE,
  subscription_tier VARCHAR(20) DEFAULT 'free' NOT NULL,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger: auto-buat profil saat user baru daftar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- MATA PELAJARAN
-- ============================================================
CREATE TABLE IF NOT EXISTS mata_pelajaran (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(10) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  icon VARCHAR(50),
  warna VARCHAR(7)
);

-- ============================================================
-- TOPIK
-- ============================================================
CREATE TABLE IF NOT EXISTS topik (
  id SERIAL PRIMARY KEY,
  mapel_id INTEGER NOT NULL REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  nama VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  deskripsi TEXT,
  urutan INTEGER DEFAULT 0
);

-- ============================================================
-- SOAL
-- ============================================================
CREATE TABLE IF NOT EXISTS soal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topik_id INTEGER NOT NULL REFERENCES topik(id) ON DELETE RESTRICT,
  konten TEXT NOT NULL,
  konten_html TEXT,
  gambar_url TEXT,
  tipe VARCHAR(20) DEFAULT 'pilgan' NOT NULL,
  tingkat_kesulitan INTEGER NOT NULL CHECK (tingkat_kesulitan BETWEEN 1 AND 5),
  tahun INTEGER,
  sumber VARCHAR(100),
  has_visual_explanation BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_soal_topik_id ON soal(topik_id);
CREATE INDEX idx_soal_is_premium ON soal(is_premium);
CREATE INDEX idx_soal_tingkat ON soal(tingkat_kesulitan);

-- ============================================================
-- PILIHAN JAWABAN
-- ============================================================
CREATE TABLE IF NOT EXISTS pilihan_jawaban (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soal_id UUID NOT NULL REFERENCES soal(id) ON DELETE CASCADE,
  label CHAR(1) NOT NULL,
  konten TEXT NOT NULL,
  konten_html TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  urutan INTEGER NOT NULL
);

CREATE INDEX idx_pilihan_soal_id ON pilihan_jawaban(soal_id);

-- ============================================================
-- PEMBAHASAN
-- ============================================================
CREATE TABLE IF NOT EXISTS pembahasan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soal_id UUID UNIQUE NOT NULL REFERENCES soal(id) ON DELETE CASCADE,
  konten_teks TEXT NOT NULL,
  konten_html TEXT,
  tipe_visual VARCHAR(30),
  visual_config JSONB,
  video_url TEXT,
  poin_penting TEXT[] DEFAULT '{}',
  rumus_terkait TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SESI LATIHAN
-- ============================================================
CREATE TABLE IF NOT EXISTS sesi_latihan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipe VARCHAR(20) NOT NULL,
  mapel_id INTEGER REFERENCES mata_pelajaran(id),
  topik_ids INTEGER[] DEFAULT '{}',
  total_soal INTEGER NOT NULL,
  soal_benar INTEGER DEFAULT 0 NOT NULL,
  soal_salah INTEGER DEFAULT 0 NOT NULL,
  soal_skip INTEGER DEFAULT 0 NOT NULL,
  waktu_mulai TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  waktu_selesai TIMESTAMPTZ,
  durasi_detik INTEGER,
  xp_earned INTEGER DEFAULT 0 NOT NULL,
  is_selesai BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE INDEX idx_sesi_user_id ON sesi_latihan(user_id);
CREATE INDEX idx_sesi_waktu_mulai ON sesi_latihan(waktu_mulai DESC);

-- ============================================================
-- JAWABAN USER
-- ============================================================
CREATE TABLE IF NOT EXISTS jawaban_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesi_id UUID NOT NULL REFERENCES sesi_latihan(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  soal_id UUID NOT NULL REFERENCES soal(id),
  jawaban_dipilih CHAR(1),
  is_correct BOOLEAN,
  waktu_menjawab_detik INTEGER,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_jawaban_sesi_id ON jawaban_user(sesi_id);
CREATE INDEX idx_jawaban_user_id ON jawaban_user(user_id);
CREATE INDEX idx_jawaban_soal_id ON jawaban_user(soal_id);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  icon VARCHAR(50),
  warna VARCHAR(7),
  xp_reward INTEGER DEFAULT 0,
  kondisi JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, badge_id)
);

-- ============================================================
-- TRANSAKSI
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  midtrans_order_id VARCHAR(100) UNIQUE NOT NULL,
  midtrans_transaction_id VARCHAR(100),
  paket VARCHAR(20) NOT NULL,
  nominal INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  metode_bayar VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER transaksi_updated_at
  BEFORE UPDATE ON transaksi
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- LEADERBOARD — Materialized View (refresh setiap jam)
-- ============================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_mingguan AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.city,
  p.level,
  COALESCE(SUM(s.xp_earned), 0) AS xp_minggu_ini,
  COUNT(s.id) AS total_sesi,
  COALESCE(SUM(s.soal_benar), 0) AS total_benar
FROM profiles p
LEFT JOIN sesi_latihan s ON p.id = s.user_id
  AND s.waktu_mulai >= date_trunc('week', NOW())
  AND s.is_selesai = TRUE
GROUP BY p.id, p.username, p.full_name, p.avatar_url, p.city, p.level
ORDER BY xp_minggu_ini DESC;

-- Index untuk materialized view
CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_user_idx ON leaderboard_mingguan(id);

-- Function untuk refresh materialized view (dipanggil via cron/pg_cron)
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard_mingguan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User bisa lihat profil sendiri" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "User bisa update profil sendiri" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Publik bisa lihat username & avatar (untuk leaderboard)
CREATE POLICY "Publik bisa lihat profil basic" ON profiles
  FOR SELECT USING (true);

-- Soal RLS: soal gratis bisa diakses semua; soal premium hanya subscriber
ALTER TABLE soal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa lihat soal gratis" ON soal
  FOR SELECT USING (is_premium = FALSE AND is_active = TRUE);

CREATE POLICY "Subscriber bisa lihat soal premium" ON soal
  FOR SELECT USING (
    is_active = TRUE AND (
      is_premium = FALSE OR
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
          AND subscription_tier = 'pro'
          AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
      )
    )
  );

-- Pilihan jawaban RLS (sama dengan soal)
ALTER TABLE pilihan_jawaban ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bisa lihat pilihan soal yang diizinkan" ON pilihan_jawaban
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM soal s WHERE s.id = soal_id AND s.is_active = TRUE
    )
  );

-- Pembahasan RLS
ALTER TABLE pembahasan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bisa lihat pembahasan soal aktif" ON pembahasan
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM soal s WHERE s.id = soal_id AND s.is_active = TRUE
    )
  );

-- Sesi Latihan RLS
ALTER TABLE sesi_latihan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User hanya lihat sesi sendiri" ON sesi_latihan
  FOR ALL USING (auth.uid() = user_id);

-- Jawaban User RLS
ALTER TABLE jawaban_user ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User hanya lihat jawaban sendiri" ON jawaban_user
  FOR ALL USING (auth.uid() = user_id);

-- Badge RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Semua bisa lihat badge" ON badges FOR SELECT USING (true);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User lihat badge sendiri" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Transaksi RLS
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User lihat transaksi sendiri" ON transaksi
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA: Mata Pelajaran SNBT
-- ============================================================
INSERT INTO mata_pelajaran (kode, nama, deskripsi, icon, warna) VALUES
  ('TPS', 'Tes Potensi Skolastik', 'Mengukur kemampuan kognitif dan penalaran umum', 'Brain', '#4F46E5'),
  ('MAT', 'Matematika', 'Pengetahuan dan kemampuan matematika dasar hingga lanjut', 'Calculator', '#7C3AED'),
  ('FIS', 'Fisika', 'Konsep dan penerapan fisika SMA', 'Atom', '#0891B2'),
  ('KIM', 'Kimia', 'Reaksi kimia, stoikiometri, dan konsep kimia organik', 'Flask', '#059669'),
  ('BIO', 'Biologi', 'Biologi sel hingga ekosistem', 'Leaf', '#16A34A'),
  ('IND', 'Bahasa Indonesia', 'Pemahaman bacaan, tata bahasa, dan penulisan', 'BookOpen', '#DC2626'),
  ('EKO', 'Ekonomi', 'Teori ekonomi mikro dan makro', 'TrendingUp', '#D97706'),
  ('SOS', 'Sosiologi', 'Struktur sosial, perubahan, dan budaya masyarakat', 'Users', '#7C3AED'),
  ('GEO', 'Geografi', 'Geografi fisik, manusia, dan regional Indonesia', 'Globe', '#0284C7'),
  ('SEJ', 'Sejarah', 'Sejarah Indonesia dan dunia', 'Scroll', '#9D174D')
ON CONFLICT (kode) DO NOTHING;

-- Seed Topik TPS
INSERT INTO topik (mapel_id, nama, slug, urutan) VALUES
  (1, 'Penalaran Umum', 'penalaran-umum', 1),
  (1, 'Pemahaman Bacaan dan Menulis', 'pemahaman-bacaan-menulis', 2),
  (1, 'Pengetahuan dan Pemahaman Umum', 'pengetahuan-pemahaman-umum', 3),
  (1, 'Pengetahuan Kuantitatif', 'pengetahuan-kuantitatif', 4);

-- Seed Topik Matematika
INSERT INTO topik (mapel_id, nama, slug, urutan) VALUES
  (2, 'Aljabar dan Fungsi', 'aljabar-fungsi', 1),
  (2, 'Geometri dan Trigonometri', 'geometri-trigonometri', 2),
  (2, 'Statistika dan Peluang', 'statistika-peluang', 3),
  (2, 'Kalkulus Dasar', 'kalkulus-dasar', 4);

-- Seed Badges
INSERT INTO badges (kode, nama, deskripsi, icon, warna, xp_reward, kondisi) VALUES
  ('streak_3', 'Konsisten Pemula', 'Belajar 3 hari berturut-turut', 'Flame', '#F59E0B', 50, '{"type": "streak", "value": 3}'),
  ('streak_7', 'Seminggu Penuh', 'Belajar 7 hari berturut-turut', 'Fire', '#EF4444', 150, '{"type": "streak", "value": 7}'),
  ('streak_30', 'Juara Bulan Ini', 'Belajar 30 hari berturut-turut', 'Trophy', '#F59E0B', 500, '{"type": "streak", "value": 30}'),
  ('soal_100', 'Rajin Banget', 'Selesaikan 100 soal', 'Star', '#4F46E5', 100, '{"type": "total_soal", "value": 100}'),
  ('soal_1000', 'Mesin Belajar', 'Selesaikan 1000 soal', 'Rocket', '#7C3AED', 500, '{"type": "total_soal", "value": 1000}'),
  ('akurasi_90', 'Sharp Shooter', 'Akurasi 90% dalam satu sesi (min 20 soal)', 'Target', '#10B981', 200, '{"type": "akurasi", "value": 90, "min_soal": 20}'),
  ('first_login', 'Selamat Datang!', 'Login pertama kali', 'Hand', '#4F46E5', 20, '{"type": "first_login"}'),
  ('first_session', 'Mulai Belajar', 'Selesaikan sesi latihan pertama', 'BookOpen', '#0891B2', 30, '{"type": "first_session"}')
ON CONFLICT (kode) DO NOTHING;
