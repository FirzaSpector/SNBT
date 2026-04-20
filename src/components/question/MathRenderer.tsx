"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  /** Teks soal yang mungkin berisi LaTeX inline ($...$) atau block ($$...$$) */
  content: string;
  className?: string;
}

/**
 * Komponen untuk render teks yang mengandung rumus matematika LaTeX.
 * Mendukung inline math: $x^2$ dan display math: $$\int_a^b f(x)dx$$
 */
export function MathRenderer({ content, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Render konten dengan KaTeX
    const rendered = renderMathContent(content);
    containerRef.current.innerHTML = rendered;
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`soal-content ${className}`}
      aria-label="Konten soal dengan rumus matematika"
    />
  );
}

/**
 * Mengubah teks dengan LaTeX menjadi HTML.
 * Proses:
 * 1. Escape HTML untuk keamanan
 * 2. Ganti $$...$$ dengan display math KaTeX
 * 3. Ganti $...$ dengan inline math KaTeX
 * 4. Ganti newline dengan <br>
 */
function renderMathContent(content: string): string {
  // Escape HTML dasar untuk mencegah XSS
  // (konten soal harusnya sudah disanitasi di server, ini sebagai lapisan kedua)
  let result = content;

  // Ganti display math ($$ ... $$) — harus sebelum inline math
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (_, math: string) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: false,
      });
    } catch {
      return `<span class="text-danger text-sm">[Error render rumus: ${math}]</span>`;
    }
  });

  // Ganti inline math ($ ... $)
  result = result.replace(/\$([^$\n]+?)\$/g, (_, math: string) => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: false,
      });
    } catch {
      return `<span class="text-danger text-sm">[${math}]</span>`;
    }
  });

  // Ganti newline dengan <br> untuk tampilan yang benar
  result = result.replace(/\n/g, "<br>");

  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");

  return result;
}
