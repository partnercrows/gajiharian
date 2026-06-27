import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layers, Pencil, Trash2, Download, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInvoiceStore } from "@/lib/store";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Gajian Harianku" },
      { name: "description", content: "Manage saved worker templates for quick payroll re-use." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = useNavigate();
  const templates = useInvoiceStore((s) => s.templates);
  const loadTemplate = useInvoiceStore((s) => s.loadTemplate);
  const renameTemplate = useInvoiceStore((s) => s.renameTemplate);
  const deleteTemplate = useInvoiceStore((s) => s.deleteTemplate);

  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Template Pekerja</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Simpan daftar pekerja yang sering dipakai. Memuat template menambahkan pekerja dengan upah default dan 1 hari kerja.
            </p>
          </div>
          <Button onClick={() => navigate({ to: "/editor" })}>
            <Plus className="h-4 w-4" /> Invoice Baru
          </Button>
        </div>

        {templates.length === 0 ? (
          <Card className="p-16 text-center">
            <Layers className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Belum ada template</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Dari editor invoice, klik "Simpan Template" untuk menyimpan daftar pekerja saat ini.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => {
              const avg = t.workers.length
                ? t.workers.reduce((s, w) => s + w.dailySalary, 0) / t.workers.length
                : 0;
              return (
                <Card key={t.id} className="p-5 flex flex-col gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{t.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.workers.length} pekerja · rata-rata {formatRupiah(avg)}/hari
                    </p>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-0.5 max-h-32 overflow-auto">
                    {t.workers.slice(0, 6).map((w, i) => (
                      <li key={i} className="flex justify-between gap-2">
                        <span className="truncate">{w.name}</span>
                        <span className="shrink-0 tabular-nums">{formatRupiah(w.dailySalary)}</span>
                      </li>
                    ))}
                    {t.workers.length > 6 && <li>+{t.workers.length - 6} lainnya…</li>}
                  </ul>
                  <div className="flex items-center justify-between gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() => {
                        loadTemplate(t.id);
                        toast.success(`Memuat ${t.workers.length} pekerja`);
                        navigate({ to: "/editor" });
                      }}
                    >
                      <Download className="h-4 w-4" /> Muat
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRenaming({ id: t.id, name: t.name })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleting(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ubah nama template</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input value={renaming?.name ?? ""} onChange={(e) => setRenaming((r) => r && { ...r, name: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>Batal</Button>
            <Button onClick={() => {
              if (!renaming) return;
              if (!renaming.name.trim()) return toast.error("Nama wajib diisi");
              renameTemplate(renaming.id, renaming.name.trim());
              toast.success("Nama diperbarui");
              setRenaming(null);
            }}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus template ini?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleting) {
                deleteTemplate(deleting);
                toast.success("Template dihapus");
              }
              setDeleting(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
