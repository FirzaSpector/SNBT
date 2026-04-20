import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#EEF2FF",
          dark: "#3730A3",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
          dark: "#D97706",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
          foreground: "#FFFFFF",
        },
        surface: "#F9FAFB",
        card: "#FFFFFF",
        border: "#E5E7EB",
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(79, 70, 229, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(79, 70, 229, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
        shimmer:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
