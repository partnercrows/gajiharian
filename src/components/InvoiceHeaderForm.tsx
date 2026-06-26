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
import type { PaymentMethod } from "@/lib/types";

export function InvoiceHeaderForm() {
  const header = useInvoiceStore((s) => s.header);
  const updateHeader = useInvoiceStore((s) => s.updateHeader);
  const setPaymentMethod = useInvoiceStore((s) => s.setPaymentMethod);

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-lg">Invoice Details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Header information shown on the printed invoice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Project Title" required>
          <Input
            value={header.projectTitle}
            onChange={(e) => updateHeader({ projectTitle: e.target.value })}
            placeholder="e.g. Renovasi Gudang Cikarang"
          />
        </Field>

        <Field label="Invoice Number">
          <Input value={header.invoiceNumber} readOnly className="bg-muted font-mono text-xs" />
        </Field>

        <Field label="Payment Date">
          <Input
            type="date"
            value={header.paymentDate}
            onChange={(e) => updateHeader({ paymentDate: e.target.value })}
          />
        </Field>

        <Field label="Person In Charge" required>
          <Input
            value={header.personInCharge}
            onChange={(e) => updateHeader({ personInCharge: e.target.value })}
            placeholder="Nama penanggung jawab"
          />
        </Field>

        <Field label="Payment Method">
          <Select
            value={header.paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      {header.paymentMethod === "transfer" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
          <Field label="Bank Name">
            <Input
              value={header.bankName ?? ""}
              onChange={(e) => updateHeader({ bankName: e.target.value })}
              placeholder="e.g. BCA"
            />
          </Field>
          <Field label="Account Number">
            <Input
              value={header.accountNumber ?? ""}
              onChange={(e) => updateHeader({ accountNumber: e.target.value.replace(/\D/g, "") })}
              placeholder="1234567890"
              inputMode="numeric"
            />
          </Field>
          <Field label="Account Holder">
            <Input
              value={header.accountHolder ?? ""}
              onChange={(e) => updateHeader({ accountHolder: e.target.value })}
              placeholder="Nama pemilik rekening"
            />
          </Field>
        </div>
      )}

      <Field label="Notes (optional)">
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
