"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight, Sparkles, Search, ChevronDown, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const profileSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  targetProdiId: z.number().nullable().optional(),
  referralCode: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface UnivData {
  id: number;
  kode: string;
  nama: string;
  singkatan: string;
  kota: string;
  prodi: {
    id: number;
    kode: string;
    nama: string;
    jenjang: string;
    rumpun: string;
    dayaTampung: number;
    passingGrade: number;
  }[];
}

export default function SetupProfilPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  // PTN data
  const [univList, setUnivList] = useState<UnivData[]>([]);
  const [univLoading, setUnivLoading] = useState(true);
  const [selectedUniv, setSelectedUniv] = useState<UnivData | null>(null);
  const [selectedProdi, setSelectedProdi] = useState<UnivData["prodi"][0] | null>(null);
  const [univSearch, setUnivSearch] = useState("");
  const [prodiSearch, setProdiSearch] = useState("");
  const [showUnivDropdown, setShowUnivDropdown] = useState(false);
  const [showProdiDropdown, setShowProdiDropdown] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    fetch("/api/universitas")
      .then(res => res.json())
      .then(result => {
        if (result.success) setUnivList(result.data);
      })
      .catch(() => {})
      .finally(() => setUnivLoading(false));
  }, []);

  const filteredUniv = useMemo(() => {
    if (!univSearch.trim()) return univList;
    const q = univSearch.toLowerCase();
    return univList.filter(u =>
      u.nama.toLowerCase().includes(q) ||
      u.singkatan.toLowerCase().includes(q) ||
      u.kota.toLowerCase().includes(q)
    );
  }, [univList, univSearch]);

  const filteredProdi = useMemo(() => {
    if (!selectedUniv) return [];
    if (!prodiSearch.trim()) return selectedUniv.prodi;
    const q = prodiSearch.toLowerCase();
    return selectedUniv.prodi.filter(p =>
      p.nama.toLowerCase().includes(q)
    );
  }, [selectedUniv, prodiSearch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      targetProdiId: null,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Session tidak ditemukan, silakan login ulang.");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/profil/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.email?.split("@")[0] || `user_${Math.random().toString(36).substring(2,7)}`,
          email: user.email,
          fullName: data.fullName,
          targetUniversity: selectedUniv?.nama || "",
          targetMajor: selectedProdi?.nama || "",
          targetProdiId: selectedProdi?.id || null,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menyimpan profil");
      }

      // Apply referral code if provided
      if (referralCode.trim()) {
        try {
          await fetch("/api/referral", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: referralCode.trim() }),
          });
        } catch {
          // Non-blocking — referral failure shouldn't block registration
        }
      }

      toast.success("Profil berhasil disimpan! Selamat datang. 🎉");
      router.push("/dashboard");
      router.refresh();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl relative z-10 border border-border">
        <div>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-center font-heading text-3xl font-800 tracking-tight text-text-primary">
            Satu Langkah Lagi!
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Lengkapi data diri kamu agar kami bisa memberikan rekomendasi belajar yang sesuai.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Nama Lengkap</label>
            <input 
              {...register("fullName")}
              className={`w-full flex h-11 rounded-xl border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors ${errors.fullName ? "border-danger" : "border-border"}`} 
              placeholder="Contoh: Budi Santoso"
            />
            {errors.fullName && <p className="text-danger text-xs mt-1.5">{errors.fullName.message}</p>}
          </div>

          {/* Target PTN */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Target Kampus Impian
            </h3>
            
            {/* University Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-primary mb-1.5">PTN Target</label>
              <button
                type="button"
                onClick={() => { setShowUnivDropdown(!showUnivDropdown); setShowProdiDropdown(false); }}
                className="w-full flex items-center justify-between h-11 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors hover:border-primary/40"
              >
                <span className={selectedUniv ? "text-text-primary" : "text-text-muted"}>
                  {selectedUniv ? `${selectedUniv.singkatan} — ${selectedUniv.nama}` : "Pilih universitas..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showUnivDropdown ? "rotate-180" : ""}`} />
              </button>

              {showUnivDropdown && (
                <div className="absolute z-20 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
                  <div className="sticky top-0 bg-white p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={univSearch}
                        onChange={(e) => setUnivSearch(e.target.value)}
                        placeholder="Cari universitas..."
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-44">
                    {univLoading ? (
                      <div className="p-4 text-center text-sm text-text-muted">Memuat...</div>
                    ) : filteredUniv.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-muted">Tidak ditemukan</div>
                    ) : (
                      filteredUniv.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors ${selectedUniv?.id === u.id ? "bg-primary/10 text-primary font-medium" : "text-text-primary"}`}
                          onClick={() => {
                            setSelectedUniv(u);
                            setSelectedProdi(null);
                            setValue("targetProdiId", null);
                            setShowUnivDropdown(false);
                            setUnivSearch("");
                          }}
                        >
                          <div className="font-medium">{u.singkatan} — {u.nama}</div>
                          <div className="text-xs text-text-muted">{u.kota} · {u.prodi.length} prodi</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Program Studi Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Program Studi Target</label>
              <button
                type="button"
                onClick={() => { if (selectedUniv) { setShowProdiDropdown(!showProdiDropdown); setShowUnivDropdown(false); } }}
                disabled={!selectedUniv}
                className={`w-full flex items-center justify-between h-11 rounded-xl border bg-surface px-3 py-2 text-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${!selectedUniv ? "opacity-50 cursor-not-allowed border-border" : "border-border hover:border-primary/40"}`}
              >
                <span className={selectedProdi ? "text-text-primary" : "text-text-muted"}>
                  {selectedProdi ? selectedProdi.nama : selectedUniv ? "Pilih program studi..." : "Pilih universitas dulu"}
                </span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showProdiDropdown ? "rotate-180" : ""}`} />
              </button>

              {showProdiDropdown && selectedUniv && (
                <div className="absolute z-20 top-full mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-hidden">
                  <div className="sticky top-0 bg-white p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={prodiSearch}
                        onChange={(e) => setProdiSearch(e.target.value)}
                        placeholder="Cari program studi..."
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-44">
                    {filteredProdi.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-muted">Tidak ditemukan</div>
                    ) : (
                      filteredProdi.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors ${selectedProdi?.id === p.id ? "bg-primary/10 text-primary font-medium" : "text-text-primary"}`}
                          onClick={() => {
                            setSelectedProdi(p);
                            setValue("targetProdiId", p.id);
                            setShowProdiDropdown(false);
                            setProdiSearch("");
                          }}
                        >
                          <div className="font-medium">{p.nama}</div>
                          <div className="text-xs text-text-muted">
                            {p.rumpun} · {p.jenjang} · Daya tampung: {p.dayaTampung}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Kode Referral <span className="text-text-muted font-normal">(opsional)</span>
            </label>
            <input 
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full flex h-11 rounded-xl border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors font-mono tracking-widest"
              placeholder="XXXX-XXXX"
              maxLength={20}
            />
            <p className="text-xs text-text-muted mt-1">Punya kode dari teman? Masukkan untuk bonus XP!</p>
          </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-white bg-primary hover:bg-primary-dark font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyiapkan...</span>
                </>
              ) : (
                <>
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
        </form>
      </div>
    </div>
  );
}
