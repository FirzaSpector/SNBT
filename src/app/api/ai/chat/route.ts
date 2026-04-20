import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

/**
 * POST /api/ai/chat
 * Streaming AI Tutor berbasis Claude API.
 *
 * KEPUTUSAN: Menggunakan Server-Sent Events (SSE) untuk streaming response
 * sehingga user bisa melihat response secara real-time karakter per karakter.
 * Rate limiting: 20 pesan/hari untuk free tier, unlimited untuk PRO.
 */

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(2000),
    })
  ).max(20), // Batas history percakapan
  context: z
    .object({
      soalKonten: z.string().optional(),
      jawabanUser: z.string().optional(),
      isCorrect: z.boolean().optional(),
      mapelNama: z.string().optional(),
    })
    .optional(),
});

// Prompt system untuk AI Tutor SNBT
const SYSTEM_PROMPT = `Kamu adalah Kak SNBT, AI tutor personal yang membantu siswa SMA mempersiapkan diri untuk SNBT (Seleksi Nasional Berbasis Tes) di Indonesia.

KEPRIBADIANMU:
- Semangat, supportif, dan memotivasi layaknya kakak kelas yang baik
- Tidak menggurui atau membuat siswa merasa bodoh
- Menggunakan bahasa Indonesia yang santai tapi tetap informatif
- Sesekali pakai emoji untuk membuat percakapan lebih hidup 😊
- Singkat dan langsung ke inti, jangan bertele-tele

KEMAMPUANMU:
- Menjelaskan konsep matematika, fisika, kimia, biologi, bahasa Indonesia
- Membahas soal SNBT/UTBK dari berbagai tahun
- Memberikan tips dan strategi mengerjakan soal
- Memotivasi siswa yang sedang down atau stres ujian
- Merender rumus matematika dalam format LaTeX yang dibungkus $...$ untuk inline, $$...$$ untuk display

ATURAN:
- Jika ada soal yang diberikan dalam konteks, langsung bahas soal tersebut
- Jangan pernah memberikan jawaban langsung tanpa penjelasan — selalu jelaskan prosesnya
- Jika siswa menjawab salah, pujian dulu usahanya, baru jelaskan yang benar
- Batasi jawaban maksimal 400 kata untuk menjaga fokus
- Gunakan LaTeX untuk semua rumus matematika`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validasi body
  let body: z.infer<typeof chatSchema>;
  try {
    const rawBody = await request.json() as unknown;
    body = chatSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  // TODO: Rate limiting — cek jumlah pesan hari ini dari DB
  // Untuk sekarang, skip untuk mempercepat development

  // Bangun konteks soal jika ada
  let contextMessage = "";
  if (body.context?.soalKonten) {
    contextMessage = `\n\n[KONTEKS SOAL]\nSiswa sedang mengerjakan soal berikut:\n"${body.context.soalKonten}"\n`;

    if (body.context.jawabanUser) {
      contextMessage += `Siswa menjawab: ${body.context.jawabanUser}\n`;
      contextMessage += `Jawaban ${body.context.isCorrect ? "BENAR ✓" : "SALAH ✗"}\n`;
    }

    if (body.context.mapelNama) {
      contextMessage += `Mata pelajaran: ${body.context.mapelNama}\n`;
    }
  }

  const systemWithContext = SYSTEM_PROMPT + contextMessage;

  // Buat streaming response
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemWithContext,
    messages: body.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Return sebagai SSE stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable Nginx buffering untuk streaming
    },
  });
}
