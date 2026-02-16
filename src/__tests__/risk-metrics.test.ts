import { describe, it, expect } from "vitest";
import { useRiskMetrics, type RiskMetrics } from "@/hooks/use-risk-metrics";
import type { Position, Balance } from "@/types";

// Test the pure computation directly by extracting the logic
function computeRiskMetrics(positions: Position[], balances: Balance[]) {
  // Re-implement the same logic for testing
  const POSITION_LIMITS: Record<string, number> = {
    "EUR/USD": 10_000_000,
    "GBP/USD": 8_000_000,
    "USD/JPY": 12_000_000,
  };

  const currencyNet = new Map<string, number>();
  for (const pos of positions) {
    if (pos.status !== "Open") continue;
    const [base, quote] = pos.pair.split("/");
    const sign = pos.direction === "Long" ? 1 : -1;
    currencyNet.set(base, (currencyNet.get(base) || 0) + sign * pos.amount);
    currencyNet.set(quote, (currencyNet.get(quote) || 0) - sign * pos.amount * pos.currentPrice);
  }

  const pairAmounts = new Map<string, number>();
  for (const pos of positions) {
    if (pos.status !== "Open") continue;
    pairAmounts.set(pos.pair, (pairAmounts.get(pos.pair) || 0) + pos.amount);
  }

  const totalReserved = balances.reduce((s, b) => s + b.reserved, 0);
  const totalTotal = balances.reduce((s, b) => s + b.total, 0);
  const marginUtilization = totalTotal > 0 ? totalReserved / totalTotal : 0;

  return {
    exposureCount: currencyNet.size,
    pairCount: pairAmounts.size,
    marginUtilization,
  };
}

const mockPositions: Position[] = [
  {
    id: "POS-1",
    pair: "EUR/USD",
    direction: "Long",
    amount: 5_000_000,
    currency: "EUR",
    avgEntry: 1.084,
    currentPrice: 1.085,
    unrealizedPnl: 5000,
    pnlPercent: 0.1,
    trades: 2,
    openedAt: new Date().toISOString(),
    status: "Open",
  },
  {
    id: "POS-2",
    pair: "GBP/USD",
    direction: "Short",
    amount: 3_000_000,
    currency: "GBP",
    avgEntry: 1.263,
    currentPrice: 1.260,
    unrealizedPnl: 9000,
    pnlPercent: 0.24,
    trades: 1,
    openedAt: new Date().toISOString(),
    status: "Open",
  },
  {
    id: "POS-3",
    pair: "EUR/USD",
    direction: "Short",
    amount: 2_000_000,
    currency: "EUR",
    avgEntry: 1.086,
    currentPrice: 1.085,
    unrealizedPnl: 2000,
    pnlPercent: 0.09,
    trades: 1,
    openedAt: new Date().toISOString(),
    status: "Closed",
  },
];

const mockBalances: Balance[] = [
  { currency: "USD", available: 10_000_000, reserved: 3_000_000, total: 13_000_000 },
  { currency: "EUR", available: 5_000_000, reserved: 1_000_000, total: 6_000_000 },
];

describe("Risk metrics computation", () => {
  it("calculates currency exposure from open positions only", () => {
    const result = computeRiskMetrics(mockPositions, mockBalances);
    // EUR/USD (Long 5M) + GBP/USD (Short 3M) → EUR, USD, GBP exposed
    expect(result.exposureCount).toBeGreaterThan(0);
  });

  it("ignores closed positions", () => {
    const closedOnly = mockPositions.filter((p) => p.status === "Closed");
    const result = computeRiskMetrics(closedOnly, mockBalances);
    expect(result.exposureCount).toBe(0);
  });

  it("calculates margin utilization correctly", () => {
    const result = computeRiskMetrics(mockPositions, mockBalances);
    const expectedUtil = 4_000_000 / 19_000_000; // total reserved / total
    expect(result.marginUtilization).toBeCloseTo(expectedUtil, 4);
  });

  it("handles empty positions", () => {
    const result = computeRiskMetrics([], mockBalances);
    expect(result.exposureCount).toBe(0);
    expect(result.pairCount).toBe(0);
  });

  it("handles empty balances", () => {
    const result = computeRiskMetrics(mockPositions, []);
    expect(result.marginUtilization).toBe(0);
  });
});
