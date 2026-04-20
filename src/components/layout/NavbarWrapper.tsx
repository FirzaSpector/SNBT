import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Navbar } from "./Navbar";
import { Profile } from "@/types";
import { redirect } from "next/navigation";

export async function NavbarWrapper() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Navbar profile={null} />;
  }

  try {
    const profileRaw = await prisma.profile.findUnique({
      where: { id: user.id },
    });

    if (!profileRaw) {
      redirect("/setup-profil");
    }

    const profile: Profile = {
      ...profileRaw,
      streakLastDate: profileRaw.streakLastDate
        ? new Date(profileRaw.streakLastDate)
        : null,
      subscriptionExpiresAt: profileRaw.subscriptionExpiresAt
        ? new Date(profileRaw.subscriptionExpiresAt)
        : null,
      subscriptionTier: profileRaw.subscriptionTier as "free" | "pro",
    };

    return <Navbar profile={profile} />;
  } catch (error) {
    console.error("Failed to fetch profile for Navbar:", error);
    return <Navbar profile={null} />;
  }
}
