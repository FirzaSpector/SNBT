import { redirect } from "next/navigation";

export default function TryoutDemoPage() {
  // Untuk sementara, "Demo" di-redirect ke halaman latihan utuh
  // karena pengguna sudah login (melewati middleware).
  redirect("/latihan");
}
