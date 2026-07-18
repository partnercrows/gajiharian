import { describe, it, expect } from "vitest";
import { formatRupiah, formatNumber, formatDateID, generateInvoiceNumber } from "./format";

// Intl.NumberFormat("id-ID", { style: "currency" }) inserts a NON-BREAKING
// SPACE (U+00A0) between "Rp" and the digits, not a regular space — using a
// plain space in the expected string here would silently never match.
const NBSP = " ";

describe("formatRupiah", () => {
  it("formats a positive integer as Indonesian Rupiah", () => {
    expect(formatRupiah(1500000)).toBe(`Rp${NBSP}1.500.000`);
  });

  it("formats zero", () => {
    expect(formatRupiah(0)).toBe(`Rp${NBSP}0`);
  });

  it("formats negative numbers (e.g. kasbon exceeding earnings)", () => {
    expect(formatRupiah(-150000)).toBe(`-Rp${NBSP}150.000`);
  });

  it("falls back to Rp 0 for non-finite input instead of throwing", () => {
    expect(formatRupiah(NaN)).toBe("Rp 0");
    expect(formatRupiah(Infinity)).toBe("Rp 0");
  });
});

describe("formatNumber", () => {
  it("formats with Indonesian thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1.234.567");
  });
});

describe("formatDateID", () => {
  it("formats an ISO date string into Indonesian long-form date", () => {
    expect(formatDateID("2026-07-18")).toBe("18 Juli 2026");
  });

  it("returns a dash for empty input", () => {
    expect(formatDateID("")).toBe("-");
  });

  it("returns the raw input instead of throwing on invalid date strings", () => {
    expect(formatDateID("not-a-date")).toBe("not-a-date");
  });
});

describe("generateInvoiceNumber", () => {
  it("matches the INV/GH/yyyymmdd/nnnn pattern", () => {
    expect(generateInvoiceNumber()).toMatch(/^INV\/GH\/\d{8}\/\d{4}$/);
  });
});
