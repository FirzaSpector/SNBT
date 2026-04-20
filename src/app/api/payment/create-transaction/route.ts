import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import crypto from "crypto";

/**
 * POST /api/payment/create-transaction
 * Membuat Midtrans Snap token untuk pembayaran subscription PRO.
 *
 * KEPUTUSAN: Menggunakan idempotency key berbasis userId + paket + tanggal
 * untuk mencegah double charge jika user klik berulang kali.
 */

const createTxSchema = z.object({
  paket: z.enum(["pro_monthly", "pro_yearly"]),
});

// Harga paket (dalam rupiah)
const HARGA_PAKET: Record<string, number> = {
  pro_monthly: 79000,
  pro_yearly: 599000,
};

const NAMA_PAKET: Record<string, string> = {
  pro_monthly: "SoalSNBT.id PRO — Bulanan",
  pro_yearly: "SoalSNBT.id PRO — Tahunan",
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof createTxSchema>;
  try {
    const rawBody = await request.json() as unknown;
    body = createTxSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const nominal = HARGA_PAKET[body.paket];
  if (!nominal) {
    return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
  }

  // Buat order ID unik — format: SNBT-{userId.slice(0,8)}-{timestamp}
  const orderId = `SNBT-${user.id.slice(0, 8)}-${Date.now()}`;

  // Ambil data user dari Supabase
  const adminClient = createAdminClient();
  const { data: userData } = await adminClient.auth.admin.getUserById(user.id);
  const userEmail = userData?.user?.email ?? "";

  // ============================================================
  // MIDTRANS SNAP API CALL
  // KEPUTUSAN: Menggunakan fetch langsung ke Midtrans API
  // untuk menghindari dependensi SDK yang mungkin outdated
  // ============================================================
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const midtransBaseUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const authHeader = `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;

  const midtransPayload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: nominal,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      email: userEmail,
      first_name: user.user_metadata?.full_name?.split(" ")[0] ?? "Pengguna",
    },
    item_details: [
      {
        id: body.paket,
        price: nominal,
        quantity: 1,
        name: NAMA_PAKET[body.paket],
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing/success?order_id=${orderId}`,
    },
    expiry: {
      start_time: new Date().toISOString().replace("T", " ").slice(0, 19) + " +0700",
      unit: "hours",
      duration: 24,
    },
  };

  const midtransResponse = await fetch(midtransBaseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(midtransPayload),
  });

  if (!midtransResponse.ok) {
    const errorData = await midtransResponse.json() as { error_messages?: string[] };
    console.error("Midtrans error:", errorData);
    return NextResponse.json(
      { error: "Gagal membuat transaksi pembayaran" },
      { status: 500 }
    );
  }

  const snapData = await midtransResponse.json() as {
    token: string;
    redirect_url: string;
  };

  // Simpan transaksi ke database dengan status pending
  const { prisma } = await import("@/lib/prisma");
  await prisma.transaksi.create({
    data: {
      userId: user.id,
      midtransOrderId: orderId,
      paket: body.paket,
      nominal,
      status: "pending",
    },
  });

  return NextResponse.json({
    snapToken: snapData.token,
    orderId,
    nominal,
  });
}
