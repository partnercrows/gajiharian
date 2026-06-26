import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInvoiceStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Gajian Harianku" },
      { name: "description", content: "Workspace settings for Gajian Harianku." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const companyName = useInvoiceStore((s) => s.companyName);
  const companyAddress = useInvoiceStore((s) => s.companyAddress);
  const update = useInvoiceStore((s) => s.updateCompany);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Shown on every printed invoice.</p>
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Company / Workspace</h2>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company name</Label>
            <Input
              value={companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="Gajian Harianku"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Address (optional)</Label>
            <Textarea
              value={companyAddress}
              onChange={(e) => update({ companyAddress: e.target.value })}
              placeholder="Jl. Contoh No. 1, Jakarta"
              rows={2}
            />
          </div>
          <div className="pt-2">
            <Button onClick={() => toast.success("Settings saved locally")}>Save</Button>
          </div>
        </Card>

        <Card className="p-6 text-sm text-muted-foreground space-y-2">
          <h2 className="font-semibold text-foreground">About your data</h2>
          <p>Everything (invoices, drafts, templates) is stored in your browser's IndexedDB. Nothing is sent to any server.</p>
          <p>Clearing your browser's site data will permanently remove all saved invoices. Export important projects as <code className="font-mono bg-muted px-1 rounded">.payroll</code> files to keep backups.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
