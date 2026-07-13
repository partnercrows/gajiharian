import { z } from "zod";
import type { InvoiceProject, WorkerTemplate } from "./types";

const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  dailySalary: z.number(),
  workingDays: z.number(),
  kasbon: z.number().optional(),
  status: z.enum(["paid", "unpaid"]),
  catatan: z.string().optional(),
});

const invoiceHeaderSchema = z.object({
  projectTitle: z.string(),
  invoiceNumber: z.string(),
  paymentDate: z.string(),
  personInCharge: z.string(),
  paymentMethod: z.enum(["cash", "transfer", "ewallet"]),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
  notes: z.string().optional(),
  periodStartDate: z.string().optional(),
  periodEndDate: z.string().optional(),
  autoCalculatePeriod: z.boolean().optional(),
});

const signatureInfoSchema = z.object({
  picName: z.string(),
  picImage: z.string().optional(),
  repName: z.string(),
  repImage: z.string().optional(),
});

const invoiceProjectSchema = z.object({
  id: z.string(),
  header: invoiceHeaderSchema,
  employees: z.array(employeeSchema),
  signature: signatureInfoSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
});

const workerTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  workers: z.array(
    z.object({
      name: z.string(),
      dailySalary: z.number(),
      kasbon: z.number().optional(),
      workingDays: z.number().optional(),
    }),
  ),
  createdAt: z.number(),
});

const settingsSchema = z.object({
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyLogo: z.string().optional(),
});

const payrollFileSchema = z.object({
  app: z.string().optional(),
  version: z.number().optional(),
  project: invoiceProjectSchema,
  drafts: z.array(invoiceProjectSchema).optional().default([]),
  templates: z.array(workerTemplateSchema).optional().default([]),
  settings: settingsSchema.optional(),
});

export const exportProject = (
  project: InvoiceProject,
  drafts?: InvoiceProject[],
  templates?: WorkerTemplate[],
  settings?: {
    companyName: string;
    companyAddress: string;
    companyPhone?: string;
    companyLogo?: string;
  },
  filename?: string,
) => {
  const data = {
    app: "Gaji Harian",
    version: 1,
    project,
    drafts: drafts || [],
    templates: templates || [],
    settings: settings || { companyName: "Gaji Harian", companyAddress: "", companyPhone: "" },
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

export const importProject = async (
  file: File,
): Promise<{
  project: InvoiceProject;
  drafts: InvoiceProject[];
  templates: WorkerTemplate[];
  settings?: {
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyLogo?: string;
  };
}> => {
  const text = await file.text();
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("File bukan format JSON yang valid — kemungkinan file rusak atau terpotong.");
  }

  const result = payrollFileSchema.safeParse(raw);
  if (!result.success) {
    const issue = result.error.issues[0];
    const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    throw new Error(`Struktur file tidak sesuai pada "${path}": ${issue.message}`);
  }

  const data = result.data;
  return {
    project: data.project as InvoiceProject,
    drafts: data.drafts as InvoiceProject[],
    templates: data.templates as WorkerTemplate[],
    settings: data.settings,
  };
};
