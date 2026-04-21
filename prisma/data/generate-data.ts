import fs from 'fs';
import path from 'path';

// Master data Universitas (copied from seed.ts and optimized)
const univData = [
  // SUMATERA
  { kode: "USK", nama: "Universitas Syiah Kuala", singkatan: "USK", kota: "Banda Aceh", tipe: "univ" },
  { kode: "UNIMAL", nama: "Universitas Malikussaleh", singkatan: "Unimal", kota: "Aceh Utara", tipe: "univ" },
  { kode: "USU", nama: "Universitas Sumatera Utara", singkatan: "USU", kota: "Medan", tipe: "univ" },
  { kode: "UNIMED", nama: "Universitas Negeri Medan", singkatan: "Unimed", kota: "Medan", tipe: "univ" },
  { kode: "UNAND", nama: "Universitas Andalas", singkatan: "Unand", kota: "Padang", tipe: "univ" },
  { kode: "UNP", nama: "Universitas Negeri Padang", singkatan: "UNP", kota: "Padang", tipe: "univ" },
  { kode: "UNRI", nama: "Universitas Riau", singkatan: "Unri", kota: "Pekanbaru", tipe: "univ" },
  { kode: "UNJA", nama: "Universitas Jambi", singkatan: "Unja", kota: "Jambi", tipe: "univ" },
  { kode: "UNIB", nama: "Universitas Bengkulu", singkatan: "Unib", kota: "Bengkulu", tipe: "univ" },
  { kode: "UNSRI", nama: "Universitas Sriwijaya", singkatan: "Unsri", kota: "Palembang", tipe: "univ" },
  { kode: "UNILA", nama: "Universitas Lampung", singkatan: "Unila", kota: "Bandar Lampung", tipe: "univ" },
  
  // JAWA
  { kode: "UNTIRTA", nama: "Universitas Sultan Ageng Tirtayasa", singkatan: "Untirta", kota: "Serang", tipe: "univ" },
  { kode: "UI", nama: "Universitas Indonesia", singkatan: "UI", kota: "Depok", tipe: "univ_top" },
  { kode: "UNJ", nama: "Universitas Negeri Jakarta", singkatan: "UNJ", kota: "Jakarta", tipe: "univ" },
  { kode: "UPNVJ", nama: "UPN Veteran Jakarta", singkatan: "UPNVJ", kota: "Jakarta", tipe: "univ" },
  { kode: "IPB", nama: "Institut Pertanian Bogor", singkatan: "IPB", kota: "Bogor", tipe: "institut_pertanian" },
  { kode: "ITB", nama: "Institut Teknologi Bandung", singkatan: "ITB", kota: "Bandung", tipe: "institut_top" },
  { kode: "UNPAD", nama: "Universitas Padjadjaran", singkatan: "Unpad", kota: "Bandung", tipe: "univ_top" },
  { kode: "UPI", nama: "Universitas Pendidikan Indonesia", singkatan: "UPI", kota: "Bandung", tipe: "pendidikan" },
  { kode: "UNSOED", nama: "Universitas Jenderal Soedirman", singkatan: "Unsoed", kota: "Purwokerto", tipe: "univ" },
  { kode: "UNTIDAR", nama: "Universitas Tidar", singkatan: "Untidar", kota: "Magelang", tipe: "univ" },
  { kode: "UNS", nama: "Universitas Sebelas Maret", singkatan: "UNS", kota: "Surakarta", tipe: "univ_top" },
  { kode: "UNDIP", nama: "Universitas Diponegoro", singkatan: "Undip", kota: "Semarang", tipe: "univ_top" },
  { kode: "UNNES", nama: "Universitas Negeri Semarang", singkatan: "Unnes", kota: "Semarang", tipe: "pendidikan" },
  { kode: "UGM", nama: "Universitas Gadjah Mada", singkatan: "UGM", kota: "Yogyakarta", tipe: "univ_top" },
  { kode: "UNY", nama: "Universitas Negeri Yogyakarta", singkatan: "UNY", kota: "Yogyakarta", tipe: "pendidikan" },
  { kode: "UPNVY", nama: "UPN Veteran Yogyakarta", singkatan: "UPNVY", kota: "Sleman", tipe: "univ" },
  { kode: "UB", nama: "Universitas Brawijaya", singkatan: "UB", kota: "Malang", tipe: "univ_top" },
  { kode: "UM", nama: "Universitas Negeri Malang", singkatan: "UM", kota: "Malang", tipe: "pendidikan" },
  { kode: "UNEJ", nama: "Universitas Jember", singkatan: "Unej", kota: "Jember", tipe: "univ" },
  { kode: "UNAIR", nama: "Universitas Airlangga", singkatan: "Unair", kota: "Surabaya", tipe: "univ_top" },
  { kode: "ITS", nama: "Institut Teknologi Sepuluh Nopember", singkatan: "ITS", kota: "Surabaya", tipe: "institut_top" },
  { kode: "UNESA", nama: "Universitas Negeri Surabaya", singkatan: "Unesa", kota: "Surabaya", tipe: "pendidikan" },
  { kode: "UPNVJT", nama: "UPN Veteran Jawa Timur", singkatan: "UPNVJT", kota: "Surabaya", tipe: "univ" },
  { kode: "UTM", nama: "Universitas Trunojoyo Madura", singkatan: "UTM", kota: "Bangkalan", tipe: "univ" },

  // BALI & NUSA TENGGARA
  { kode: "UNUD", nama: "Universitas Udayana", singkatan: "Unud", kota: "Denpasar", tipe: "univ" },
  { kode: "UNDIKSHA", nama: "Universitas Pendidikan Ganesha", singkatan: "Undiksha", kota: "Singaraja", tipe: "pendidikan" },
  { kode: "UNRAM", nama: "Universitas Mataram", singkatan: "Unram", kota: "Mataram", tipe: "univ" },
  { kode: "UNDANA", nama: "Universitas Nusa Cendana", singkatan: "Undana", kota: "Kupang", tipe: "univ" },

  // KALIMANTAN
  { kode: "UNTAN", nama: "Universitas Tanjungpura", singkatan: "Untan", kota: "Pontianak", tipe: "univ" },
  { kode: "UPR", nama: "Universitas Palangka Raya", singkatan: "UPR", kota: "Palangka Raya", tipe: "univ" },
  { kode: "ULM", nama: "Universitas Lambung Mangkurat", singkatan: "ULM", kota: "Banjarmasin", tipe: "univ" },
  { kode: "UNMUL", nama: "Universitas Mulawarman", singkatan: "Unmul", kota: "Samarinda", tipe: "univ" },
  { kode: "UBT", nama: "Universitas Borneo Tarakan", singkatan: "UBT", kota: "Tarakan", tipe: "univ" },

  // SULAWESI
  { kode: "UNHAS", nama: "Universitas Hasanuddin", singkatan: "Unhas", kota: "Makassar", tipe: "univ_top" },
  { kode: "UNM", nama: "Universitas Negeri Makassar", singkatan: "UNM", kota: "Makassar", tipe: "pendidikan" },
  { kode: "UNSRAT", nama: "Universitas Sam Ratulangi", singkatan: "Unsrat", kota: "Manado", tipe: "univ" },
  { kode: "UNIMA", nama: "Universitas Negeri Manado", singkatan: "Unima", kota: "Minahasa", tipe: "pendidikan" },
  { kode: "UNTAD", nama: "Universitas Tadulako", singkatan: "Untad", kota: "Palu", tipe: "univ" },
  { kode: "UHO", nama: "Universitas Halu Oleo", singkatan: "UHO", kota: "Kendari", tipe: "univ" },
  { kode: "UNG", nama: "Universitas Negeri Gorontalo", singkatan: "UNG", kota: "Gorontalo", tipe: "univ" },

  // MALUKU & PAPUA
  { kode: "UNPATTI", nama: "Universitas Pattimura", singkatan: "Unpatti", kota: "Ambon", tipe: "univ" },
  { kode: "UNKHAIR", nama: "Universitas Khairun", singkatan: "Unkhair", kota: "Ternate", tipe: "univ" },
  { kode: "UNCEN", nama: "Universitas Cenderawasih", singkatan: "Uncen", kota: "Jayapura", tipe: "univ" },
  { kode: "UNIPA", nama: "Universitas Papua", singkatan: "Unipa", kota: "Manokwari", tipe: "univ" },
  { kode: "MUSAMUS", nama: "Universitas Musamus", singkatan: "Unmus", kota: "Merauke", tipe: "univ" },

  // INSTITUT LAINNYA
  { kode: "ITERA", nama: "Institut Teknologi Sumatera", singkatan: "Itera", kota: "Lampung Selatan", tipe: "institut" },
  { kode: "ITK", nama: "Institut Teknologi Kalimantan", singkatan: "ITK", kota: "Balikpapan", tipe: "institut" },
  { kode: "ISI-YK", nama: "Institut Seni Indonesia Yogyakarta", singkatan: "ISI Yogyakarta", kota: "Bantul", tipe: "seni" },
  { kode: "ISI-SKA", nama: "Institut Seni Indonesia Surakarta", singkatan: "ISI Surakarta", kota: "Surakarta", tipe: "seni" },
  { kode: "ISI-DPS", nama: "Institut Seni Indonesia Denpasar", singkatan: "ISI Denpasar", kota: "Denpasar", tipe: "seni" },
  { kode: "ISBI-BDG", nama: "Institut Seni Budaya Indonesia Bandung", singkatan: "ISBI Bandung", kota: "Bandung", tipe: "seni" },

  // POLITEKNIK
  { kode: "POLMAN", nama: "Politeknik Manufaktur Bandung", singkatan: "POLMAN", kota: "Bandung", tipe: "politeknik" },
  { kode: "PNJ", nama: "Politeknik Negeri Jakarta", singkatan: "PNJ", kota: "Depok", tipe: "politeknik" },
  { kode: "POLMED", nama: "Politeknik Negeri Medan", singkatan: "POLMED", kota: "Medan", tipe: "politeknik" },
  { kode: "POLBAN", nama: "Politeknik Negeri Bandung", singkatan: "POLBAN", kota: "Bandung", tipe: "politeknik" },
  { kode: "POLINES", nama: "Politeknik Negeri Semarang", singkatan: "POLINES", kota: "Semarang", tipe: "politeknik" },
  { kode: "POLSRI", nama: "Politeknik Negeri Sriwijaya", singkatan: "POLSRI", kota: "Palembang", tipe: "politeknik" },
  { kode: "POLINELA", nama: "Politeknik Negeri Lampung", singkatan: "POLINELA", kota: "Bandar Lampung", tipe: "politeknik" },
  { kode: "POLNAM", nama: "Politeknik Negeri Ambon", singkatan: "POLNAM", kota: "Ambon", tipe: "politeknik" },
  { kode: "PNP", nama: "Politeknik Negeri Padang", singkatan: "PNP", kota: "Padang", tipe: "politeknik" },
  { kode: "PNB", nama: "Politeknik Negeri Bali", singkatan: "PNB", kota: "Badung", tipe: "politeknik" },
  { kode: "POLNEP", nama: "Politeknik Negeri Pontianak", singkatan: "POLNEP", kota: "Pontianak", tipe: "politeknik" },
  { kode: "PNUP", nama: "Politeknik Negeri Ujung Pandang", singkatan: "PNUP", kota: "Makassar", tipe: "politeknik" },
  { kode: "POLIMDO", nama: "Politeknik Negeri Manado", singkatan: "POLIMDO", kota: "Manado", tipe: "politeknik" },
  { kode: "PPNS", nama: "Politeknik Perkapalan Negeri Surabaya", singkatan: "PPNS", kota: "Surabaya", tipe: "politeknik" },
  { kode: "POLIBAN", nama: "Politeknik Negeri Banjarmasin", singkatan: "POLIBAN", kota: "Banjarmasin", tipe: "politeknik" },
  { kode: "PNL", nama: "Politeknik Negeri Lhokseumawe", singkatan: "PNL", kota: "Lhokseumawe", tipe: "politeknik" },
  { kode: "PNK", nama: "Politeknik Negeri Kupang", singkatan: "PNK", kota: "Kupang", tipe: "politeknik" },
  { kode: "PENS", nama: "Politeknik Elektronika Negeri Surabaya", singkatan: "PENS", kota: "Surabaya", tipe: "politeknik" },
  { kode: "POLIJE", nama: "Politeknik Negeri Jember", singkatan: "POLIJE", kota: "Jember", tipe: "politeknik" },
  { kode: "POLINEMA", nama: "Politeknik Negeri Malang", singkatan: "POLINEMA", kota: "Malang", tipe: "politeknik" },
  { kode: "POLNES", nama: "Politeknik Negeri Samarinda", singkatan: "POLNES", kota: "Samarinda", tipe: "politeknik" },
  { kode: "POLIBATAM", nama: "Politeknik Negeri Batam", singkatan: "POLIBATAM", kota: "Batam", tipe: "politeknik" },
  
  // UIN
  { kode: "UIN-JKT", nama: "UIN Syarif Hidayatullah Jakarta", singkatan: "UIN Jakarta", kota: "Jakarta", tipe: "uin" },
  { kode: "UIN-SUKA", nama: "UIN Sunan Kalijaga", singkatan: "UIN Suka", kota: "Yogyakarta", tipe: "uin" },
  { kode: "UIN-SGD", nama: "UIN Sunan Gunung Djati", singkatan: "UIN Bandung", kota: "Bandung", tipe: "uin" },
  { kode: "UIN-SA", nama: "UIN Sunan Ampel", singkatan: "UINSA", kota: "Surabaya", tipe: "uin" },
  { kode: "UIN-MALANG", nama: "UIN Maulana Malik Ibrahim", singkatan: "UIN Malang", kota: "Malang", tipe: "uin" },
  { kode: "UIN-WALI", nama: "UIN Walisongo", singkatan: "UIN Walisongo", kota: "Semarang", tipe: "uin" },
  { kode: "UIN-AM", nama: "UIN Alauddin", singkatan: "UIN Alauddin", kota: "Makassar", tipe: "uin" },
  { kode: "UIN-SU", nama: "UIN Sumatera Utara", singkatan: "UINSU", kota: "Medan", tipe: "uin" },
];

const templates = {
  saintekDasar: [
    { nama: "Matematika", rumpun: "SAINTEK", dayaTampung: 80, b: 600 },
    { nama: "Fisika", rumpun: "SAINTEK", dayaTampung: 70, b: 580 },
    { nama: "Kimia", rumpun: "SAINTEK", dayaTampung: 70, b: 590 },
    { nama: "Biologi", rumpun: "SAINTEK", dayaTampung: 80, b: 600 },
    { nama: "Statistika", rumpun: "SAINTEK", dayaTampung: 60, b: 620 },
    { nama: "Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 100, b: 680 },
    { nama: "Sistem Informasi", rumpun: "SAINTEK", dayaTampung: 90, b: 660 },
  ],
  saintekTeknik: [
    { nama: "Teknik Sipil", rumpun: "SAINTEK", dayaTampung: 120, b: 640 },
    { nama: "Teknik Mesin", rumpun: "SAINTEK", dayaTampung: 100, b: 630 },
    { nama: "Teknik Elektro", rumpun: "SAINTEK", dayaTampung: 100, b: 640 },
    { nama: "Teknik Lingkungan", rumpun: "SAINTEK", dayaTampung: 70, b: 620 },
    { nama: "Teknik Industri", rumpun: "SAINTEK", dayaTampung: 110, b: 660 },
    { nama: "Arsitektur", rumpun: "SAINTEK", dayaTampung: 80, b: 650 },
    { nama: "Perencanaan Wilayah dan Kota", rumpun: "SAINTEK", dayaTampung: 70, b: 640 },
  ],
  saintekMedis: [
    { nama: "Kedokteran", rumpun: "SAINTEK", dayaTampung: 150, b: 720 },
    { nama: "Kedokteran Gigi", rumpun: "SAINTEK", dayaTampung: 80, b: 690 },
    { nama: "Farmasi", rumpun: "SAINTEK", dayaTampung: 100, b: 680 },
    { nama: "Ilmu Keperawatan", rumpun: "SAINTEK", dayaTampung: 120, b: 630 },
    { nama: "Kesehatan Masyarakat", rumpun: "SAINTEK", dayaTampung: 150, b: 640 },
    { nama: "Gizi", rumpun: "SAINTEK", dayaTampung: 80, b: 650 },
  ],
  saintekPertanian: [
    { nama: "Agribisnis", rumpun: "SAINTEK", dayaTampung: 120, b: 610 },
    { nama: "Agroteknologi", rumpun: "SAINTEK", dayaTampung: 150, b: 590 },
    { nama: "Ilmu Tanah", rumpun: "SAINTEK", dayaTampung: 80, b: 580 },
    { nama: "Teknologi Pangan", rumpun: "SAINTEK", dayaTampung: 90, b: 630 },
    { nama: "Kehutanan", rumpun: "SAINTEK", dayaTampung: 100, b: 600 },
    { nama: "Peternakan", rumpun: "SAINTEK", dayaTampung: 140, b: 590 },
  ],
  soshumDasar: [
    { nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 250, b: 660 },
    { nama: "Manajemen", rumpun: "SOSHUM", dayaTampung: 200, b: 680 },
    { nama: "Akuntansi", rumpun: "SOSHUM", dayaTampung: 180, b: 670 },
    { nama: "Ilmu Ekonomi", rumpun: "SOSHUM", dayaTampung: 100, b: 640 },
  ],
  soshumSosial: [
    { nama: "Ilmu Komunikasi", rumpun: "SOSHUM", dayaTampung: 120, b: 670 },
    { nama: "Psikologi", rumpun: "SOSHUM", dayaTampung: 150, b: 680 },
    { nama: "Ilmu Hubungan Internasional", rumpun: "SOSHUM", dayaTampung: 80, b: 660 },
    { nama: "Administrasi Publik", rumpun: "SOSHUM", dayaTampung: 130, b: 640 },
    { nama: "Administrasi Bisnis", rumpun: "SOSHUM", dayaTampung: 120, b: 650 },
    { nama: "Ilmu Pemerintahan", rumpun: "SOSHUM", dayaTampung: 100, b: 630 },
    { nama: "Sosiologi", rumpun: "SOSHUM", dayaTampung: 90, b: 610 },
    { nama: "Antropologi", rumpun: "SOSHUM", dayaTampung: 80, b: 600 },
  ],
  soshumSastra: [
    { nama: "Sastra Inggris", rumpun: "SOSHUM", dayaTampung: 90, b: 630 },
    { nama: "Sastra Indonesia", rumpun: "SOSHUM", dayaTampung: 100, b: 610 },
    { nama: "Ilmu Sejarah", rumpun: "SOSHUM", dayaTampung: 70, b: 590 },
  ],
  pendidikanDasar: [
    { nama: "Pendidikan Guru Sekolah Dasar (PGSD)", rumpun: "SOSHUM", dayaTampung: 250, b: 640 },
    { nama: "Pendidikan Guru PAUD", rumpun: "SOSHUM", dayaTampung: 100, b: 590 },
    { nama: "Bimbingan dan Konseling", rumpun: "SOSHUM", dayaTampung: 90, b: 620 },
    { nama: "Pendidikan Jasmani, Kesehatan & Rekreasi", rumpun: "SAINTEK", dayaTampung: 150, b: 580 },
    { nama: "Kurikulum dan Teknologi Pendidikan", rumpun: "SOSHUM", dayaTampung: 80, b: 610 },
  ],
  pendidikanSaintek: [
    { nama: "Pendidikan Matematika", rumpun: "SAINTEK", dayaTampung: 100, b: 620 },
    { nama: "Pendidikan Biologi", rumpun: "SAINTEK", dayaTampung: 90, b: 600 },
    { nama: "Pendidikan Fisika", rumpun: "SAINTEK", dayaTampung: 80, b: 590 },
    { nama: "Pendidikan Kimia", rumpun: "SAINTEK", dayaTampung: 80, b: 590 },
    { nama: "Pendidikan Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 80, b: 630 },
  ],
  pendidikanSoshum: [
    { nama: "Pendidikan Bahasa Indonesia", rumpun: "SOSHUM", dayaTampung: 120, b: 620 },
    { nama: "Pendidikan Bahasa Inggris", rumpun: "SOSHUM", dayaTampung: 120, b: 630 },
    { nama: "Pendidikan Ekonomi", rumpun: "SOSHUM", dayaTampung: 100, b: 610 },
    { nama: "Pendidikan Geografi", rumpun: "SOSHUM", dayaTampung: 80, b: 600 },
    { nama: "Pendidikan Sejarah", rumpun: "SOSHUM", dayaTampung: 80, b: 590 },
    { nama: "Pendidikan Sosiologi", rumpun: "SOSHUM", dayaTampung: 80, b: 600 },
  ],
  politeknikTeknik: [
    { nama: "D4 Teknik Mesin", rumpun: "SAINTEK", dayaTampung: 80, b: 610 },
    { nama: "D4 Teknik Sipil", rumpun: "SAINTEK", dayaTampung: 90, b: 620 },
    { nama: "D4 Teknik Elektronika", rumpun: "SAINTEK", dayaTampung: 80, b: 610 },
    { nama: "D4 Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 100, b: 640 },
    { nama: "D4 Teknik Telekomunikasi", rumpun: "SAINTEK", dayaTampung: 70, b: 610 },
    { nama: "D3 Teknik Mesin", rumpun: "SAINTEK", dayaTampung: 120, b: 580 },
    { nama: "D3 Teknik Sipil", rumpun: "SAINTEK", dayaTampung: 120, b: 590 },
    { nama: "D3 Teknik Elektro", rumpun: "SAINTEK", dayaTampung: 100, b: 580 },
  ],
  politeknikSoshum: [
    { nama: "D4 Akuntansi Manajerial", rumpun: "SOSHUM", dayaTampung: 90, b: 630 },
    { nama: "D4 Administrasi Bisnis Terapan", rumpun: "SOSHUM", dayaTampung: 100, b: 620 },
    { nama: "D3 Akuntansi", rumpun: "SOSHUM", dayaTampung: 150, b: 610 },
    { nama: "D3 Administrasi Bisnis", rumpun: "SOSHUM", dayaTampung: 150, b: 600 },
    { nama: "D3 Usaha Perjalanan Wisata", rumpun: "SOSHUM", dayaTampung: 80, b: 580 },
  ],
  uinSoshum: [
    { nama: "Psikologi", rumpun: "SOSHUM", dayaTampung: 120, b: 640 },
    { nama: "Ilmu Hukum", rumpun: "SOSHUM", dayaTampung: 150, b: 630 },
    { nama: "Manajemen", rumpun: "SOSHUM", dayaTampung: 150, b: 640 },
    { nama: "Akuntansi", rumpun: "SOSHUM", dayaTampung: 120, b: 630 },
    { nama: "Ilmu Politik", rumpun: "SOSHUM", dayaTampung: 80, b: 600 },
    { nama: "Sosiologi", rumpun: "SOSHUM", dayaTampung: 80, b: 600 },
  ],
  uinSaintek: [
    { nama: "Teknik Informatika", rumpun: "SAINTEK", dayaTampung: 100, b: 640 },
    { nama: "Sistem Informasi", rumpun: "SAINTEK", dayaTampung: 90, b: 630 },
    { nama: "Matematika", rumpun: "SAINTEK", dayaTampung: 60, b: 590 },
    { nama: "Biologi", rumpun: "SAINTEK", dayaTampung: 60, b: 580 },
    { nama: "Arsitektur", rumpun: "SAINTEK", dayaTampung: 70, b: 610 },
    { nama: "Kesehatan Masyarakat", rumpun: "SAINTEK", dayaTampung: 100, b: 620 },
  ],
  seni: [
    { nama: "Desain Komunikasi Visual (DKV)", rumpun: "SOSHUM", dayaTampung: 100, b: 620 },
    { nama: "Seni Rupa Murni", rumpun: "SOSHUM", dayaTampung: 60, b: 580 },
    { nama: "Seni Musik", rumpun: "SOSHUM", dayaTampung: 60, b: 590 },
    { nama: "Seni Tari", rumpun: "SOSHUM", dayaTampung: 50, b: 560 },
    { nama: "Seni Karawitan", rumpun: "SOSHUM", dayaTampung: 40, b: 550 },
    { nama: "Desain Interior", rumpun: "SOSHUM", dayaTampung: 60, b: 610 },
    { nama: "Televisi dan Film", rumpun: "SOSHUM", dayaTampung: 80, b: 630 },
  ]
};

// Map based on type
const prodis: any[] = [];
let counter = 1;

for (const univ of univData) {
  let targetTemplates: any[][] = [];
  let passingGradeMod = 0; // Modifier based on tier
  
  if (univ.tipe === "univ_top") {
    targetTemplates = [templates.saintekDasar, templates.saintekTeknik, templates.saintekMedis, templates.saintekPertanian, templates.soshumDasar, templates.soshumSosial, templates.soshumSastra];
    passingGradeMod = 40;
  } else if (univ.tipe === "univ") {
    targetTemplates = [templates.saintekDasar, templates.saintekTeknik, templates.saintekPertanian, templates.soshumDasar, templates.soshumSosial, templates.soshumSastra];
    const hasMedisMap = ["USK", "UNIMAL", "USU", "UNAND", "UNRI", "UNJA", "UNIB", "UNSRI", "UNILA", "UNTIRTA", "UPNVJ", "UNSOED", "UPNVY", "UNEJ", "UNRAM", "UNDANA", "UNTAN", "UPR", "ULM", "UNMUL", "UNSRAT", "UNTAD", "UHO", "UNPATTI", "UNKHAIR", "UNCEN", "UNIPA"];
    if (hasMedisMap.includes(univ.kode)) {
      targetTemplates.push(templates.saintekMedis);
    }
    passingGradeMod = -5;
  } else if (univ.tipe === "institut_top") {
    targetTemplates = [templates.saintekDasar, templates.saintekTeknik, templates.soshumDasar, templates.seni];
    passingGradeMod = 50;
  } else if (univ.tipe === "institut") {
    targetTemplates = [templates.saintekDasar, templates.saintekTeknik];
    passingGradeMod = 5;
  } else if (univ.tipe === "institut_pertanian") {
    targetTemplates = [templates.saintekDasar, templates.saintekPertanian, templates.saintekTeknik, templates.soshumDasar, templates.soshumSosial];
    passingGradeMod = 45;
  } else if (univ.tipe === "pendidikan") {
    targetTemplates = [templates.pendidikanDasar, templates.pendidikanSaintek, templates.pendidikanSoshum, templates.saintekDasar, templates.soshumSosial, templates.soshumSastra, templates.soshumDasar];
    passingGradeMod = 10;
  } else if (univ.tipe === "politeknik") {
    targetTemplates = [templates.politeknikTeknik, templates.politeknikSoshum];
    passingGradeMod = -10;
  } else if (univ.tipe === "uin") {
    targetTemplates = [templates.uinSoshum, templates.uinSaintek, templates.pendidikanDasar, templates.pendidikanSoshum];
    passingGradeMod = -5;
  } else if (univ.tipe === "seni") {
    targetTemplates = [templates.seni];
    passingGradeMod = -15;
  }

  // Generate Prodi
  for (const group of targetTemplates) {
    for (const p of group) {
      // Create a unique deterministic code
      let words = p.nama.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").map((w: string) => w.substring(0, 2).toUpperCase()).join("");
      if (words.length > 8) words = words.substring(0, 8);
      let kode = `${words}-${univ.kode}`;
      
      // Calculate deterministic passing grade and daya tampung (no randoms)
      const baseLen = p.nama.length + univ.kode.length;
      const modOffset = (baseLen % 11) - 5; // Result between -5 to +5
      const capOffset = (baseLen % 15) - 7;
      
      let pg = p.b + passingGradeMod + modOffset;
      
      prodis.push({
        univKode: univ.kode,
        kode: kode,
        nama: p.nama,
        rumpun: p.rumpun,
        dayaTampung: p.dayaTampung + capOffset,
        passingGrade: pg
      });
      counter++;
    }
  }
}

// Clean up univData formatting for output
const finalUnivData = univData.map(u => ({
  kode: u.kode,
  nama: u.nama,
  singkatan: u.singkatan,
  kota: u.kota
}));

console.log(`Generated ${prodis.length} Program Studi untuk ${finalUnivData.length} PTN.`);

const baseDir = path.join(process.cwd(), 'prisma', 'data');
fs.writeFileSync(path.join(baseDir, 'universitas.json'), JSON.stringify(finalUnivData, null, 2), 'utf-8');
fs.writeFileSync(path.join(baseDir, 'prodi.json'), JSON.stringify(prodis, null, 2), 'utf-8');

console.log('Successfully saved to prisma/data/universitas.json and prisma/data/prodi.json');
