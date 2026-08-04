import { isTauri } from "@tauri-apps/api/core";

const REPO = "partnercrows/gajiharian";
const RELEASES_API = `https://api.github.com/repos/${REPO}/releases/latest`;

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseUrl: string;
}

function parseVersion(v: string): number[] {
  return v
    .replace(/^v/i, "")
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
}

export function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest);
  const b = parseVersion(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

/** Update-checking only makes sense for the desktop app: browser deployments
 * are always on the latest deployed code, there's no "installed version" to
 * fall behind on. */
export function updateCheckAvailable(): boolean {
  return isTauri();
}

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  if (!isTauri()) {
    throw new Error("Cek pembaruan hanya tersedia di aplikasi desktop.");
  }
  const { getVersion } = await import("@tauri-apps/api/app");
  const currentVersion = await getVersion();

  const res = await fetch(RELEASES_API, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    throw new Error(`Gagal menghubungi GitHub (HTTP ${res.status}).`);
  }
  const data = (await res.json()) as { tag_name?: string; html_url?: string };
  const latestVersion = String(data.tag_name ?? "").replace(/^v/i, "");
  if (!latestVersion) {
    throw new Error("Tidak bisa membaca versi rilis terbaru dari GitHub.");
  }

  return {
    currentVersion,
    latestVersion,
    hasUpdate: isNewer(latestVersion, currentVersion),
    releaseUrl: data.html_url ?? `https://github.com/${REPO}/releases/latest`,
  };
}

export async function openReleasePage(url: string) {
  if (isTauri()) {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    await openUrl(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
