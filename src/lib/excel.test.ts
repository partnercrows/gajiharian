import { describe, it, expect } from "vitest";
import * as XLSX from "xlsx";
import { parseSpreadsheet } from "./excel";

function makeXlsxFile(rows: unknown[][]): File {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll");
  const bytes = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as Uint8Array;
  return new File([bytes as BlobPart], "test.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

describe("parseSpreadsheet", () => {
  it("imports valid rows with English headers", async () => {
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days", "Kasbon"],
      ["Budi Santoso", 150000, 20, 50000],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(0);
    expect(result.imported).toHaveLength(1);
    expect(result.imported[0]).toMatchObject({
      name: "Budi Santoso",
      dailySalary: 150000,
      workingDays: 20,
      kasbon: 50000,
    });
  });

  it("imports valid rows with Indonesian headers", async () => {
    const file = makeXlsxFile([
      ["Nama", "Upah Harian", "Hari Kerja", "Potongan"],
      ["Siti Aminah", 175000, 5, 25000],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(0);
    expect(result.imported[0]).toMatchObject({ name: "Siti Aminah", dailySalary: 175000, workingDays: 5, kasbon: 25000 });
  });

  it("recognizes headers with a parenthetical suffix like the official template ('Kasbon (optional)')", async () => {
    // Regression test: findKey used to require an exact match, so the
    // downloadable template's own "(optional)" headers never matched their
    // own parser. It now matches on a startsWith basis.
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days", "Lembur (optional)", "Kasbon (optional)", "Catatan (optional)"],
      ["Agus Wijaya", 150000, 6, 100000, 50000, "kasbon tanggal 2"],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(0);
    expect(result.imported[0]).toMatchObject({
      name: "Agus Wijaya",
      dailySalary: 150000,
      workingDays: 6,
      lembur: 100000,
      kasbon: 50000,
      catatan: "kasbon tanggal 2",
    });
  });

  it("flags rows with an empty name as invalid", async () => {
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days"],
      ["", 150000, 6],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(1);
    expect(result.imported).toHaveLength(0);
    expect(result.errors[0]).toMatch(/empty name/);
  });

  it("flags rows with a negative salary as invalid", async () => {
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days"],
      ["Budi", -1000, 6],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(1);
    expect(result.errors[0]).toMatch(/invalid salary/);
  });

  it("flags rows with zero or non-integer working days as invalid", async () => {
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days"],
      ["Budi", 150000, 0],
      ["Siti", 150000, 5.5],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.invalid).toBe(2);
    expect(result.imported).toHaveLength(0);
  });

  it("defaults lembur/catatan to absent and kasbon to 0 when columns are missing", async () => {
    const file = makeXlsxFile([
      ["Employee Name", "Daily Salary", "Working Days"],
      ["Budi Santoso", 150000, 20],
    ]);
    const result = await parseSpreadsheet(file);
    expect(result.imported[0].kasbon).toBe(0);
    expect(result.imported[0].lembur).toBeUndefined();
    expect(result.imported[0].catatan).toBeUndefined();
  });
});
