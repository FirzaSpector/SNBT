import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan",
};

export default function TermsPage() {
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
          Syarat dan Ketentuan
        </h1>
        
        <div className="prose prose-blue max-w-none text-text-secondary">
          <p className="text-sm text-text-muted mb-8">Terakhir diperbarui: 18 April 2026</p>
          
          <h2>1. Penerimaan Syarat</h2>
          <p>
            Dengan menggunakan platform SoalSNBT.id, Anda menyetujui semua syarat dan ketentuan yang berlaku. Jika Anda tidak menyetujui salah satu syarat, Anda tidak diperkenankan menggunakan layanan kami.
          </p>

          <h2>2. Akun Pengguna</h2>
          <p>
            Anda bertanggung jawab atas keamanan akun dan kata sandi Anda. Kami tidak bertanggung jawab atas kerugian yang ditimbulkan akibat kegagalan Anda menjaga keamanan akun.
          </p>

          <h2>3. Layanan Berbayar (PRO)</h2>
          <p>
            Fitur PRO adalah layanan berlangganan. Pembayaran bersifat final dan tidak dapat dikembalikan (non-refundable) kecuali ditentukan lain dalam kebijakan pengembalian dana kami. Akses akan diberikan segera setelah pembayaran dikonfirmasi oleh payment gateway.
          </p>

          <h2>4. Hak Cipta & Kekayaan Intelektual</h2>
          <p>
            Seluruh konten, soal, pembahasan, dan materi visual yang ada di SoalSNBT.id adalah milik kami. Anda tidak diperkenankan menyalin, mendistribusikan, atau menjual kembali konten kami tanpa izin tertulis.
          </p>

          <h2>5. Penggunaan AI Tutor</h2>
          <p>
            Fitur AI Tutor disediakan "apa adanya" untuk membantu pembelajaran. Walaupun kami berusaha memberikan penjelasan seakurat mungkin, pengguna disarankan untuk tetap memverifikasi informasi akademis pada sumber resmi atau guru sekolah.
          </p>
          
          <h2>6. Perubahan Layanan</h2>
          <p>
            Kami berhak untuk mengubah, menunda, atau menghentikan layanan (atau bagian di dalamnya) kapan saja dengan atau tanpa pemberitahuan.
          </p>
        </div>
      </div>
    </div>
  );
}
