import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://soalsnbt.id"
  ),
  title: {
    default: "SoalSNBT.id — Belajar SNBT Lebih Cerdas, Visual & Seru",
    template: "%s | SoalSNBT.id",
  },
  description:
    "Platform latihan soal SNBT terlengkap dengan visualisasi interaktif, AI tutor personal, simulasi CBT real-time, dan analitik performa mendalam. Siapkan dirimu masuk PTN impian!",
  keywords: [
    "SNBT",
    "latihan soal SNBT",
    "tryout SNBT",
    "belajar SNBT",
    "simulasi SNBT",
    "TPS SNBT",
    "TKA SNBT",
    "soal UTBK",
    "persiapan PTN",
    "bimbel online",
  ],
  authors: [{ name: "SoalSNBT.id" }],
  creator: "SoalSNBT.id",
  publisher: "SoalSNBT.id",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://soalsnbt.id",
    siteName: "SoalSNBT.id",
    title: "SoalSNBT.id — Belajar SNBT Lebih Cerdas, Visual & Seru",
    description:
      "Platform latihan soal SNBT terlengkap di Indonesia. 10.000+ soal, AI tutor, simulasi CBT, analitik canggih.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SoalSNBT.id — Platform SNBT Terlengkap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoalSNBT.id — Belajar SNBT Lebih Cerdas",
    description:
      "Platform latihan soal SNBT terlengkap dengan AI tutor dan analitik performa.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

// JSON-LD Structured Data untuk Organisation
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "SoalSNBT.id",
  url: "https://soalsnbt.id",
  description:
    "Platform persiapan SNBT terlengkap di Indonesia dengan latihan soal adaptif, AI tutor, dan simulasi CBT.",
  areaServed: "ID",
  educationalCredentialAwarded: "Kesiapan SNBT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased bg-surface">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
