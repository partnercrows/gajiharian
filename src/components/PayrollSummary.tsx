import { Users, CalendarDays, Wallet, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useInvoiceStore, grandTotal, totalWorkingDays, totalKasbon } from "@/lib/store";
import { formatRupiah, formatNumber } from "@/lib/format";

export function PayrollSummary() {
  const employees = useInvoiceStore((s) => s.employees);
  const total = grandTotal(employees);
  const days = totalWorkingDays(employees);
  const kasbon = totalKasbon(employees);
  const paid = employees.filter((e) => e.status === "paid").length;

  const items = [
    { label: "Total Karyawan", value: formatNumber(employees.length), sub: `${paid} sudah lunas`, icon: Users },
    { label: "Total Kasbon", value: formatRupiah(kasbon), sub: "potongan", icon: DollarSign },
    { label: "Total Pembayaran", value: formatRupiah(total), sub: "setelah potongan", icon: Wallet, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card
          key={it.label}
          className={
            it.highlight
              ? "p-5 bg-primary text-primary-foreground border-primary"
              : "p-5"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className={`text-xs uppercase tracking-wide ${it.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {it.label}
              </div>
              <div className="text-2xl font-bold mt-1 tabular-nums truncate">{it.value}</div>
              <div className={`text-xs mt-1 ${it.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {it.sub}
              </div>
            </div>
            <div className={`grid place-items-center h-10 w-10 rounded-md shrink-0 ${it.highlight ? "bg-primary-foreground/15" : "bg-accent text-accent-foreground"}`}>
              <it.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
