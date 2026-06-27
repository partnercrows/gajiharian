import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Printer,
  Save,
  Upload,
  Download,
  FilePlus,
  FileSpreadsheet,
  Layers,
  MoreHorizontal,
  FolderOpen,
} from "lucide-react";
import { z } from "zod";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { InvoiceHeaderForm } from "@/components/InvoiceHeaderForm";
import { PayrollTable } from "@/components/PayrollTable";
import { PayrollSummary } from "@/components/PayrollSummary";
import { ExcelImportDialog } from "@/components/ExcelImportDialog";
import { SignatureSection } from "@/components/SignatureSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvoiceStore } from "@/lib/store";
import { exportProject, importProject } from "@/lib/project-file";
import { toast } from "sonner";

const searchSchema = z.object({ import: z.boolean().optional() }).partial();

export const Route = createFileRoute("/editor")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Invoice Editor — Gajian Harianku" },
      { name: "description", content: "Build a payroll invoice with manual rows, Excel import, or templates." },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [importOpen, setImportOpen] = useState(Boolean(search.import));
  const [tplDialog, setTplDialog] = useState(false);
  const [tplName, setTplName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const header = useInvoiceStore((s) => s.header);
  const employees = useInvoiceStore((s) => s.employees);
  const signature = useInvoiceStore((s) => s.signature);
  const saveDraft = useInvoiceStore((s) => s.saveDraft);
  const saveTemplate = useInvoiceStore((s) => s.saveTemplate);
  const loadProject = useInvoiceStore((s) => s.loadProject);
  const reset = useInvoiceStore((s) => s.resetProject);

  const validateAndPrint = () => {
    if (!header.projectTitle.trim()) {
      toast.error("Judul proyek wajib diisi");
      return;
    }
    if (!header.personInCharge.trim()) {
      toast.error("Penanggung jawab wajib diisi");
      return;
    }
    if (employees.length === 0) {
      toast.error("Tambahkan minimal satu karyawan");
      return;
    }
    const invalid = employees.some((e) => !e.name.trim() || e.workingDays <= 0);
    if (invalid) {
      toast.error("Beberapa baris belum lengkap (nama & hari kerja)");
      return;
    }
    saveDraft();
    navigate({ to: "/print" });
  };

  const handleSave = () => {
    saveDraft();
    toast.success("Draft tersimpan lokal");
  };

  const handleExport = () => {
    exportProject({
      id: header.invoiceNumber,
      header,
      employees,
      signature,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    toast.success("Project file downloaded");
  };

  const handleOpenFile = async (file: File) => {
    try {
      const proj = await importProject(file);
      loadProject(proj);
      toast.success("Proyek dimuat");
    } catch (err) {
      toast.error("File .payroll tidak valid", { description: (err as Error).message });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Toolbar */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight truncate">
              {header.projectTitle || "Untitled Invoice"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{header.invoiceNumber}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <FileSpreadsheet className="h-4 w-4" /> Import Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => setTplDialog(true)} disabled={employees.length === 0}>
              <Layers className="h-4 w-4" /> Save as template
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save draft
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { reset(); toast.success("Started a new invoice"); }}>
                  <FilePlus className="h-4 w-4" /> New invoice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <FolderOpen className="h-4 w-4" /> Open .payroll file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="h-4 w-4" /> Export .payroll
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/drafts" })}>
                  <Upload className="h-4 w-4" /> Open from drafts
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={validateAndPrint}>
              <Printer className="h-4 w-4" /> Preview & Print
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".payroll,.json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleOpenFile(f);
              e.target.value = "";
            }}
          />
        </div>

        <PayrollSummary />
        <InvoiceHeaderForm />
        <PayrollTable />
        <SignatureSection />
      </div>

      <ExcelImportDialog open={importOpen} onOpenChange={setImportOpen} />

      <Dialog open={tplDialog} onOpenChange={setTplDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save worker list as template</DialogTitle>
            <DialogDescription>
              Stores names and default daily salaries (no working days or status).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Template name</Label>
            <Input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="e.g. Tukang Bangunan Cikarang" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTplDialog(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!tplName.trim()) return toast.error("Name required");
                saveTemplate(tplName.trim());
                toast.success("Template saved");
                setTplName("");
                setTplDialog(false);
              }}
            >
              Save template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
