import { useRef } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoiceStore, grandTotal, totalForEmployee, totalWorkingDays } from "@/lib/store";
import { formatRupiah, formatDateID, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "Pratinjau Cetak — Gajian Harianku" },
      { name: "description", content: "Pratinjau cetak A4 portrait invoice payroll." },
    ],
  }),
  component: PrintPage,
});

function PrintPage() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const header = useInvoiceStore((s) => s.header);
  const employees = useInvoiceStore((s) => s.employees);
  const signature = useInvoiceStore((s) => s.signature);
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    documentTitle: `${header.invoiceNumber}-${header.projectTitle || "invoice"}`,
  });

  const total = grandTotal(employees);
  const days = totalWorkingDays(employees);

  const paymentLabel = {
    cash: "Tunai",
    transfer: "Transfer Bank",
    ewallet: "E-Wallet",
  }[header.paymentMethod];

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Toolbar */}
      <div className="no-print bg-surface border-b sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/editor" })}>
            <ArrowLeft className="h-4 w-4" /> Kembali ke editor
          </Button>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:underline">Dashboard</Link>
            <Button onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4" /> Cetak Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Page */}
      <div className="py-8 px-4">
        <div
          ref={ref}
          className="print-page max-w-[210mm] mx-auto bg-white text-[#1a1f2e] shadow-elevated mx-auto p-12"
          style={{ minHeight: "297mm", fontFamily: "var(--font-sans)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b-2 border-[var(--color-primary)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid place-items-center h-12 w-12 rounded-md bg-[var(--color-primary)] text-white shrink-0">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-xl font-bold truncate">{companyName}</div>
                {companyAddress && <div className="text-xs text-gray-500 truncate">{companyAddress}</div>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold uppercase tracking-wider text-[var(--color-primary)]">Invoice</div>
              <div className="text-xs font-mono mt-0.5">{header.invoiceNumber}</div>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-8 my-6 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Proyek</div>
              <div className="font-semibold text-base">{header.projectTitle || "—"}</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-3 mb-1">Penanggung Jawab</div>
              <div className="font-medium">{header.personInCharge || "—"}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">Tanggal Pembayaran</div>
              <div className="font-semibold">{formatDateID(header.paymentDate)}</div>
              <div className="text-[10px] uppercase tracking-wide text-gray-500 mt-3 mb-1">Metode Pembayaran</div>
              <div className="font-medium">{paymentLabel}</div>
              {header.paymentMethod === "transfer" && (header.bankName || header.accountNumber) && (
                <div className="mt-1.5 text-xs text-gray-600">
                  {header.bankName} · {header.accountNumber}
                  {header.accountHolder && <> · a.n. {header.accountHolder}</>}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)] text-white">
                <th className="text-left px-3 py-2 w-10">#</th>
                <th className="text-left px-3 py-2">Nama Pekerja</th>
                <th className="text-right px-3 py-2 w-32">Upah/Hari</th>
                <th className="text-right px-3 py-2 w-20">Hari</th>
                <th className="text-right px-3 py-2 w-36">Total</th>
                <th className="text-center px-3 py-2 w-20">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e, i) => (
                <tr key={e.id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{e.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatRupiah(e.dailySalary)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{e.workingDays}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">{formatRupiah(totalForEmployee(e))}</td>
                  <td className="px-3 py-2 text-center text-[10px] uppercase font-semibold">
                    <span className={e.status === "paid" ? "text-emerald-700" : "text-amber-700"}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={3} className="px-3 py-2 text-right text-gray-600 text-xs uppercase tracking-wide">Subtotal</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatNumber(days)} hari</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatRupiah(total)}</td>
                <td />
              </tr>
              <tr className="bg-[var(--color-primary)] text-white">
                <td colSpan={4} className="px-3 py-2.5 text-right uppercase tracking-wide text-xs">Grand Total</td>
                <td className="px-3 py-2.5 text-right text-base font-bold tabular-nums">{formatRupiah(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center text-xs">
            <SummaryCell label="Pekerja" value={`${employees.length} orang`} />
            <SummaryCell label="Total Hari Kerja" value={`${formatNumber(days)} hari`} />
            <SummaryCell label="Total Pembayaran" value={formatRupiah(total)} highlight />
          </div>

          {header.notes && (
            <div className="mt-6 p-3 border-l-4 border-[var(--color-primary)] bg-gray-50 text-xs">
              <div className="font-semibold uppercase tracking-wide text-[10px] text-gray-500 mb-1">Catatan</div>
              <p className="whitespace-pre-wrap">{header.notes}</p>
            </div>
          )}

          {/* Signature */}
          <div className="grid grid-cols-2 gap-12 mt-12 text-sm text-center">
            <SignatureCell title="Penanggung Jawab" name={signature.picName || header.personInCharge} image={signature.picImage} />
            <SignatureCell title="Perwakilan Pekerja" name={signature.repName} image={signature.repImage} />
          </div>

          <div className="mt-12 pt-4 border-t text-[10px] text-center text-gray-400">
            Generated with Gajian Harianku · {formatDateID(new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "p-3 rounded-md bg-[var(--color-primary)] text-white" : "p-3 rounded-md bg-gray-100"}>
      <div className={`text-[9px] uppercase tracking-wider ${highlight ? "text-white/80" : "text-gray-500"}`}>{label}</div>
      <div className={`font-bold mt-0.5 ${highlight ? "text-base" : "text-sm"}`}>{value}</div>
    </div>
  );
}

function SignatureCell({ title, name, image }: { title: string; name: string; image?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-2">{title}</div>
      <div className="h-20 flex items-end justify-center">
        {image ? <img src={image} alt="" className="max-h-full max-w-full object-contain" /> : null}
      </div>
      <div className="border-t border-gray-400 pt-1.5 mt-1">
        <div className="font-semibold">{name || "(_______________)"}</div>
      </div>
    </div>
  );
}
