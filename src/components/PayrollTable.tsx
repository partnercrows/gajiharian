import { useState } from "react";
import { Plus, Copy, Trash2, Eraser, FileText, FileSpreadsheet, StickyNote } from "lucide-react";
import { useInvoiceStore, totalForEmployee } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CurrencyInput } from "@/components/CurrencyInput";
import { SlipGajiDialog } from "@/components/SlipGajiDialog";
import { ExcelImportDialog } from "@/components/ExcelImportDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Employee } from "@/lib/types";

export function PayrollTable() {
  const employees = useInvoiceStore((s) => s.employees);
  const addEmployee = useInvoiceStore((s) => s.addEmployee);
  const updateEmployee = useInvoiceStore((s) => s.updateEmployee);
  const removeEmployee = useInvoiceStore((s) => s.removeEmployee);
  const duplicateEmployee = useInvoiceStore((s) => s.duplicateEmployee);
  const clearEmployees = useInvoiceStore((s) => s.clearEmployees);
  const setStatus = useInvoiceStore((s) => s.setStatus);

  const [slipFor, setSlipFor] = useState<Employee | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg">Daftar Karyawan</h2>
          <p className="text-xs text-muted-foreground">
            {employees.length} karyawan · total dihitung otomatis
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {employees.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eraser className="h-4 w-4" /> Hapus Semua
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus semua karyawan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Semua baris akan dihapus dari tabel. Tindakan ini tidak bisa dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={clearEmployees}>Hapus Semua</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button size="sm" onClick={() => addEmployee()}>
            <Plus className="h-4 w-4" /> Tambah Baris
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="h-4 w-4" /> Impor Excel
          </Button>
        </div>
      </div>

      <div className="max-h-[560px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur z-10">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-4 py-3">#</th>
              <th className="px-3 py-3 min-w-[200px]">Nama Karyawan</th>
              <th className="px-3 py-3 w-[170px]">Upah per Hari</th>
              <th className="px-3 py-3 w-[110px]">Hari</th>
              <th className="px-3 py-3 w-[130px]">Kasbon</th>
              <th className="px-3 py-3 w-[160px] text-right">Total</th>
              <th className="px-3 py-3 w-[130px]">Status</th>
              <th className="px-3 py-3 w-[150px] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  <div className="space-y-2">
                    <p>Belum ada karyawan.</p>
                    <Button variant="outline" size="sm" onClick={() => addEmployee()}>
                      <Plus className="h-4 w-4" /> Tambah baris pertama
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((e, idx) => (
                <tr key={e.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground text-xs">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <Input
                      value={e.name}
                      onChange={(ev) => { const name = ev.target.value.trim(); const dup = employees.find(x => x.id !== e.id && x.name.toLowerCase() === name.toLowerCase()); if (dup) toast.warning("Nama \"" + name + "\" sudah ada"); updateEmployee(e.id, { name: ev.target.value }); }}
                      placeholder="Nama pekerja"
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <CurrencyInput
                      value={e.dailySalary}
                      onValueChange={(n) => updateEmployee(e.id, { dailySalary: n })}
                      placeholder="0"
                      className="h-9 text-right"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={e.workingDays || ""}
                      onChange={(ev) => {
                        const n = Math.max(0, Math.floor(Number(ev.target.value) || 0));
                        updateEmployee(e.id, { workingDays: n });
                      }}
                      className="h-9 text-right tabular-nums"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <CurrencyInput
                      value={e.kasbon ?? 0}
                      onValueChange={(n) => updateEmployee(e.id, { kasbon: n })}
                      placeholder="0"
                      className="h-9 text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {formatRupiah(totalForEmployee(e))}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setStatus(e.id, e.status === "paid" ? "unpaid" : "paid")}
                      className="inline-block"
                      title="Klik untuk mengubah"
                    >
                      <Badge
                        className={cn(
                          "cursor-pointer",
                          e.status === "paid"
                            ? "bg-success text-success-foreground hover:bg-success/90"
                            : "bg-warning text-warning-foreground hover:bg-warning/90",
                        )}
                      >
                        {e.status === "paid" ? "Lunas" : "Belum Lunas"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8",
                              e.catatan?.trim() ? "text-amber-600 hover:text-amber-600" : "",
                            )}
                            title="Catatan Karyawan"
                          >
                            <StickyNote className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80">
                          <p className="text-sm font-medium mb-2">Catatan — {e.name || "Karyawan"}</p>
                          <Textarea
                            value={e.catatan ?? ""}
                            onChange={(ev) => updateEmployee(e.id, { catatan: ev.target.value })}
                            placeholder={"Satu poin per baris, misal:\nkasbon tanggal 2\nkasbon tanggal 3"}
                            rows={5}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary"
                        onClick={() => setSlipFor(e)}
                        title="Lihat Slip Gaji"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => duplicateEmployee(e.id)}
                        title="Duplikat baris"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeEmployee(e.id)}
                        title="Hapus baris"
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
      </div>

      <SlipGajiDialog
        employee={slipFor}
        open={!!slipFor}
        onOpenChange={(o) => !o && setSlipFor(null)}
      />
      <ExcelImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </Card>
  );
}
