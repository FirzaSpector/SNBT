import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/payment/notification
 * Webhook dari Midtrans — dipanggil setiap kali status pembayaran berubah.
 *
 * KEPUTUSAN: Verifikasi signature menggunakan SHA-512 HMAC
 * sebelum memproses apapun untuk mencegah request palsu.
 *
 * Endpoint ini TIDAK memerlukan autentikasi user —
 * security dilakukan via signature verification Midtrans.
 */

interface MidtransNotification {
  order_id: string;
  transaction_id: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type: string;
  gross_amount: string;
  signature_key: string;
  status_code: string;
}

export async function POST(request: Request) {
  let notification: MidtransNotification;

  try {
    const body = await request.json() as unknown;
    notification = body as MidtransNotification;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ============================================================
  // VERIFIKASI SIGNATURE MIDTRANS
  // Formula: SHA-512(order_id + status_code + gross_amount + server_key)
  // ============================================================
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const signatureRaw = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(signatureRaw)
    .digest("hex");

  if (notification.signature_key !== expectedSignature) {
    console.error("Midtrans signature mismatch!");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ============================================================
  // PROSES STATUS TRANSAKSI
  // ============================================================
  const { transaction_status, fraud_status, order_id, transaction_id, payment_type } =
    notification;

  // Tentukan status internal berdasarkan status Midtrans
  let status: string;
  let isSuccess = false;

  if (transaction_status === "capture") {
    if (fraud_status === "accept") {
      status = "success";
      isSuccess = true;
    } else {
      status = "pending";
    }
  } else if (transaction_status === "settlement") {
    status = "success";
    isSuccess = true;
  } else if (["cancel", "deny", "chargeback"].includes(transaction_status)) {
    status = "failed";
  } else if (transaction_status === "expire") {
    status = "expired";
  } else {
    status = "pending";
  }

  // Update transaksi di database
  const transaksi = await prisma.transaksi.update({
    where: { midtransOrderId: order_id },
    data: {
      midtransTransactionId: transaction_id,
      status,
      metodeBayar: payment_type,
    },
  });

  // Jika pembayaran sukses, aktifkan subscription user
  if (isSuccess) {
    const now = new Date();
    let expiresAt: Date;

    if (transaksi.paket === "pro_yearly") {
      expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else {
      // pro_monthly
      expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    await prisma.profile.update({
      where: { id: transaksi.userId },
      data: {
        subscriptionTier: "pro",
        subscriptionExpiresAt: expiresAt,
      },
    });

    console.log(
      `✅ Subscription aktif untuk user ${transaksi.userId} sampai ${expiresAt.toISOString()}`
    );
  }

  // Midtrans mengharapkan HTTP 200 sebagai acknowledgment
  return NextResponse.json({ status: "OK" });
}
