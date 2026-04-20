import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-6">
          Kebijakan Privasi
        </h1>
        
        <div className="prose prose-blue max-w-none text-text-secondary">
          <p className="text-sm text-text-muted mb-8">Terakhir diperbarui: 18 April 2026</p>

          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk namun tidak terbatas pada: nama, alamat email, asal sekolah, target universitas, dan data interaksi saat mengerjakan latihan soal di platform kami.
          </p>

          <h2>2. Penggunaan Informasi</h2>
          <p>
            Informasi Anda kami gunakan untuk:
          </p>
          <ul>
            <li>Menyediakan, memelihara, dan meningkatkan layanan SoalSNBT.id</li>
            <li>Mempersonalisasi pengalaman belajar Anda (Latihan adaptif AI)</li>
            <li>Memproses transaksi pembayaran</li>
            <li>Mengirimkan informasi teknis, pembaruan, dan peringatan administratif</li>
            <li>Berkomunikasi dengan tim Customer Service</li>
          </ul>

          <h2>3. Keamanan Data</h2>
          <p>
            Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi informasi Anda. Kata sandi Anda dienkripsi tingkat tinggi melalui penyedia layanan autentikasi kami (Supabase). Namun, tidak ada transmisi data melalui internet yang 100% aman.
          </p>

          <h2>4. Berbagi Data dengan Pihak Ketiga</h2>
          <p>
            Kami tidak menjual data pribadi Anda. Kami hanya membagikan data kepada penyedia layanan pihak ketiga (seperti payment gateway Midtrans dan infrastruktur AI) yang diperlukan semata-mata untuk mengoperasikan platform ini, sesuai dengan kebijakan privasi mereka sendiri.
          </p>

          <h2>5. Cookies dan Pelacakan</h2>
          <p>
            Kami menggunakan cookies untuk mengenali Anda saat Anda kembali ke platform dan untuk melacak aktivitas analitik dasar demi meningkatkan UX. Anda dapat menonaktifkan cookies melalui pengaturan browser Anda, namun beberapa fitur mungkin tidak berfungsi optimal.
          </p>

          <h2>6. Hak Pengguna</h2>
          <p>
            Anda memiliki hak untuk meminta akses, perbaikan, atau penghapusan data pribadi Anda di sistem kami. Silakan hubungi tim dukungan kami jika Anda ingin mengajukan permohonan tersebut.
          </p>
        </div>
      </div>
    </div>
  );
}
