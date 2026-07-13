import * as XLSX from "xlsx";
import type { Employee, PaymentStatus } from "./types";
import { uid } from "./format";

export interface ImportResult {
  imported: Employee[];
  invalid: number;
  errors: string[];
}

export const downloadTemplateXlsx = () => {
  const data = [
    ["Employee Name", "Daily Salary", "Working Days", "Kasbon (optional)"],
    ["Budi Santoso", 150000, 6, 0],
    ["Siti Aminah", 175000, 5, 50000],
    ["Agus Wijaya", 150000, 6, 0],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll");
  XLSX.writeFile(wb, "payroll-template.xlsx");
};

export const parseSpreadsheet = async (file: File): Promise<ImportResult> => {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  const imported: Employee[] = [];
  const errors: string[] = [];
  let invalid = 0;

  rows.forEach((row, idx) => {
    const keys = Object.keys(row);
    const findKey = (...candidates: string[]) =>
      keys.find((k) =>
        candidates.some((c) => k.toLowerCase().replace(/\s+/g, "") === c.toLowerCase().replace(/\s+/g, "")),
      );

    const nameKey = findKey("Employee Name", "Name", "Nama");
    const salaryKey = findKey("Daily Salary", "Salary", "Upah Harian", "Gaji Harian");
    const daysKey = findKey("Working Days", "Days", "Hari Kerja");
    const kasbonKey = findKey("Kasbon", "Cash Advance", "Potongan");

    const name = nameKey ? String(row[nameKey] ?? "").trim() : "";
    const salary = salaryKey ? Number(row[salaryKey]) : NaN;
    const days = daysKey ? Number(row[daysKey]) : NaN;

    if (!name) {
      invalid++;
      errors.push(`Row ${idx + 2}: empty name`);
      return;
    }
    if (!Number.isFinite(salary) || salary < 0) {
      invalid++;
      errors.push(`Row ${idx + 2}: invalid salary`);
      return;
    }
    if (!Number.isInteger(days) || days <= 0) {
      invalid++;
      errors.push(`Row ${idx + 2}: invalid working days`);
      return;
    }

    const kasbon = kasbonKey ? (Number(row[kasbonKey]) || 0) : 0;

    imported.push({
      id: uid(),
      name,
      dailySalary: salary,
      workingDays: days,
      kasbon: kasbon >= 0 ? kasbon : undefined,
      status: "unpaid" as PaymentStatus,
    });
  });

  return { imported, invalid, errors };
};
