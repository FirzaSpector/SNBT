import Link from "next/link";

export const metadata = {
  title: "Preview — SoalSNBT.id",
};

/**
 * Preview page — halaman ini dulunya menampilkan DashboardLight (sudah dihapus).
 * Sekarang mengarahkan ke dashboard yang sebenarnya.
 */
export default function PreviewPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-surface">
      <h1 className="font-heading text-2xl font-bold text-text-primary mb-4">
        Preview Dashboard
      </h1>
      <p className="text-text-secondary mb-6">
        Halaman preview telah diperbarui. Silakan login untuk melihat dashboard lengkap.
      </p>
      <Link
        href="/login"
        className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
      >
        Masuk ke Dashboard
      </Link>
    </div>
  );
}
