import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Pengaturan — Gajian Harianku" },
      { name: "description", content: "Pengaturan workspace Gajian Harianku." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);
  const update = useInvoiceStore((s) => s.updateCompany);

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
            <Input
              value={companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="Gajian Harianku"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Alamat (opsional)</Label>
            <Textarea
              value={companyAddress}
              onChange={(e) => update({ companyAddress: e.target.value })}
              placeholder="Jl. Contoh No. 1, Jakarta"
              rows={2}
            />
          </div>
          <div className="pt-2">
            <Button onClick={() => toast.success("Pengaturan tersimpan")}>Simpan</Button>
          </div>
        </Card>

        <Card className="p-6 text-sm text-muted-foreground space-y-2">
          <h2 className="font-semibold text-foreground">Tentang data Anda</h2>
          <p>Semua data (invoice, draft, template) tersimpan di IndexedDB browser. Tidak ada yang dikirim ke server.</p>
          <p>Menghapus data situs di browser akan menghapus semua invoice secara permanen. Ekspor proyek penting sebagai file <code className="font-mono bg-muted px-1 rounded">.payroll</code> untuk cadangan.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
