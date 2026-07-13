import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FolderOpen, FilePlus, Trash2, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useInvoiceStore, grandTotal } from "@/lib/store";
import { formatRupiah, formatDateID } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/drafts")({
  head: () => ({
    meta: [
      { title: "Drafts — Gaji Harian" },
      { name: "description", content: "Resume any draft payroll invoice you saved locally." },
    ],
  }),
  component: DraftsPage,
});

function DraftsPage() {
  const navigate = useNavigate();
  const drafts = useInvoiceStore((s) => s.drafts);
  const loadProject = useInvoiceStore((s) => s.loadProject);
  const deleteDraft = useInvoiceStore((s) => s.deleteDraft);
  const [del, setDel] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return drafts;
    return drafts.filter(
      (d) =>
        (d.header.projectTitle || "").toLowerCase().includes(q) ||
        (d.header.invoiceNumber || "").toLowerCase().includes(q),
    );
  }, [drafts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageDrafts = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page]);

  // Reset page when search changes
  useMemo(() => { setPage(1); }, [search]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Draft Proyek</h1>
            <p className="text-muted-foreground text-sm mt-1">Tersimpan otomatis tiap 30 detik. Hanya disimpan di perangkat ini.</p>
          </div>
          <Button onClick={() => navigate({ to: "/editor" })}>
            <FilePlus className="h-4 w-4" /> Invoice Baru
          </Button>
        </div>

        {drafts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari berdasarkan judul proyek atau nomor invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {drafts.length === 0 ? (
          <Card className="p-16 text-center">
            <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Belum ada draft tersimpan</p>
            <p className="text-sm text-muted-foreground mt-1">Mulai invoice dan pekerjaan Anda akan tersimpan otomatis di sini.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Proyek</th>
                  <th className="px-4 py-3">No. Invoice</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Pekerja</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Diperbarui</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      {search ? "Tidak ada draft yang cocok dengan pencarian." : "Belum ada draft tersimpan."}
                    </td>
                  </tr>
                ) : (
                  pageDrafts.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{d.header.projectTitle || "Tanpa Judul"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.header.invoiceNumber}</td>
                    <td className="px-4 py-3">{formatDateID(d.header.paymentDate)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{d.employees.length}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">{formatRupiah(grandTotal(d.employees))}</td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                      {new Date(d.updatedAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            loadProject(d);
                            toast.success("Draft dimuat");
                            navigate({ to: "/editor" });
                          }}
                        >
                          <ExternalLink className="h-4 w-4" /> Buka
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDel(d.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        )}

        {drafts.length > 0 && filtered.length > pageSize && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Halaman {page} dari {totalPages} · {filtered.length} draft
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Selanjutnya <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus draft ini?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (del) { deleteDraft(del); toast.success("Draft dihapus"); }
              setDel(null);
            }}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
