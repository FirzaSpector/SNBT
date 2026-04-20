import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Menggabungkan class Tailwind secara aman + merge konflik */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format angka ke format Rupiah */
export function formatRupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nominal);
}

/** Format durasi dari detik ke menit:detik */
export function formatDurasi(detik: number): string {
  const menit = Math.floor(detik / 60);
  const sisaDetik = detik % 60;
  return `${menit}:${sisaDetik.toString().padStart(2, "0")}`;
}

/** Hitung XP yang didapat dari hasil sesi latihan */
export function hitungXP(params: {
  soalBenar: number;
  totalSoal: number;
  durasiDetik: number;
  isPremiumSession: boolean;
}): number {
  const { soalBenar, totalSoal, durasiDetik, isPremiumSession } = params;
  const akurasi = soalBenar / totalSoal;

  // Basis XP: 10 per soal benar
  let xp = soalBenar * 10;

  // Bonus akurasi tinggi
  if (akurasi >= 0.9) xp += 50;
  else if (akurasi >= 0.8) xp += 25;
  else if (akurasi >= 0.7) xp += 10;

  // Bonus kecepatan (rata-rata < 60 detik per soal)
  const rataWaktu = durasiDetik / totalSoal;
  if (rataWaktu < 30) xp += 30;
  else if (rataWaktu < 60) xp += 15;

  // Multiplier premium
  if (isPremiumSession) xp = Math.floor(xp * 1.5);

  return xp;
}

/** Hitung level dari total XP */
export function hitungLevel(totalXp: number): number {
  // Formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

/** XP yang dibutuhkan untuk level berikutnya */
export function xpUntukLevel(level: number): number {
  return level * level * 100;
}

/** Truncate teks panjang */
export function truncate(teks: string, maxLength: number): string {
  if (teks.length <= maxLength) return teks;
  return teks.slice(0, maxLength) + "...";
}

/** Generate initial avatar dari nama */
export function getInitials(nama: string): string {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Relative time format dalam Bahasa Indonesia */
export function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMenit = Math.floor(diffMs / 60000);
  const diffJam = Math.floor(diffMenit / 60);
  const diffHari = Math.floor(diffJam / 24);

  if (diffMenit < 1) return "baru saja";
  if (diffMenit < 60) return `${diffMenit} menit lalu`;
  if (diffJam < 24) return `${diffJam} jam lalu`;
  if (diffHari < 7) return `${diffHari} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
}
