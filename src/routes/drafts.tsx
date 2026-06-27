import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FolderOpen, FilePlus, Trash2, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      { title: "Drafts — Gajian Harianku" },
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
                {drafts.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{d.header.projectTitle || "Untitled"}</td>
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
                            toast.success("Draft loaded");
                            navigate({ to: "/editor" });
                          }}
                        >
                          <ExternalLink className="h-4 w-4" /> Open
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
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>This action can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (del) { deleteDraft(del); toast.success("Draft deleted"); }
              setDel(null);
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
