import type { InvoiceProject } from "./types";

export const exportProject = (project: InvoiceProject, filename?: string) => {
  const data = {
    app: "Gajian Harianku",
    version: 1,
    project,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = (project.header.projectTitle || "untitled").replace(/[^a-z0-9-_]+/gi, "-");
  a.download = filename ?? `${safeTitle}.payroll`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importProject = async (file: File): Promise<InvoiceProject> => {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed?.project) throw new Error("Invalid .payroll file");
  return parsed.project as InvoiceProject;
};
