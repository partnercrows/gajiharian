import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  PenLine,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Wallet,
  Users,
  Clock,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInvoiceStore, grandTotal } from "@/lib/store";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Gajian Harianku" },
      { name: "description", content: "Create payroll invoices, import from Excel, or load a worker template." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const drafts = useInvoiceStore((s) => s.drafts);
  const templates = useInvoiceStore((s) => s.templates);
  const employees = useInvoiceStore((s) => s.employees);
  const reset = useInvoiceStore((s) => s.resetProject);

  const actions = [
    {
      title: "Input Manual",
      desc: "Tambahkan karyawan baris per baris. Cocok untuk payroll kecil atau satu kali.",
      icon: PenLine,
      cta: "Mulai invoice kosong",
      onClick: () => {
        reset();
        navigate({ to: "/editor" });
      },
    },
    {
      title: "Impor Excel",
      desc: "Unggah .xlsx atau .csv. Unduh template, isi, dan kami akan memprosesnya.",
      icon: FileSpreadsheet,
      cta: "Impor file",
      onClick: () => {
        reset();
        navigate({ to: "/editor", search: { import: true } as never });
      },
    },
    {
      title: "Muat Template",
      desc: "Pakai ulang daftar pekerja yang tersimpan beserta upah harian default.",
      icon: Layers,
      cta: "Lihat template",
      onClick: () => navigate({ to: "/templates" }),
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Selamat datang 👋</h1>
          <p className="text-muted-foreground mt-1.5">
            Pilih cara memulai invoice payroll hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={Wallet} label="Total invoice saat ini" value={formatRupiah(grandTotal(employees))} />
          <StatCard icon={Users} label="Karyawan di editor" value={String(employees.length)} />
          <StatCard icon={Clock} label="Draft tersimpan" value={String(drafts.length)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {actions.map((a) => (
            <Card
              key={a.title}
              className="p-6 hover:shadow-elevated transition-shadow border-border/70 flex flex-col gap-4"
            >
              <div className="grid place-items-center h-11 w-11 rounded-md bg-accent text-accent-foreground">
                <a.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="font-semibold text-lg">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
              <Button onClick={a.onClick} className="w-full">
                {a.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent drafts</h3>
              <Link to="/drafts" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            {drafts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No drafts yet. Auto-save kicks in every 30s.</p>
            ) : (
              <ul className="space-y-2">
                {drafts.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 text-sm py-2 border-b last:border-0">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{d.header.projectTitle || "Untitled project"}</div>
                      <div className="text-xs text-muted-foreground">{d.employees.length} employees · {d.header.invoiceNumber}</div>
                    </div>
                    <span className="text-xs font-medium shrink-0">{formatRupiah(grandTotal(d.employees))}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Worker templates</h3>
              <Link to="/templates" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            {templates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No templates yet. Save your current worker list as a template from the editor.</p>
            ) : (
              <ul className="space-y-2">
                {templates.slice(0, 5).map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                    <span className="font-medium truncate">{t.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{t.workers.length} workers</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className="grid place-items-center h-11 w-11 rounded-md bg-primary/10 text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-xl font-bold truncate">{value}</div>
      </div>
    </Card>
  );
}
