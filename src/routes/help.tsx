import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { HelpCircle, Mail, BookOpen, Zap, FileText, FolderOpen, Layers, Settings, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Bantuan — Gaji Harian" },
      { name: "description", content: "Pusat bantuan dan panduan penggunaan aplikasi Gaji Harian." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-2">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Pusat Bantuan Gaji Harian</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Selamat datang di pusat bantuan GajiHarian. Di sini Anda dapat mempelajari cara menggunakan aplikasi dan menemukan solusi saat mengalami kendala.
          </p>
        </div>

        {/* Mulai Cepat */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-lg bg-amber-100 text-amber-700">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Mulai Cepat</h2>
          </div>
          <p className="text-sm text-muted-foreground">Ikuti langkah berikut untuk membuat invoice payroll:</p>
          <ol className="space-y-3 ml-1">
            {[
              { num: 1, label: "Buka Editor Gaji", desc: "Klik menu 'Editor Gaji' di sidebar untuk memulai." },
              { num: 2, label: "Isi informasi proyek dan periode kerja", desc: "Masukkan judul proyek, nomor invoice, tanggal pembayaran, dan penanggung jawab." },
              { num: 3, label: "Tambahkan daftar karyawan", desc: "Klik 'Tambah Pekerja' dan isi nama, upah harian, hari kerja, serta kasbon bila ada." },
              { num: 4, label: "Atur upah, hari kerja, dan kasbon", desc: "Setiap pekerja bisa diatur upah per hari, jumlah hari kerja, dan potongan kasbonnya." },
              { num: 5, label: "Simpan draft atau cetak invoice", desc: "Gunakan 'Simpan Draft' untuk menyimpan, atau 'Cetak Invoice' untuk mencetak dokumen payroll." },
            ].map((step) => (
              <li key={step.num} className="flex gap-4">
                <span className="flex-shrink-0 grid place-items-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {step.num}
                </span>
                <div>
                  <div className="font-semibold text-sm">{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {/* Panduan Menu */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Panduan Menu</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MenuHelpCard
              icon={LayoutDashboard}
              title="Dashboard"
              desc="Lihat ringkasan aktivitas, draft terbaru, dan akses cepat ke fitur utama."
            />
            <MenuHelpCard
              icon={FileText}
              title="Editor Gaji"
              desc="Buat dan kelola invoice payroll, termasuk perhitungan gaji karyawan."
            />
            <MenuHelpCard
              icon={FolderOpen}
              title="Draft Proyek"
              desc="Semua invoice yang disimpan akan muncul di sini dan dapat diedit kembali kapan saja."
            />
            <MenuHelpCard
              icon={Layers}
              title="Template"
              desc="Simpan daftar karyawan agar dapat digunakan ulang pada proyek berikutnya."
            />
            <MenuHelpCard
              icon={Settings}
              title="Pengaturan"
              desc="Atur informasi perusahaan yang akan ditampilkan pada invoice."
            />
          </div>
        </Card>

        {/* FAQ */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">FAQ</h2>
          </div>
          <div className="space-y-4">
            <FaqItem
              question="Apakah data saya aman?"
              answer="Ya. Semua data disimpan 100% lokal di browser Anda dan tidak dikirim ke server."
            />
            <FaqItem
              question="Apakah data akan hilang?"
              answer="Data dapat hilang jika browser dihapus atau cache dibersihkan. Disarankan melakukan backup secara berkala."
            />
            <FaqItem
              question="Bisakah saya membuka data di perangkat lain?"
              answer="Saat ini data hanya tersedia di perangkat/browser tempat Anda menyimpannya. Jika Anda ingin membuka di perangkat/browser lain, lakukan export .payroll dan buka file .payroll di perangkat tujuan."
            />
          </div>
        </Card>

        {/* Hubungi Support */}
        <Card className="p-6 space-y-4 bg-muted/30 border-dashed">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-10 w-10 rounded-lg bg-rose-100 text-rose-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Hubungi Support</h2>
              <p className="text-sm text-muted-foreground">Mengalami bug, error, atau butuh bantuan?</p>
            </div>
          </div>
          <a
            href="mailto:Partnercrows@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email Support
          </a>
          <p className="text-xs text-muted-foreground">Partnercrows@gmail.com</p>
        </Card>
      </div>
    </AppLayout>
  );
}

function MenuHelpCard({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg border bg-background">
      <div className="grid place-items-center h-9 w-9 rounded-md bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-border pb-3 last:border-0 last:pb-0">
      <h3 className="font-semibold text-sm">{question}</h3>
      <p className="text-sm text-muted-foreground mt-1">{answer}</p>
    </div>
  );
}