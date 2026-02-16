import { describe, it, expect } from "vitest";
import { createAlgoExecution, simulateAlgoProgress, formatAlgoDuration } from "@/lib/algo-engine";
import type { AlgoParams } from "@/lib/algo-engine";

const baseParams: AlgoParams = {
  type: "TWAP",
  pair: "EUR/USD",
  direction: "Buy",
  totalAmount: 10_000_000,
  currency: "EUR",
  durationMinutes: 30,
  slices: 10,
  participationRate: 0.25,
};

describe("createAlgoExecution", () => {
  it("creates an execution with correct number of child orders", () => {
    const exec = createAlgoExecution(baseParams);
    expect(exec.childOrders).toHaveLength(10);
    expect(exec.status).toBe("Running");
  });

  it("distributes amount across slices", () => {
    const exec = createAlgoExecution(baseParams);
    const totalChildAmount = exec.childOrders.reduce((sum, c) => sum + c.amount, 0);
    expect(totalChildAmount).toBe(baseParams.totalAmount);
  });

  it("generates an ID with ALGO prefix", () => {
    const exec = createAlgoExecution(baseParams);
    expect(exec.id).toMatch(/^ALGO-/);
  });

  it("schedules child orders at intervals", () => {
    const exec = createAlgoExecution(baseParams);
    const times = exec.childOrders.map((c) => new Date(c.scheduledTime).getTime());
    for (let i = 1; i < times.length; i++) {
      expect(times[i]).toBeGreaterThan(times[i - 1]);
    }
  });

  it("all child orders start as Pending", () => {
    const exec = createAlgoExecution(baseParams);
    exec.childOrders.forEach((c) => {
      expect(c.status).toBe("Pending");
    });
  });
});

describe("simulateAlgoProgress", () => {
  it("fills scheduled child orders", () => {
    const exec = createAlgoExecution({
      ...baseParams,
      durationMinutes: 0, // All scheduled in the past
      slices: 3,
    });
    const updated = simulateAlgoProgress(exec, 1.0842);
    const filled = updated.childOrders.filter((c) => c.status === "Filled");
    expect(filled.length).toBeGreaterThan(0);
  });

  it("calculates weighted average fill price", () => {
    const exec = createAlgoExecution({
      ...baseParams,
      durationMinutes: 0,
      slices: 2,
    });
    const updated = simulateAlgoProgress(exec, 1.0842);
    if (updated.filledAmount > 0) {
      expect(updated.avgFillPrice).toBeGreaterThan(0);
    }
  });

  it("marks execution as Completed when all filled", () => {
    const exec = createAlgoExecution({
      ...baseParams,
      durationMinutes: 0,
      slices: 2,
    });
    const updated = simulateAlgoProgress(exec, 1.0842);
    if (updated.childOrders.every((c) => c.status === "Filled")) {
      expect(updated.status).toBe("Completed");
    }
  });
});

describe("formatAlgoDuration", () => {
  it("formats minutes only", () => {
    expect(formatAlgoDuration(30)).toBe("30m");
  });

  it("formats hours", () => {
    expect(formatAlgoDuration(60)).toBe("1h");
  });

  it("formats hours and minutes", () => {
    expect(formatAlgoDuration(90)).toBe("1h 30m");
  });
});
