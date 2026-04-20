import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Trophy, Flame, Star, Medal } from "lucide-react";
import { getInitials } from "@/lib/utils";

export const metadata = {
  title: "Leaderboard",
};

export const revalidate = 60; // Cache for 60 seconds

export default async function LeaderboardPage() {
  const topUsers = await prisma.profile.findMany({
    take: 50,
    orderBy: {
      xp: "desc",
    },
    include: {
      userBadges: {
        include: {
          badge: true,
        },
        take: 3, // Just show top 3 recent badges for UI sake
        orderBy: {
          earnedAt: "desc",
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-800 text-text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Top 50 Pejuang PTN
          </h1>
          <p className="text-text-secondary mt-2">
            Peringkat diupdate secara berkala. Kumpulkan XP dengan terus latihan soal!
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Table header for desktop */}
        <div className="hidden md:grid grid-cols-[80px_minmax(200px,1fr)_120px_120px_150px] gap-4 p-4 bg-surface border-b border-border text-sm font-semibold text-text-secondary">
          <div className="text-center">Rank</div>
          <div>Pengguna</div>
          <div className="text-center">Level</div>
          <div className="text-center">Streak</div>
          <div className="text-right pr-4">Total XP</div>
        </div>

        {/* List items */}
        <div className="divide-y divide-border">
          {topUsers.map((user, index) => {
            const isTop3 = index < 3;
            const rankStyle = 
              index === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200" :
              index === 1 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200" :
              index === 2 ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500 border-orange-200" :
              "text-text-secondary font-medium";

            return (
              <div 
                key={user.id} 
                className={`grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_minmax(200px,1fr)_120px_120px_150px] gap-4 p-4 items-center hover:bg-surface/50 transition-colors ${
                  isTop3 ? "bg-surface/30" : ""
                }`}
              >
                {/* Rank */}
                <div className="flex justify-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isTop3 ? `border-2 ${rankStyle}` : rankStyle
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(user.fullName ?? user.username)
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-text-primary text-sm flex items-center gap-2 truncate">
                      {user.fullName ?? user.username}
                      {user.subscriptionTier === "pro" && (
                        <Star className="w-3 h-3 text-accent fill-accent flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-text-muted truncate">@{user.username}</div>
                  </div>
                </div>

                {/* Level (Hidden on small screens) */}
                <div className="hidden md:flex justify-center text-sm font-medium text-text-primary">
                  Lv.{user.level}
                </div>

                {/* Streak (Hidden on small screens) */}
                <div className="hidden md:flex justify-center items-center gap-1 text-sm font-medium">
                  {user.streakCurrent > 0 ? (
                    <>
                      <Flame className="w-4 h-4 text-accent" />
                      {user.streakCurrent}
                    </>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </div>

                {/* XP */}
                <div className="text-right pr-2">
                  {/* Mobile shows Level & Streak & XP combined */}
                  <div className="md:hidden flex flex-col items-end gap-1 mb-1 text-xs">
                    <span className="font-medium">Lv.{user.level}</span>
                    {user.streakCurrent > 0 && <span className="flex items-center text-accent"><Flame className="w-3 h-3"/>{user.streakCurrent}</span>}
                  </div>
                  <span className="font-heading font-700 text-primary text-base">
                    {user.xp.toLocaleString("id")} <span className="text-xs font-normal text-text-muted">XP</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
