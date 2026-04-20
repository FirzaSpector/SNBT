import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/event-tryout/[eventId]
 * Event details + participant count + user registration status.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const event = await prisma.eventTryout.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { peserta: true } },
        peserta: user ? {
          where: { userId: user.id },
          take: 1,
        } : false,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const isRegistered = user ? (event.peserta as unknown[]).length > 0 : false;

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        peserta: undefined,
        participantCount: event._count.peserta,
        isRegistered,
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
