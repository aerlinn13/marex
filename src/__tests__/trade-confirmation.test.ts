import { describe, it, expect } from "vitest";
import { computePipDistance } from "@/components/terminal/right-panel/trade-confirmation-dialog";

describe("computePipDistance", () => {
  it("computes pip distance for standard pairs", () => {
    // 10 pips = 0.001 for non-JPY
    const dist = computePipDistance(1.0850, 1.0840, "EUR/USD");
    expect(dist).toBeCloseTo(10, 1);
  });

  it("computes pip distance for JPY pairs", () => {
    // 10 pips = 0.1 for JPY
    const dist = computePipDistance(149.60, 149.50, "USD/JPY");
    expect(dist).toBeCloseTo(10, 1);
  });

  it("returns 0 when order price matches market", () => {
    const dist = computePipDistance(1.0842, 1.0842, "EUR/USD");
    expect(dist).toBeCloseTo(0, 10);
  });

  it("handles large distances", () => {
    const dist = computePipDistance(1.10, 1.08, "EUR/USD");
    expect(dist).toBeCloseTo(200, 1);
  });

  it("is always positive regardless of direction", () => {
    const dist1 = computePipDistance(1.08, 1.09, "EUR/USD");
    const dist2 = computePipDistance(1.09, 1.08, "EUR/USD");
    expect(dist1).toBeGreaterThan(0);
    expect(dist2).toBeGreaterThan(0);
    expect(dist1).toBeCloseTo(dist2, 5);
  });
});
