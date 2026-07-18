import { isTauri } from "@tauri-apps/api/core";

interface SaveFileOptions {
  suggestedName: string;
  filterName: string;
  extensions: string[];
  mimeType: string;
}

/**
 * Saves bytes to disk. In the Tauri desktop app this shows a native "Save As"
 * dialog (writeFile via plugin-fs) — the browser's blob+anchor auto-download
 * pattern is not reliably surfaced by the WebView2 download UI on every
 * Windows configuration. In the browser build it falls back to the normal
 * blob download.
 */
export async function saveFile(bytes: Uint8Array, options: SaveFileOptions): Promise<boolean> {
  if (isTauri()) {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const path = await save({
      defaultPath: options.suggestedName,
      filters: [{ name: options.filterName, extensions: options.extensions }],
    });
    if (!path) return false;
    await writeFile(path, bytes);
    return true;
  }

  const blob = new Blob([bytes as BlobPart], { type: options.mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = options.suggestedName;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
