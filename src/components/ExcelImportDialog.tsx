import { useRef, useState } from "react";
import { Upload, FileDown, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { downloadTemplateXlsx, parseSpreadsheet, type ImportResult } from "@/lib/excel";
import { useInvoiceStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExcelImportDialog({ open, onOpenChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const setEmployees = useInvoiceStore((s) => s.setEmployees);
  const employees = useInvoiceStore((s) => s.employees);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const res = await parseSpreadsheet(file);
      setResult(res);
    } catch (err) {
      toast.error("Gagal membaca file", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const onApply = (mode: "replace" | "append") => {
    if (!result) return;
    const next = mode === "replace" ? result.imported : [...employees, ...result.imported];
    setEmployees(next);
    toast.success(`${result.imported.length} baris diimpor`);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setResult(null); }}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" /> Import from Excel</DialogTitle>
          <DialogDescription>
            Upload an .xlsx or .csv file. Columns: <b>Employee Name</b>, <b>Daily Salary</b>, <b>Working Days</b>.
          </DialogDescription>
        </DialogHeader>

        {!result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/60 text-sm">
              <span>Don't have a file yet?</span>
              <Button size="sm" variant="outline" onClick={downloadTemplateXlsx}>
                <FileDown className="h-4 w-4" /> Download template
              </Button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                dragOver ? "border-primary bg-accent/40" : "border-border hover:bg-muted/40",
              )}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drop your file here, or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">.xlsx or .csv up to ~5MB</p>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
            </div>
            {busy && <p className="text-sm text-muted-foreground text-center">Parsing…</p>}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-success/40 bg-success/5">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Imported</span>
                </div>
                <div className="text-2xl font-bold mt-1">{result.imported.length}</div>
              </Card>
              <Card className="p-4 border-destructive/40 bg-destructive/5">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">Invalid</span>
                </div>
                <div className="text-2xl font-bold mt-1">{result.invalid}</div>
              </Card>
            </div>
            {result.errors.length > 0 && (
              <div className="text-xs text-muted-foreground max-h-32 overflow-auto bg-muted/40 rounded-md p-3 space-y-0.5">
                {result.errors.slice(0, 20).map((er, i) => (<div key={i}>· {er}</div>))}
                {result.errors.length > 20 && <div>…and {result.errors.length - 20} more</div>}
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setResult(null)}>Choose another file</Button>
              {employees.length > 0 && (
                <Button variant="secondary" onClick={() => onApply("append")} disabled={result.imported.length === 0}>
                  Append to existing
                </Button>
              )}
              <Button onClick={() => onApply("replace")} disabled={result.imported.length === 0}>
                {employees.length > 0 ? "Replace existing" : "Add to invoice"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
