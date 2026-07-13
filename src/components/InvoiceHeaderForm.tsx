import { useInvoiceStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { PaymentMethod } from "@/lib/types";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { useMemo } from "react";

export function InvoiceHeaderForm() {
  const header = useInvoiceStore((s) => s.header);
  const updateHeader = useInvoiceStore((s) => s.updateHeader);
  const setPaymentMethod = useInvoiceStore((s) => s.setPaymentMethod);

  const periodDays = useMemo(() => {
    if (header.periodStartDate && header.periodEndDate) {
      const start = new Date(header.periodStartDate);
      const end = new Date(header.periodEndDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : null;
    }
    return null;
  }, [header.autoCalculatePeriod, header.periodStartDate, header.periodEndDate]);

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-lg">Detail Invoice</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Informasi header yang tercetak pada invoice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Judul Proyek" required>
          <Input
            value={header.projectTitle}
            onChange={(e) => updateHeader({ projectTitle: e.target.value })}
            placeholder="cth. Renovasi Gudang Cikarang"
          />
        </Field>

        <Field label="Nomor Invoice">
          <Input value={header.invoiceNumber} onChange={(e) => updateHeader({ invoiceNumber: e.target.value })} className="font-mono text-xs" placeholder="cth: INV/GH/20260627/8860" />
        </Field>

        <Field label="Tanggal Pembayaran">
          <Input
            type="date"
            value={header.paymentDate}
            onChange={(e) => updateHeader({ paymentDate: e.target.value })}
          />
        </Field>

        <Field label="Penanggung Jawab" required>
          <Input
            value={header.personInCharge}
            onChange={(e) => updateHeader({ personInCharge: e.target.value })}
            placeholder="Nama penanggung jawab"
          />
        </Field>

        <Field label="Metode Pembayaran">
          <Select
            value={header.paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Tunai</SelectItem>
              <SelectItem value="transfer">Transfer Bank</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {header.paymentMethod === "transfer" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
          <Field label="Nama Bank">
            <Input
              value={header.bankName ?? ""}
              onChange={(e) => updateHeader({ bankName: e.target.value })}
              placeholder="cth. BCA"
            />
          </Field>
          <Field label="Nomor Rekening">
            <Input
              value={header.accountNumber ?? ""}
              onChange={(e) => updateHeader({ accountNumber: e.target.value.replace(/\D/g, "") })}
              placeholder="1234567890"
              inputMode="numeric"
            />
          </Field>
          <Field label="Atas Nama">
            <Input
              value={header.accountHolder ?? ""}
              onChange={(e) => updateHeader({ accountHolder: e.target.value })}
              placeholder="Nama pemilik rekening"
            />
          </Field>
        </div>
      )}

      <Field label="Periode Penggajian (opsional)">
          <DateRangePicker
            value={header.periodStartDate && header.periodEndDate ? { from: new Date(header.periodStartDate), to: new Date(header.periodEndDate) } : header.periodStartDate ? { from: new Date(header.periodStartDate), to: undefined } : undefined}
            onChange={(range) => {
              updateHeader({
                periodStartDate: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
                periodEndDate: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
              });
            }}
            placeholder="Pilih rentang tanggal periode"
          />
          {periodDays !== null && <p className="text-xs text-muted-foreground mt-1">{periodDays} hari</p>}
        </Field>

        <Field label="Catatan (opsional)">
        <Textarea
          value={header.notes ?? ""}
          onChange={(e) => updateHeader({ notes: e.target.value })}
          placeholder="Catatan tambahan untuk invoice…"
          rows={2}
        />
      </Field>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
