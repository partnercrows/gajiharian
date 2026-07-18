import { describe, it, expect } from "vitest";
import { totalForEmployee, grandTotal, totalKasbon, totalLembur, totalWorkingDays } from "./store";
import type { Employee } from "./types";

const emp = (overrides: Partial<Employee> = {}): Employee => ({
  id: "1",
  name: "Test",
  dailySalary: 100000,
  workingDays: 10,
  status: "unpaid",
  ...overrides,
});

describe("totalForEmployee", () => {
  it("computes upah x hari with no kasbon/lembur", () => {
    expect(totalForEmployee(emp())).toBe(1000000);
  });

  it("subtracts kasbon", () => {
    expect(totalForEmployee(emp({ kasbon: 200000 }))).toBe(800000);
  });

  it("adds lembur", () => {
    expect(totalForEmployee(emp({ lembur: 150000 }))).toBe(1150000);
  });

  it("applies lembur and kasbon together (lembur added, kasbon subtracted)", () => {
    expect(totalForEmployee(emp({ lembur: 100000, kasbon: 200000 }))).toBe(900000);
  });

  it("allows total to go negative when kasbon exceeds earnings", () => {
    expect(totalForEmployee(emp({ dailySalary: 50000, workingDays: 1, kasbon: 200000 }))).toBe(-150000);
  });

  it("treats missing/undefined kasbon and lembur as zero", () => {
    expect(totalForEmployee(emp({ kasbon: undefined, lembur: undefined }))).toBe(1000000);
  });

  it("guards against NaN inputs (falls back to 0)", () => {
    expect(totalForEmployee(emp({ dailySalary: NaN, workingDays: 10 }))).toBe(0);
  });
});

describe("grandTotal", () => {
  it("sums totalForEmployee across all employees", () => {
    const list = [
      emp({ id: "1", dailySalary: 100000, workingDays: 10 }), // 1,000,000
      emp({ id: "2", dailySalary: 150000, workingDays: 5, kasbon: 50000 }), // 700,000
      emp({ id: "3", dailySalary: 200000, workingDays: 6, lembur: 100000 }), // 1,300,000
    ];
    expect(grandTotal(list)).toBe(3000000);
  });

  it("returns 0 for an empty list", () => {
    expect(grandTotal([])).toBe(0);
  });
});

describe("totalKasbon", () => {
  it("sums only kasbon across employees, ignoring lembur", () => {
    const list = [
      emp({ id: "1", kasbon: 100000, lembur: 999999 }),
      emp({ id: "2", kasbon: 50000 }),
      emp({ id: "3" }), // no kasbon
    ];
    expect(totalKasbon(list)).toBe(150000);
  });
});

describe("totalLembur", () => {
  it("sums only lembur across employees, ignoring kasbon", () => {
    const list = [
      emp({ id: "1", lembur: 100000, kasbon: 999999 }),
      emp({ id: "2", lembur: 25000 }),
      emp({ id: "3" }), // no lembur
    ];
    expect(totalLembur(list)).toBe(125000);
  });
});

describe("totalWorkingDays", () => {
  it("sums working days across employees", () => {
    const list = [emp({ id: "1", workingDays: 10 }), emp({ id: "2", workingDays: 22 })];
    expect(totalWorkingDays(list)).toBe(32);
  });
});
