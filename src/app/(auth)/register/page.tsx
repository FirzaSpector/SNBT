"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Brain,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  User,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ============================================================
// VALIDASI ZOD — Multi-step form
// ============================================================
const step1Schema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Harus ada huruf kapital")
    .regex(/[0-9]/, "Harus ada angka"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-z0-9._]+$/, "Hanya huruf kecil, angka, titik, underscore"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

const step2Schema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter").max(100),
  school: z.string().min(1, "Asal sekolah wajib diisi").max(150),
  city: z.string().min(1, "Kota wajib diisi").max(100),
});

const step3Schema = z.object({
  targetUniversity: z.string().max(150).optional(),
  targetMajor: z.string().max(150).optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ============================================================
// DAFTAR PTN POPULER (untuk autocomplete sederhana)
// ============================================================
const PTN_LIST = [
  "Universitas Syiah Kuala (USK)",
  "Universitas Malikussaleh (Unimal)",
  "Universitas Sumatera Utara (USU)",
  "Universitas Negeri Medan (Unimed)",
  "Universitas Andalas (Unand)",
  "Universitas Negeri Padang (UNP)",
  "Universitas Riau (Unri)",
  "Universitas Jambi (Unja)",
  "Universitas Bengkulu (Unib)",
  "Universitas Sriwijaya (Unsri)",
  "Universitas Lampung (Unila)",
  "Universitas Sultan Ageng Tirtayasa (Untirta)",
  "Universitas Indonesia (UI)",
  "Universitas Negeri Jakarta (UNJ)",
  "UPN Veteran Jakarta (UPNVJ)",
  "Institut Pertanian Bogor (IPB)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Padjadjaran (Unpad)",
  "Universitas Pendidikan Indonesia (UPI)",
  "Universitas Jenderal Soedirman (Unsoed)",
  "Universitas Tidar (Untidar)",
  "Universitas Sebelas Maret (UNS)",
  "Universitas Diponegoro (Undip)",
  "Universitas Negeri Semarang (Unnes)",
  "Universitas Gadjah Mada (UGM)",
  "Universitas Negeri Yogyakarta (UNY)",
  "UPN Veteran Yogyakarta (UPNVY)",
  "Universitas Brawijaya (UB)",
  "Universitas Negeri Malang (UM)",
  "Universitas Jember (Unej)",
  "Universitas Airlangga (Unair)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Negeri Surabaya (Unesa)",
  "UPN Veteran Jawa Timur (UPNVJT)",
  "Universitas Trunojoyo Madura (UTM)",
  "Universitas Udayana (Unud)",
  "Universitas Pendidikan Ganesha (Undiksha)",
  "Universitas Mataram (Unram)",
  "Universitas Nusa Cendana (Undana)",
  "Universitas Tanjungpura (Untan)",
  "Universitas Palangka Raya (UPR)",
  "Universitas Lambung Mangkurat (ULM)",
  "Universitas Mulawarman (Unmul)",
  "Universitas Borneo Tarakan (UBT)",
  "Universitas Hasanuddin (Unhas)",
  "Universitas Negeri Makassar (UNM)",
  "Universitas Sam Ratulangi (Unsrat)",
  "Universitas Negeri Manado (Unima)",
  "Universitas Tadulako (Untad)",
  "Universitas Halu Oleo (UHO)",
  "Universitas Negeri Gorontalo (UNG)",
  "Universitas Pattimura (Unpatti)",
  "Universitas Khairun (Unkhair)",
  "Universitas Cenderawasih (Uncen)",
  "Universitas Papua (Unipa)",
  "Universitas Musamus (Unmus)",
  "Institut Teknologi Sumatera (Itera)",
  "Institut Teknologi Kalimantan (ITK)",
  "Institut Seni Indonesia Yogyakarta (ISI)",
  "Institut Seni Indonesia Surakarta (ISI)",
  "Institut Seni Indonesia Denpasar (ISI)",
  "Institut Seni Budaya Indonesia Bandung (ISBI)",
  "Politeknik Manufaktur Bandung (POLMAN)",
  "Politeknik Negeri Jakarta (PNJ)",
  "Politeknik Negeri Medan (POLMED)",
  "Politeknik Negeri Bandung (POLBAN)",
  "Politeknik Negeri Semarang (POLINES)",
  "Politeknik Negeri Sriwijaya (POLSRI)",
  "Politeknik Negeri Lampung (POLINELA)",
  "Politeknik Negeri Ambon (POLNAM)",
  "Politeknik Negeri Padang (PNP)",
  "Politeknik Negeri Bali (PNB)",
  "Politeknik Negeri Pontianak (POLNEP)",
  "Politeknik Negeri Ujung Pandang (PNUP)",
  "Politeknik Negeri Manado (POLIMDO)",
  "Politeknik Perkapalan Negeri Surabaya (PPNS)",
  "Politeknik Negeri Banjarmasin (POLIBAN)",
  "Politeknik Negeri Lhokseumawe (PNL)",
  "Politeknik Negeri Kupang (PNK)",
  "Politeknik Elektronika Negeri Surabaya (PENS)",
  "Politeknik Negeri Jember (POLIJE)",
  "Politeknik Pertanian Negeri Pangkajene Kepulauan (PPNP)",
  "Politeknik Pertanian Negeri Kupang (PPNK)",
  "Politeknik Perikanan Negeri Tual (POLIKANT)",
  "Politeknik Negeri Malang (POLINEMA)",
  "Politeknik Pertanian Negeri Samarinda (POLITANI Samarinda)",
  "Politeknik Pertanian Negeri Payakumbuh (PPNP)",
  "Politeknik Negeri Samarinda (POLNES)",
  "Politeknik Negeri Media Kreatif (POLIMEDIA)",
  "Politeknik Manufaktur Negeri Bangka Belitung (POLMANBABEL)",
  "Politeknik Negeri Batam (POLIBATAM)",
  "Politeknik Negeri Nusa Utara (POLNUSTAR)",
  "Politeknik Negeri Bengkalis (POLBENG)",
  "Politeknik Negeri Balikpapan (POLTEKBA)",
  "Politeknik Negeri Madura (POLTERA)",
  "Politeknik Maritim Negeri Indonesia (POLIMARIN)",
  "Politeknik Negeri Banyuwangi (POLIWANGI)",
  "Politeknik Negeri Madiun (PNM)",
  "Politeknik Negeri Fakfak (POLINEF)",
  "Politeknik Negeri Sambas (POLTESA)",
  "Politeknik Negeri Tanah Laut (POLITALA)",
  "Politeknik Negeri Subang (POLSUB)",
  "Politeknik Negeri Ketapang (POLITAP)",
  "Politeknik Negeri Cilacap (PNC)",
  "Politeknik Negeri Indramayu (POLINDRA)",
  "Politeknik Negeri Nunukan (PNN)",
  "UIN Syarif Hidayatullah Jakarta (UIN Jakarta)",
  "UIN Sunan Kalijaga (UIN Suka)",
  "UIN Sunan Gunung Djati (UIN Bandung)",
  "UIN Sunan Ampel (UINSA)",
  "UIN Maulana Malik Ibrahim (UIN Malang)",
  "UIN Walisongo (UIN Walisongo)",
  "UIN Alauddin (UIN Alauddin)",
  "UIN Sumatera Utara (UINSU)"
];

// ============================================================
// REGISTER PAGE — Multi-step
// ============================================================
export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Data dari tiap step
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

  // Form Step 1
  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  const STEPS = [
    { label: "Akun", icon: User },
    { label: "Profil", icon: GraduationCap },
    { label: "Target PTN", icon: Brain },
  ];

  const handleStep1 = async (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2 = async (data: Step2Data) => {
    setStep2Data(data);
    setStep(3);
  };

  const handleStep3 = async (data: Step3Data) => {
    if (!step1Data || !step2Data) return;
    setIsLoading(true);

    try {
      // Daftar ke Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: step1Data.email,
        password: step1Data.password,
        options: {
          data: {
            username: step1Data.username,
            full_name: step2Data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast.error("Email lu sudah terdaftar. Silakan login!");
          setStep(1);
        } else {
          toast.error(signUpError.message);
        }
        return;
      }

      toast.success(
        "Akun berhasil dibuat! Cek email untuk konfirmasi, ya 📧",
        { duration: 6000 }
      );
      router.push("/login?registered=true");
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ====== LEFT PANEL ====== */}
      <div className="hidden lg:flex gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />

        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-white max-w-sm"
        >
          <Brain className="w-16 h-16 mb-6 text-white/90" aria-hidden="true" />

          {step === 1 && (
            <>
              <h2 className="font-heading text-3xl font-800 mb-4">Mulai gratis, tanpa risiko</h2>
              <p className="text-white/70">Tidak perlu kartu kredit. Daftar sekarng, dan mulai latihan soal SNBT dalam 2 menit.</p>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-heading text-3xl font-800 mb-4">Kita kenalan dulu, yuk 👋</h2>
              <p className="text-white/70">Informasi ini membantu kami mempersonalisasi pengalaman belajarmu.</p>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-heading text-3xl font-800 mb-4">Impianmu, prioritas kami 🎯</h2>
              <p className="text-white/70">Dengan tahu target PTN-mu, rekomendasi latihan akan lebih akurat dan terarah.</p>
            </>
          )}
        </motion.div>
      </div>

      {/* ====== RIGHT PANEL — Form ====== */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-700 text-lg text-primary">
              SoalSNBT<span className="text-accent">.id</span>
            </span>
          </Link>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8" role="list" aria-label="Langkah pendaftaran">
            {STEPS.map((s, i) => {
              const stepNum = i + 1;
              const isCompleted = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <div key={s.label} className="flex items-center gap-2 flex-1 last:flex-none" role="listitem">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCompleted
                      ? "bg-success text-white"
                      : isCurrent
                        ? "bg-primary text-white"
                        : "bg-border text-text-muted"
                      }`}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Langkah ${stepNum}: ${s.label}${isCompleted ? " (selesai)" : isCurrent ? " (saat ini)" : ""}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${isCurrent ? "text-primary" : isCompleted ? "text-success" : "text-text-muted"
                      }`}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 transition-colors duration-300 ${step > stepNum ? "bg-success" : "bg-border"
                        }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ====== STEP 1: Akun ====== */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl font-800 text-text-primary mb-1">
                  Buat akun baru
                </h2>
                <p className="text-text-secondary mb-6 text-sm">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Masuk di sini
                  </Link>
                </p>

                <form onSubmit={form1.handleSubmit(handleStep1)} noValidate className="space-y-4">
                  {/* Username */}
                  <FormField
                    label="Username"
                    id="reg-username"
                    type="text"
                    placeholder="budi_snbt"
                    registration={form1.register("username")}
                    error={form1.formState.errors.username?.message}
                    hint="3-30 karakter, huruf kecil dan angka saja"
                  />

                  {/* Email */}
                  <FormField
                    label="Email"
                    id="reg-email"
                    type="email"
                    placeholder="emailkamu@gmail.com"
                    registration={form1.register("email")}
                    error={form1.formState.errors.email?.message}
                  />

                  {/* Password */}
                  <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-text-primary mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...form1.register("password")}
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 karakter, ada huruf besar & angka"
                        className={inputClass(!!form1.formState.errors.password)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                        aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                      </button>
                    </div>
                    {form1.formState.errors.password && (
                      <p className="mt-1 text-xs text-danger" role="alert">{form1.formState.errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="reg-confirm" className="block text-sm font-medium text-text-primary mb-1.5">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        {...form1.register("confirmPassword")}
                        id="reg-confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Ulangi password"
                        className={inputClass(!!form1.formState.errors.confirmPassword)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                        aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                      </button>
                    </div>
                    {form1.formState.errors.confirmPassword && (
                      <p className="mt-1 text-xs text-danger" role="alert">{form1.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <SubmitButton label="Lanjut ke Profil" isLoading={false} id="step1-next" />
                </form>
              </motion.div>
            )}

            {/* ====== STEP 2: Profil ====== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl font-800 text-text-primary mb-1">
                  Lengkapi profilmu
                </h2>
                <p className="text-text-secondary mb-6 text-sm">
                  Informasi ini bisa kamu ubah kapan saja di halaman profil.
                </p>

                <form onSubmit={form2.handleSubmit(handleStep2)} noValidate className="space-y-4">
                  <FormField
                    label="Nama Lengkap"
                    id="reg-fullname"
                    type="text"
                    placeholder="Budi Santoso"
                    registration={form2.register("fullName")}
                    error={form2.formState.errors.fullName?.message}
                  />
                  <FormField
                    label="Asal Sekolah"
                    id="reg-school"
                    type="text"
                    placeholder="SMAN 1 Jakarta"
                    registration={form2.register("school")}
                    error={form2.formState.errors.school?.message}
                  />
                  <FormField
                    label="Kota"
                    id="reg-city"
                    type="text"
                    placeholder="Jakarta"
                    registration={form2.register("city")}
                    error={form2.formState.errors.city?.message}
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-text-secondary hover:bg-surface transition-all text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Kembali
                    </button>
                    <SubmitButton label="Lanjut ke Target" isLoading={false} id="step2-next" className="flex-1" />
                  </div>
                </form>
              </motion.div>
            )}

            {/* ====== STEP 3: Target PTN ====== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="font-heading text-2xl font-800 text-text-primary mb-1">
                  PTN impianmu apa? 🎯
                </h2>
                <p className="text-text-secondary mb-6 text-sm">
                  Opsional — bisa kamu isi nanti. Tapi kalau diisi, rekomendasinya lebih akurat!
                </p>

                <form onSubmit={form3.handleSubmit(handleStep3)} noValidate className="space-y-4">
                  {/* Target PTN */}
                  <div>
                    <label htmlFor="reg-target-ptn" className="block text-sm font-medium text-text-primary mb-1.5">
                      Target Perguruan Tinggi <span className="text-text-muted">(opsional)</span>
                    </label>
                    <input
                      {...form3.register("targetUniversity")}
                      id="reg-target-ptn"
                      list="ptn-list"
                      type="text"
                      placeholder="Cari atau ketik nama PTN..."
                      className={inputClass(false)}
                    />
                    <datalist id="ptn-list">
                      {PTN_LIST.map((ptn) => (
                        <option key={ptn} value={ptn} />
                      ))}
                    </datalist>
                  </div>

                  <FormField
                    label="Target Jurusan"
                    id="reg-target-major"
                    type="text"
                    placeholder="Teknik Informatika"
                    registration={form3.register("targetMajor")}
                    hint="Opsional"
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-text-secondary hover:bg-surface transition-all text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Kembali
                    </button>
                    <SubmitButton
                      label="Selesai & Buat Akun 🎉"
                      isLoading={isLoading}
                      id="step3-submit"
                      className="flex-1"
                    />
                  </div>
                </form>

                <p className="text-center text-xs text-text-secondary mt-4">
                  Target PTN bisa diisi/diubah kapan saja di pengaturan profil.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Sub-komponen helper
// ============================================================
function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl border text-text-primary placeholder:text-text-muted bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${hasError ? "border-danger bg-danger-light" : "border-border"
    }`;
}

function FormField({
  label,
  id,
  type,
  placeholder,
  registration,
  error,
  hint,
}: {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      <input
        {...registration}
        id={id}
        type={type}
        placeholder={placeholder}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={!!error}
        className={inputClass(!!error)}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-text-muted">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger" role="alert">{error}</p>
      )}
    </div>
  );
}

function SubmitButton({
  label,
  isLoading,
  id,
  className = "",
}: {
  label: string;
  isLoading: boolean;
  id: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      id={id}
      className={`flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:pointer-events-none ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          Memproses...
        </>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
