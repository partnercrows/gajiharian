import { Users, CalendarDays, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useInvoiceStore, grandTotal, totalWorkingDays } from "@/lib/store";
import { formatRupiah, formatNumber } from "@/lib/format";

export function PayrollSummary() {
  const employees = useInvoiceStore((s) => s.employees);
  const total = grandTotal(employees);
  const days = totalWorkingDays(employees);
  const paid = employees.filter((e) => e.status === "paid").length;

  const items = [
    { label: "Total Employees", value: formatNumber(employees.length), sub: `${paid} marked paid`, icon: Users },
    { label: "Total Working Days", value: formatNumber(days), sub: "across all rows", icon: CalendarDays },
    { label: "Grand Total Salary", value: formatRupiah(total), sub: "auto-calculated", icon: Wallet, highlight: true },
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
