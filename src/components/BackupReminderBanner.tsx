import { AlertTriangle, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/lib/store";
import { exportProject } from "@/lib/project-file";
import { toast } from "sonner";

const REMINDER_AFTER_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export function BackupReminderBanner() {
  const header = useInvoiceStore((s) => s.header);
  const employees = useInvoiceStore((s) => s.employees);
  const signature = useInvoiceStore((s) => s.signature);
  const drafts = useInvoiceStore((s) => s.drafts);
  const templates = useInvoiceStore((s) => s.templates);
  const lastExportedAt = useInvoiceStore((s) => s.lastExportedAt);
  const backupReminderDismissedUntil = useInvoiceStore((s) => s.backupReminderDismissedUntil);
  const markExported = useInvoiceStore((s) => s.markExported);
  const dismissBackupReminder = useInvoiceStore((s) => s.dismissBackupReminder);
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);
  const companyPhone = useInvoiceStore((s) => s.companyPhone);
  const companyLogo = useInvoiceStore((s) => s.companyLogo);

  const hasData = employees.length > 0 || drafts.length > 0 || templates.length > 0;
  const isSnoozed = !!backupReminderDismissedUntil && backupReminderDismissedUntil > Date.now();
  const daysSinceExport = lastExportedAt ? Math.floor((Date.now() - lastExportedAt) / DAY_MS) : null;
  const isOverdue = daysSinceExport === null || daysSinceExport >= REMINDER_AFTER_DAYS;

  if (!hasData || isSnoozed || !isOverdue) return null;

  const handleExportNow = async () => {
    try {
      const saved = await exportProject(
        {
          id: header.invoiceNumber,
          header,
          employees,
          signature,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        drafts,
        templates,
        { companyName, companyAddress, companyPhone, companyLogo },
      );
      if (saved) {
        markExported();
        toast.success("Backup berhasil disimpan");
      }
    } catch (err) {
      toast.error("Gagal menyimpan backup", { description: (err as Error).message });
    }
  };

  return (
    <div className="flex items-start sm:items-center justify-between gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5 sm:mt-0" />
        <p className="min-w-0">
          {daysSinceExport === null
            ? "Kamu belum pernah backup data (export .payroll)."
            : `Sudah ${daysSinceExport} hari sejak backup terakhir.`}{" "}
          <span className="text-muted-foreground">Data cuma tersimpan di perangkat ini.</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" onClick={handleExportNow}>
          <Download className="h-4 w-4" /> Export Sekarang
        </Button>
        <Button size="sm" variant="ghost" onClick={() => dismissBackupReminder()} title="Ingatkan lagi besok">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
