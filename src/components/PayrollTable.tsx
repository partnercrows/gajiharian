import { Plus, Copy, Trash2, Eraser } from "lucide-react";
import { useInvoiceStore, totalForEmployee } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export function PayrollTable() {
  const employees = useInvoiceStore((s) => s.employees);
  const addEmployee = useInvoiceStore((s) => s.addEmployee);
  const updateEmployee = useInvoiceStore((s) => s.updateEmployee);
  const removeEmployee = useInvoiceStore((s) => s.removeEmployee);
  const duplicateEmployee = useInvoiceStore((s) => s.duplicateEmployee);
  const clearEmployees = useInvoiceStore((s) => s.clearEmployees);
  const setStatus = useInvoiceStore((s) => s.setStatus);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b">
        <div className="min-w-0">
          <h2 className="font-semibold text-lg">Payroll</h2>
          <p className="text-xs text-muted-foreground">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} · totals recalculate live
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {employees.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eraser className="h-4 w-4" /> Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all employees?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes every row from the payroll table. You can't undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearEmployees}>Clear all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button size="sm" onClick={() => addEmployee()}>
            <Plus className="h-4 w-4" /> Add row
          </Button>
        </div>
      </div>

      <div className="max-h-[560px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur z-10">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-10 px-4 py-3">#</th>
              <th className="px-3 py-3 min-w-[200px]">Employee Name</th>
              <th className="px-3 py-3 w-[160px]">Daily Salary</th>
              <th className="px-3 py-3 w-[110px]">Days</th>
              <th className="px-3 py-3 w-[160px] text-right">Total</th>
              <th className="px-3 py-3 w-[130px]">Status</th>
              <th className="px-3 py-3 w-[110px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="space-y-2">
                    <p>No employees yet.</p>
                    <Button variant="outline" size="sm" onClick={() => addEmployee()}>
                      <Plus className="h-4 w-4" /> Add first row
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
                      onChange={(ev) => updateEmployee(e.id, { name: ev.target.value })}
                      placeholder="Nama pekerja"
                      className="h-9"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      step={1000}
                      value={e.dailySalary || ""}
                      onChange={(ev) => updateEmployee(e.id, { dailySalary: Math.max(0, Number(ev.target.value) || 0) })}
                      className="h-9 text-right tabular-nums"
                      placeholder="0"
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
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {formatRupiah(totalForEmployee(e))}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setStatus(e.id, e.status === "paid" ? "unpaid" : "paid")}
                      className="inline-block"
                      title="Click to toggle"
                    >
                      <Badge
                        className={cn(
                          "cursor-pointer",
                          e.status === "paid"
                            ? "bg-success text-success-foreground hover:bg-success/90"
                            : "bg-warning text-warning-foreground hover:bg-warning/90",
                        )}
                      >
                        {e.status === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => duplicateEmployee(e.id)}
                        title="Duplicate row"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeEmployee(e.id)}
                        title="Delete row"
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
    </Card>
  );
}
