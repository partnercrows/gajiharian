import { describe, it, expect } from "vitest";
import { isNewer } from "./update-check";

describe("isNewer", () => {
  it("detects a newer patch version", () => {
    expect(isNewer("1.0.1", "1.0.0")).toBe(true);
  });

  it("detects a newer minor version", () => {
    expect(isNewer("1.1.0", "1.0.9")).toBe(true);
  });

  it("does not do naive string comparison -- 1.10.0 is newer than 1.9.0", () => {
    expect(isNewer("1.10.0", "1.9.0")).toBe(true);
  });

  it("returns false when versions are equal", () => {
    expect(isNewer("1.0.0", "1.0.0")).toBe(false);
  });

  it("returns false when latest is older than current", () => {
    expect(isNewer("1.0.0", "1.2.0")).toBe(false);
  });

  it("handles a leading 'v' prefix (GitHub tag format)", () => {
    expect(isNewer("v1.0.1", "1.0.0")).toBe(true);
    expect(isNewer("v1.0.0", "v1.0.0")).toBe(false);
  });

  it("handles differing segment counts", () => {
    expect(isNewer("1.0.0.1", "1.0.0")).toBe(true);
    expect(isNewer("1.0", "1.0.0")).toBe(false);
  });
});
