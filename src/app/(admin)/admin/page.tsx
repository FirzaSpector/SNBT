import { prisma } from "@/lib/prisma";
import { Users, CreditCard, Activity, Database } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  // Query counts
  const totalUsers = await prisma.profile.count();
  const proUsers = await prisma.profile.count({
    where: { subscriptionTier: "pro" }
  });
  
  const totalSoal = await prisma.soal.count();
  const totalTransaksi = await prisma.transaksi.count({
    where: { status: "settlement" }
  });

  const revenue = await prisma.transaksi.aggregate({
    _sum: { nominal: true },
    where: { status: "settlement" }
  });

  const totalRevenue = revenue._sum.nominal || 0;

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">Admin Panel</h1>
            <p className="text-text-secondary">Ringkasan platform SoalSNBT.id</p>
          </div>
          <Link href="/" className="text-primary font-medium hover:underline">
            Kembali ke Web
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card: Total Users */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-text-secondary text-sm">Total Pengguna</h2>
            </div>
            <div className="text-3xl font-heading font-bold text-text-primary mt-2">
              {totalUsers.toLocaleString('id')}
            </div>
            <div className="text-xs text-text-muted mt-2">
              {proUsers.toLocaleString('id')} pengguna PRO
            </div>
          </div>

          {/* Card: Revenue */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-text-secondary text-sm">Total Pendapatan</h2>
            </div>
            <div className="text-3xl font-heading font-bold text-text-primary mt-2">
              Rp {totalRevenue.toLocaleString('id')}
            </div>
            <div className="text-xs text-text-muted mt-2">
              Dari {totalTransaksi} transaksi sukses
            </div>
          </div>

          {/* Card: Content */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-text-secondary text-sm">Total Bank Soal</h2>
            </div>
            <div className="text-3xl font-heading font-bold text-text-primary mt-2">
              {totalSoal.toLocaleString('id')}
            </div>
            <div className="text-xs text-text-muted mt-2">
              Soal aktif di sistem
            </div>
          </div>

          {/* Card: System Health */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-text-secondary text-sm">Status Sistem</h2>
            </div>
            <div className="text-2xl font-heading font-bold text-success mt-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              Online
            </div>
            <div className="text-xs text-text-muted mt-3">
              API & Database Normal
            </div>
          </div>
        </div>

        <div className="bg-card border border-border flex flex-col items-center justify-center py-20 rounded-xl text-text-secondary text-center max-w-2xl mx-auto shadow-sm">
          <Database className="w-16 h-16 mb-4 text-border" />
          <h3 className="font-bold text-xl text-text-primary mb-2">Manajemen Konten Sedang Dibangun</h3>
          <p className="max-w-md">Fitur moderasi soal terbuka, manajemen bank soal, dan detail transaksi pengguna akan segera hadir di modul Admin V2.</p>
        </div>
      </div>
    </div>
  );
}
