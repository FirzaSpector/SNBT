"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Brain, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ============================================================
// VALIDASI ZOD
// ============================================================
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi rek!")
    .email("Format email tidak valid rek!"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter rek"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// LOGIN PAGE
// ============================================================
export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Login dengan Email & Password
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email atau password salah. Coba lagi cik!");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email belum dikonfirmasi. Cek inbox-mu ya cik!");
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success("Selamat datang cik 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Login dengan Google OAuth
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        toast.error("Gagal login dengan Google. Coba lagi!");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ====== LEFT PANEL — Ilustrasi ====== */}
      <div className="hidden lg:flex gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-white max-w-md"
        >
          <Brain className="w-16 h-16 mb-8 text-white/90" aria-hidden="true" />
          <h1 className="font-heading text-4xl font-800 mb-4 leading-tight">
            Selamat datang kembali, pejuang PTN! 💪
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Streak kamu belum putus — lanjutkan sesi belajar hari ini dan jaga momentum-mu!
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Soal tersedia", value: "10.000+" },
              { label: "Tryout gratis", value: "3/bln" },
              { label: "Siswa aktif", value: "1+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="font-heading font-700 text-xl">{s.value}</div>
                <div className="text-white/60 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ====== RIGHT PANEL — Form Login ====== */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 lg:hidden"
            aria-label="Kembali ke halaman utama"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-700 text-lg text-primary">
              SoalSNBT<span className="text-accent">.id</span>
            </span>
          </Link>

          <h2 className="font-heading text-3xl font-800 text-text-primary mb-2">
            Masuk ke akunmu cik
          </h2>
          <p className="text-text-secondary mb-8">
            Belum punya akun ya cik?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Daftar gratis cik!
            </Link>
          </p>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border hover:border-primary/30 text-text-primary font-semibold py-3 px-4 rounded-xl transition-all duration-200 mb-6 hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none shadow-sm"
            id="login-google-btn"
            aria-label="Login dengan Google"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Lanjut dengan Google
          </button>

          {/* Divider */}
          <div className="relative mb-6" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface text-text-secondary">atau masuk dengan email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Email lu
              </label>
              <input
                {...register("email")}
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="firzaspector@gmail.com"
                aria-describedby={errors.email ? "login-email-error" : undefined}
                aria-invalid={!!errors.email}
                className={`w-full px-4 py-3 rounded-xl border text-text-primary placeholder:text-text-muted bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.email ? "border-danger bg-danger-light" : "border-border"
                  }`}
              />
              {errors.email && (
                <p
                  id="login-email-error"
                  className="mt-1.5 text-xs text-danger"
                  role="alert"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password lu
                </label>
                <Link
                  href="/lupa-password"
                  className="text-sm text-primary hover:underline"
                >
                  Lupa password ya cik?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="kingbasir123"
                  aria-describedby={errors.password ? "login-password-error" : undefined}
                  aria-invalid={!!errors.password}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-text-primary placeholder:text-text-muted bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.password ? "border-danger bg-danger-light" : "border-border"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="login-password-error"
                  className="mt-1.5 text-xs text-danger"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none mt-2"
              id="login-submit-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Memproses...sabar cik
                </>
              ) : (
                <>
                  Masuk Sekarang cik
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-text-secondary mt-6">
            Dengan masuk, kamu setuju dengan{" "}
            <Link href="/syarat-ketentuan" className="text-primary hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="/kebijakan-privasi" className="text-primary hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
