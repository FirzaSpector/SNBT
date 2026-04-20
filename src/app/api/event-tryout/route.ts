import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/event-tryout
 * Returns all tryout events (upcoming + past).
 */
export async function GET() {
  try {
    const events = await prisma.eventTryout.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: { select: { peserta: true } },
      },
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

import { z } from "zod";

/**
 * POST /api/event-tryout
 * Register current user to an event.
 * body: { eventId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const schema = z.object({
      eventId: z.string().uuid("Invalid event ID format"),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }
    const { eventId } = parsed.data;

    // Check event exists and has capacity
    const event = await prisma.eventTryout.findUnique({
      where: { id: eventId },
      include: { _count: { select: { peserta: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.maxPeserta && event._count.peserta >= event.maxPeserta) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Check if event hasn't ended
    if (new Date() > event.endDate) {
      return NextResponse.json({ error: "Event has ended" }, { status: 400 });
    }

    // Register user
    const peserta = await prisma.eventPeserta.upsert({
      where: { eventId_userId: { eventId, userId: user.id } },
      update: {},
      create: {
        eventId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: peserta });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
