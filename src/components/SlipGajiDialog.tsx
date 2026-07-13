import { useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Download, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInvoiceStore, totalForEmployee } from "@/lib/store";
import { formatRupiah, formatDateID } from "@/lib/format";
import type { Employee } from "@/lib/types";

interface Props {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function SlipGajiDialog({ employee, open, onOpenChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const header = useInvoiceStore((s) => s.header);
  const signature = useInvoiceStore((s) => s.signature);
  const employees = useInvoiceStore((s) => s.employees);
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);
  const companyLogo = useInvoiceStore((s) => s.companyLogo);

  const childIdx = useMemo(() => {
    if (!employee) return 0;
    return employees.findIndex((e) => e.id === employee.id);
  }, [employee, employees]);

  const periodLabel = useMemo(() => {
    if (header.periodStartDate && header.periodEndDate) {
      return `${formatDateID(header.periodStartDate)} - ${formatDateID(header.periodEndDate)}`;
    }
    return null;
  }, [header.periodStartDate, header.periodEndDate]);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: employee
      ? `Slip-Gaji-${employee.name.replace(/\s+/g, "_")}-${header.invoiceNumber}`
      : "slip-gaji",
  });

  if (!employee) return null;
  const total = totalForEmployee(employee);
  const employeeNotes = (employee.catatan ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const paymentLabel = { cash: "Tunai", transfer: "Transfer Bank", ewallet: "E-Wallet" }[
    header.paymentMethod
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Slip Gaji — {employee.name || "Tanpa Nama"}</DialogTitle>
          <DialogDescription>
            Pratinjau slip gaji individual. Klik Export PDF untuk menyimpan/mencetak.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={ref}
          className="bg-white text-[#1a1f2e] p-8 border rounded-md"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[var(--color-primary)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid place-items-center h-11 w-11 rounded-md bg-[var(--color-primary)] text-white shrink-0 overflow-hidden">
                {companyLogo ? <img src={companyLogo} alt="Logo" className="h-full w-full object-contain" /> : <Wallet className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="text-lg font-bold truncate">{companyName}</div>
                {companyAddress && (
                  <div className="text-[11px] text-gray-500 truncate">{companyAddress}</div>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Slip Gaji
              </div>
              <div className="text-[11px] font-mono mt-0.5">
                {header.invoiceNumber}-{String(childIdx + 1).padStart(3, "0")}
              </div>
            </div>
          </div>

          {/* Employee meta */}
          <div className="grid grid-cols-2 gap-6 my-5 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                Nama Karyawan
              </div>
              <div className="font-semibold text-base">{employee.name || "—"}</div>
              {periodLabel && (<><div className="text-[10px] uppercase tracking-wide text-gray-500 mt-3 mb-1">Periode</div><div className="text-xs">{periodLabel}</div></>)}
            <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-3 mb-1">
                Proyek
              </div>
              <div className="font-medium">{header.projectTitle || "—"}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                Tanggal Pembayaran
              </div>
              <div className="font-semibold">{formatDateID(header.paymentDate)}</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-3 mb-1">
                Metode Pembayaran
              </div>
              <div className="font-medium">{paymentLabel}</div>
            </div>
          </div>

          {/* Detail */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white">
                <th className="text-left px-3 py-2">Keterangan</th>
                <th className="text-right px-3 py-2 w-40">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Upah per Hari</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatRupiah(employee.dailySalary)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Jumlah Hari Kerja</td>
                <td className="px-3 py-2 text-right tabular-nums">{employee.workingDays} hari</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Total Sebelum Potongan</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatRupiah((Number(employee.dailySalary) || 0) * (Number(employee.workingDays) || 0))}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Kasbon / Potongan</td>
                <td className="px-3 py-2 text-right tabular-nums">{employee.kasbon ? formatRupiah(employee.kasbon) : "Rp 0"}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Status Pembayaran</td>
                <td className="px-3 py-2 text-right uppercase text-xs font-semibold">
                  <span
                    className={
                      employee.status === "paid" ? "text-emerald-700" : "text-amber-700"
                    }
                  >
                    {employee.status === "paid" ? "Lunas" : "Belum Lunas"}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[var(--color-primary)] text-white">
                <td className="px-3 py-2.5 uppercase tracking-wide text-xs">{employee.kasbon ? "Total Diterima" : "Total Diterima"}</td>
                <td className="px-3 py-2.5 text-right text-base font-bold tabular-nums">
                  {formatRupiah(total)}
                </td>
              </tr>
            </tfoot>
          </table>

          {employeeNotes.length > 0 && (
            <div className="mt-5 p-3 border-l-4 border-amber-500 bg-amber-50 text-xs">
              <div className="font-semibold uppercase tracking-wide text-[10px] text-gray-500 mb-1">
                Catatan Karyawan
              </div>
              <ul className="list-disc pl-4 space-y-0.5">
                {employeeNotes.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {header.notes && (
            <div className="mt-5 p-3 border-l-4 border-[var(--color-primary)] bg-gray-50 text-xs">
              <div className="font-semibold uppercase tracking-wide text-[10px] text-gray-500 mb-1">
                Catatan
              </div>
              <p className="whitespace-pre-wrap">{header.notes}</p>
            </div>
          )}

          {/* Signatures: PIC + Karyawan */}
          <div className="grid grid-cols-2 gap-12 mt-10 text-sm text-center">
            <SigCell
              title="Penanggung Jawab"
              name={signature.picName || header.personInCharge}
              image={signature.picImage}
            />
            <SigCell title="Karyawan" name={employee.name} />
          </div>

        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Cetak
          </Button>
          <Button onClick={handlePrint}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SigCell({ title, name, image }: { title: string; name: string; image?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2">{title}</div>
      <div className="h-16 flex items-end justify-center">
        {image ? <img src={image} alt="" className="max-h-full max-w-full object-contain" /> : null}
      </div>
      <div className="border-t border-gray-400 pt-1.5 mt-1">
        <div className="font-semibold">{name || "(_______________)"}</div>
      </div>
    </div>
  );
}
