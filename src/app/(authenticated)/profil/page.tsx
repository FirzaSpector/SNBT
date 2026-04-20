import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, MapPin, School, Target, Zap, Trophy, Flame, Star, Calendar } from "lucide-react";
import { getInitials } from "@/lib/utils";

export const metadata = {
  title: "Profil Saya | SoalSNBT.id",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect("/setup-profil");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 mt-16">
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Header Profile */}
        <div className="gradient-primary h-32 relative"></div>
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 relative -mt-12 sm:-mt-16 sm:items-end">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-surface flex items-center justify-center overflow-hidden flex-shrink-0 relative z-10 shadow-sm">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.fullName || profile.username || "User"} fill className="object-cover" />
              ) : (
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {getInitials(profile.fullName || profile.username)}
                </span>
              )}
            </div>
            <div className="flex-grow pb-2 md:pb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                {profile.fullName || profile.username}
              </h1>
              <p className="text-text-secondary font-medium mt-1">@{profile.username}</p>
            </div>
            {profile.subscriptionTier === "pro" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-accent rounded-full font-semibold text-sm mb-2 shadow-sm border border-accent/20">
                <Star className="w-4 h-4 fill-accent" />
                PRO Member
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Pribadi */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary px-1">Informasi Pribadi</h2>
              <div className="bg-surface rounded-xl p-5 space-y-4 border border-border shadow-sm">
                <InfoItem icon={User} label="Nama Lengkap" value={profile.fullName || "-"} />
                <div className="w-full h-px bg-border/60"></div>
                <InfoItem icon={School} label="Asal Sekolah" value={profile.school || "-"} />
                <div className="w-full h-px bg-border/60"></div>
                <InfoItem icon={MapPin} label="Kota" value={profile.city || "-"} />
              </div>
            </div>

            {/* Target SNBT */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary px-1">Target Berprestasi</h2>
              <div className="bg-primary-light/30 rounded-xl p-5 space-y-4 border border-primary/20 shadow-sm">
                <InfoItem icon={Target} label="Universitas Target" value={profile.targetUniversity || "-"} color="text-primary" />
                <div className="w-full h-px bg-primary/10"></div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                    <Trophy className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Program Studi Target</p>
                    <p className="text-sm font-semibold text-text-primary">{profile.targetMajor || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Gamifikasi */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text-primary px-1 mb-4">Statistik Belajar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon={Zap} label="Level" value={profile.level} color="text-accent" bg="bg-accent-light" border="border-accent/20" />
              <StatCard icon={Trophy} label="XP Terkumpul" value={profile.xp} color="text-primary" bg="bg-primary-light" border="border-primary/20" />
              <StatCard icon={Flame} label="Streak Aktif" value={`${profile.streakCurrent} Kali`} color="text-danger" bg="bg-danger-light" border="border-danger/20" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, color = "text-text-secondary" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-border/80 ${color}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-xs text-text-secondary font-medium">{label}</p>
        <p className="text-sm font-semibold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg, border }: { icon: any, label: string, value: string | number, color: string, bg: string, border: string }) {
  return (
    <div className={`bg-gradient-to-br from-white to-surface border ${border} p-4 rounded-xl flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center flex-shrink-0 mb-1`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <p className="text-xl font-bold text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}
