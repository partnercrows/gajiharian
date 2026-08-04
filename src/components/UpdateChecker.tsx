import { useState } from "react";
import { RefreshCw, CheckCircle2, ArrowUpCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkForUpdate, openReleasePage, updateCheckAvailable, type UpdateCheckResult } from "@/lib/update-check";

type Status = "idle" | "checking" | "done" | "error";

export function UpdateChecker() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<UpdateCheckResult | null>(null);
  const [error, setError] = useState("");

  if (!updateCheckAvailable()) return null;

  const handleCheck = async () => {
    setStatus("checking");
    setError("");
    try {
      const res = await checkForUpdate();
      setResult(res);
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <Card className="p-6 space-y-3">
      <h2 className="font-semibold">Pembaruan Aplikasi</h2>
      <p className="text-sm text-muted-foreground">
        Aplikasi ini offline — tidak ada pengecekan otomatis. Klik tombol di bawah untuk cek versi
        terbaru secara manual (butuh koneksi internet sesaat, hanya menghubungi GitHub).
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" onClick={handleCheck} disabled={status === "checking"}>
          <RefreshCw className={`h-4 w-4 ${status === "checking" ? "animate-spin" : ""}`} />
          {status === "checking" ? "Mengecek..." : "Cek Pembaruan"}
        </Button>

        {status === "done" && result && !result.hasUpdate && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" /> Sudah versi terbaru (v{result.currentVersion})
          </span>
        )}

        {status === "done" && result && result.hasUpdate && (
          <span className="inline-flex items-center gap-1.5 text-sm text-warning">
            <ArrowUpCircle className="h-4 w-4" /> Versi baru tersedia: v{result.latestVersion} (kamu pakai v{result.currentVersion})
          </span>
        )}

        {status === "error" && (
          <span className="text-sm text-destructive">{error}</span>
        )}
      </div>

      {status === "done" && result && result.hasUpdate && (
        <Button size="sm" onClick={() => openReleasePage(result.releaseUrl)}>
          <ExternalLink className="h-4 w-4" /> Buka Halaman Download
        </Button>
      )}
    </Card>
  );
}
