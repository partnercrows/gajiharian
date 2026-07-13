import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/lib/store";
import { toast } from "sonner";
import { AlertTriangle, Upload } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Pengaturan — Gaji Harian" },
      { name: "description", content: "Pengaturan workspace Gaji Harian." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);
  const companyPhone = useInvoiceStore((s) => s.companyPhone);
  const companyLogo = useInvoiceStore((s) => s.companyLogo);
  const update = useInvoiceStore((s) => s.updateCompany);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground text-sm mt-1">Tampil pada setiap invoice yang dicetak.</p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Perusahaan / Workspace</h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Nama perusahaan</Label>
            <Input value={companyName} onChange={(e) => update({ companyName: e.target.value })} placeholder="Gaji Harian" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Alamat (opsional)</Label>
            <Textarea value={companyAddress} onChange={(e) => update({ companyAddress: e.target.value })} placeholder="Jl. Contoh No. 1, Jakarta" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">No. Telepon / HP (opsional)</Label>
            <Input value={companyPhone} onChange={(e) => update({ companyPhone: e.target.value })} placeholder="0812-xxxx-xxxx" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Logo Perusahaan (opsional)</Label>
            <div className="flex items-center gap-3">
              {companyLogo ? <img src={companyLogo} alt="Logo" className="h-10 w-10 rounded object-contain border" /> : <div className="h-10 w-10 rounded border-2 border-dashed border-muted-foreground/30 grid place-items-center text-muted-foreground"><Upload className="h-4 w-4" /></div>}
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>Pilih Gambar</Button>
              {companyLogo && <Button variant="ghost" size="sm" onClick={() => update({ companyLogo: "" })} className="text-destructive">Hapus</Button>}
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 512000) { toast.error("Logo maks 500KB"); return; } const reader = new FileReader(); reader.onload = () => update({ companyLogo: reader.result as string }); reader.readAsDataURL(file); e.target.value = ""; }} />
            </div>
            <p className="text-xs text-muted-foreground">PNG/JPG, maks 500KB. Menggantikan ikon dompet di invoice.</p>
          </div>
          <div className="pt-2">
            <Button onClick={() => toast.success("Pengaturan tersimpan")}>Simpan</Button>
          </div>
        </Card>

        <Card className="p-6 text-sm text-muted-foreground space-y-2">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Tentang data Anda</h2>
          <p>Semua data (invoice, draft, template) tersimpan di IndexedDB browser. Tidak ada yang dikirim ke server.</p>
          <p>Menghapus data situs di browser akan menghapus semua invoice secara permanen. <span className="text-destructive font-semibold">Ekspor proyek penting sebagai file <code className="font-mono bg-destructive/10 px-1 rounded text-destructive">.payroll</code> untuk cadangan.</span></p>
        </Card>
      </div>
    </AppLayout>
  );
}
