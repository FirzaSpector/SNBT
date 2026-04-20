"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Brain,
  Minimize2,
  Bot,
  User,
} from "lucide-react";
import type { AIChatMessage, AITutorContext } from "@/types";
import { MathRenderer } from "@/components/question/MathRenderer";
import { cn } from "@/lib/utils";

interface TutorChatProps {
  context?: AITutorContext;
  isOpen?: boolean;
}

export function TutorChat({ context, isOpen: isOpenProp = false }: TutorChatProps) {
  const [isOpen, setIsOpen] = useState(isOpenProp);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Aku Kak SNBT, AI tutor-mu! 👋 Mau tanya soal apa hari ini? Aku siap bantu jelasin dengan cara yang paling gampang dimengerti! 😊",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Fokus ke input saat chat dibuka
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    // Bangun history (max 10 pesan terakhir untuk efisiensi token)
    const history = [...messages, userMessage].slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          context: context
            ? {
                soalKonten: context.soalKonten,
                jawabanUser: context.jawabanUser,
                isCorrect: context.isCorrect,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      // Proses SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) throw new Error("Stream tidak tersedia");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as { text: string };
              fullText += parsed.text;
              setStreamingText(fullText);
            } catch {
              // Abaikan parse error
            }
          }
        }
      }

      // Pindahkan streaming text ke messages array
      const assistantMessage: AIChatMessage = {
        role: "assistant",
        content: fullText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText("");
    } catch {
      toast.error("Gagal terhubung ke AI tutor. Coba lagi ya!");
      // Hapus pesan user yang tadi dikirim jika gagal
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMessage.content);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, context]);

  // Kirim dengan Enter (Shift+Enter untuk newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  // Shortcut: Tanyakan soal ini
  const handleTanyakanSoal = useCallback(() => {
    if (!context?.soalKonten) return;
    setInput(
      `Tolong jelaskan cara mengerjakan soal ini: "${context.soalKonten.slice(0, 200)}"`
    );
    inputRef.current?.focus();
  }, [context]);

  return (
    <>
      {/* ====== FLOATING BUTTON ====== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-primary rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform animate-pulse-glow"
            aria-label="Buka AI tutor"
            id="ai-tutor-toggle"
          >
            <Brain className="w-6 h-6" aria-hidden="true" />
            {/* Badge baru */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold" aria-hidden="true">✓</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== CHAT WINDOW ====== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : undefined,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden",
              isMinimized ? "w-72" : "w-[360px] h-[520px]"
            )}
            role="dialog"
            aria-label="AI Tutor SoalSNBT.id"
            aria-modal="false"
          >
            {/* Header */}
            <div className="gradient-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Kak SNBT</p>
                  <p className="text-white/70 text-xs">AI Tutor Personal</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label={isMinimized ? "Perbesar" : "Perkecil"}
                >
                  <Minimize2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Tutup AI tutor"
                >
                  <X className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body — hanya tampil jika tidak diminimize */}
            {!isMinimized && (
              <>
                {/* Shortcut konteks soal */}
                {context?.soalKonten && (
                  <div className="px-3 py-2 bg-primary-light border-b border-border">
                    <button
                      onClick={handleTanyakanSoal}
                      className="w-full text-left text-xs text-primary font-semibold flex items-center gap-2 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      💡 Tanyakan soal yang sedang dikerjakan
                    </button>
                  </div>
                )}

                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ height: isMinimized ? 0 : "340px" }}
                  role="log"
                  aria-live="polite"
                  aria-label="Percakapan dengan AI tutor"
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-2.5",
                        msg.role === "user" && "flex-row-reverse"
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          msg.role === "assistant"
                            ? "gradient-primary"
                            : "bg-border"
                        )}
                        aria-hidden="true"
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-text-secondary" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={cn(
                          "max-w-[240px] rounded-2xl px-3.5 py-2.5 text-sm",
                          msg.role === "assistant"
                            ? "bg-surface text-text-primary rounded-tl-none"
                            : "bg-primary text-white rounded-tr-none"
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <MathRenderer content={msg.content} className="text-sm" />
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Streaming text */}
                  {streamingText && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                        <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </div>
                      <div className="max-w-[240px] bg-surface rounded-2xl rounded-tl-none px-3.5 py-2.5">
                        <MathRenderer content={streamingText} className="text-sm" />
                      </div>
                    </div>
                  )}

                  {/* Loading dots */}
                  {isLoading && !streamingText && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center" aria-hidden="true">
                        <Bot className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </div>
                      <div className="bg-surface rounded-2xl rounded-tl-none px-4 py-3 flex gap-1" aria-label="Kak SNBT sedang mengetik">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-border">
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tanya apapun ke Kak SNBT..."
                      disabled={isLoading}
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-60 max-h-28"
                      aria-label="Tulis pesan ke AI tutor"
                      id="ai-chat-input"
                      style={{
                        height: "auto",
                        minHeight: "40px",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                    <button
                      onClick={() => void handleSend()}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none transition-opacity flex-shrink-0"
                      aria-label="Kirim pesan"
                      id="ai-chat-send"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <p className="text-center text-xs text-text-muted mt-2">
                    Enter untuk kirim · Shift+Enter untuk baris baru
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
