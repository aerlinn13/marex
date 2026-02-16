import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCompactCurrency,
  formatRate,
  formatNumber,
  formatPercentChange,
  formatSpread,
} from "@/lib/formatters";

describe("formatCurrency", () => {
  it("formats USD amounts without decimals", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-5000)).toBe("-$5,000");
  });
});

describe("formatCompactCurrency", () => {
  it("formats millions with M suffix", () => {
    const result = formatCompactCurrency(1200000);
    expect(result).toContain("1.2");
    expect(result).toContain("M");
  });

  it("formats thousands with K suffix", () => {
    const result = formatCompactCurrency(50000);
    expect(result).toContain("50");
    expect(result).toContain("K");
  });
});

describe("formatRate", () => {
  it("formats G10 pairs to 4 decimal places", () => {
    expect(formatRate(1.0842, "EUR/USD")).toBe("1.0842");
  });

  it("formats JPY pairs to 2 decimal places", () => {
    expect(formatRate(149.523, "USD/JPY")).toBe("149.52");
  });

  it("formats EM pairs to 4 decimal places", () => {
    expect(formatRate(17.1534, "USD/MXN")).toBe("17.1534");
  });
});

describe("formatNumber", () => {
  it("formats with default 2 decimals", () => {
    expect(formatNumber(1234.5)).toBe("1,234.50");
  });

  it("formats with custom decimals", () => {
    expect(formatNumber(1234.5678, 4)).toBe("1,234.5678");
  });
});

describe("formatPercentChange", () => {
  it("adds + sign for positive values", () => {
    expect(formatPercentChange(0.15)).toBe("+0.15%");
  });

  it("includes - sign for negative values", () => {
    expect(formatPercentChange(-0.23)).toBe("-0.23%");
  });

  it("adds + sign for zero", () => {
    expect(formatPercentChange(0)).toBe("+0.00%");
  });
});

describe("formatSpread", () => {
  it("formats spread for standard pairs in pips", () => {
    expect(formatSpread(0.00012, "EUR/USD")).toBe("1.2");
  });

  it("formats spread for JPY pairs in pips", () => {
    expect(formatSpread(0.013, "USD/JPY")).toBe("1.3");
  });
});
