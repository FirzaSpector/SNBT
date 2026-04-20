import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Settings, Shield, Bell, Zap, LogOut, ChevronRight, UserCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pengaturan | SoalSNBT.id",
};

export default async function PengaturanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-white" />
          </div>
          Pengaturan Akun
        </h1>
        <p className="text-text-secondary mt-2 ml-1">
          Kelola preferensi akun dan setelan aplikasi belajar kamu
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Akun */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-text-secondary" /> Keamanan & Akses
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-xl border border-border/60 hover:border-primary/30 transition-colors">
                <div className="mb-3 sm:mb-0">
                  <p className="font-semibold text-text-primary">Email Akun</p>
                  <p className="text-sm text-text-secondary">{user.email}</p>
                </div>
                <span className="text-xs font-semibold bg-success/10 text-success px-3 py-1 rounded-full w-fit">Terverifikasi</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface rounded-xl border border-border/60 hover:border-primary/30 transition-colors">
                <div className="mb-3 sm:mb-0">
                  <p className="font-semibold text-text-primary">Ubah Password</p>
                  <p className="text-sm text-text-secondary">Perbarui kata sandi secara berkala</p>
                </div>
                <button className="text-sm font-semibold bg-white border border-border px-4 py-2 rounded-lg hover:bg-surface transition-colors shadow-sm w-fit sm:w-auto">
                  Perbarui Kata Sandi
                </button>
              </div>
            </div>
          </section>

          {/* Profil */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-text-secondary" /> Data Kendiri
            </h2>
            <div className="space-y-3">
              <Link href="/setup-profil" className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary-light/10 transition-colors group">
                <div>
                  <p className="font-semibold text-text-primary">Edit Profil & Target</p>
                  <p className="text-sm text-text-secondary">Ubah target universitas dan program studi</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </section>

          {/* Notifikasi */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-text-secondary" /> Notifikasi
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border/60">
                <div className="pr-4">
                  <p className="font-semibold text-text-primary flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" /> Email Pengingat Belajar
                  </p>
                  <p className="text-sm text-text-secondary">Dapatkan email pengingat harian untuk mempertahankan streak</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border/60">
                <div className="pr-4">
                  <p className="font-semibold text-text-primary">Info Event & Tryout</p>
                  <p className="text-sm text-text-secondary">Berita tentang promo dan Tryout Nasional</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Zona Bahaya */}
          <section className="pt-6 mt-8 border-t border-border">
            <h2 className="text-lg font-semibold text-danger mb-4">Zona Bahaya</h2>
            <div className="p-5 bg-danger-light/30 border border-danger/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-danger">Hapus Akun Permanen</p>
                <p className="text-sm text-danger/80">Semua data latih dan progres kamu akan dihapus selamanya dan tidak dapat dipulihkan.</p>
              </div>
              <button className="text-sm font-semibold bg-danger text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2 flex-shrink-0 w-fit">
                <LogOut className="w-4 h-4" />
                Hapus Akun
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
