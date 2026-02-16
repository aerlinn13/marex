"use client";

import { useMemo } from "react";
import type { Position, Balance } from "@/types";
import { POSITION_LIMITS } from "@/lib/mock-data";

export interface CurrencyExposure {
  currency: string;
  net: number;       // Positive = long, negative = short
  absNet: number;
}

export interface PairLimitUsage {
  pair: string;
  current: number;
  limit: number;
  utilization: number; // 0-1
}

export interface RiskItem {
  description: string;
  severity: "high" | "medium" | "low";
}

export interface RiskMetrics {
  exposures: CurrencyExposure[];
  pairLimits: PairLimitUsage[];
  marginUtilization: number;       // 0-1
  totalReserved: number;
  totalAvailable: number;
  topRisks: RiskItem[];
}

export function useRiskMetrics(positions: Position[], balances: Balance[]): RiskMetrics {
  return useMemo(() => {
    // 1. Net currency exposure
    const currencyNet = new Map<string, number>();
    for (const pos of positions) {
      if (pos.status !== "Open") continue;
      const [base, quote] = pos.pair.split("/");
      const sign = pos.direction === "Long" ? 1 : -1;
      currencyNet.set(base, (currencyNet.get(base) || 0) + sign * pos.amount);
      currencyNet.set(quote, (currencyNet.get(quote) || 0) - sign * pos.amount * pos.currentPrice);
    }
    const exposures: CurrencyExposure[] = Array.from(currencyNet.entries())
      .map(([currency, net]) => ({ currency, net, absNet: Math.abs(net) }))
      .sort((a, b) => b.absNet - a.absNet);

    // 2. Position limit utilization per pair
    const pairAmounts = new Map<string, number>();
    for (const pos of positions) {
      if (pos.status !== "Open") continue;
      pairAmounts.set(pos.pair, (pairAmounts.get(pos.pair) || 0) + pos.amount);
    }
    const pairLimits: PairLimitUsage[] = Array.from(pairAmounts.entries()).map(([pair, current]) => {
      const limit = POSITION_LIMITS[pair] || 10_000_000;
      return { pair, current, limit, utilization: Math.min(current / limit, 1) };
    }).sort((a, b) => b.utilization - a.utilization);

    // 3. Margin utilization
    const totalReserved = balances.reduce((s, b) => s + b.reserved, 0);
    const totalTotal = balances.reduce((s, b) => s + b.total, 0);
    const totalAvailable = balances.reduce((s, b) => s + b.available, 0);
    const marginUtilization = totalTotal > 0 ? totalReserved / totalTotal : 0;

    // 4. Top risk items
    const topRisks: RiskItem[] = [];

    // Check for high-utilization pairs
    for (const pl of pairLimits) {
      if (pl.utilization > 0.8) {
        topRisks.push({
          description: `${pl.pair} position at ${(pl.utilization * 100).toFixed(0)}% of limit`,
          severity: pl.utilization > 0.95 ? "high" : "medium",
        });
      }
    }

    // Check margin utilization
    if (marginUtilization > 0.7) {
      topRisks.push({
        description: `Margin utilization at ${(marginUtilization * 100).toFixed(0)}%`,
        severity: marginUtilization > 0.85 ? "high" : "medium",
      });
    }

    // Check for large single-currency exposure
    for (const exp of exposures.slice(0, 3)) {
      if (exp.absNet > 5_000_000) {
        topRisks.push({
          description: `${exp.currency} net exposure: ${(exp.net / 1_000_000).toFixed(1)}M`,
          severity: exp.absNet > 10_000_000 ? "high" : "medium",
        });
      }
    }

    // Ensure at least one item
    if (topRisks.length === 0) {
      topRisks.push({ description: "All risk metrics within limits", severity: "low" });
    }

    return {
      exposures,
      pairLimits,
      marginUtilization,
      totalReserved,
      totalAvailable,
      topRisks: topRisks.slice(0, 3),
    };
  }, [positions, balances]);
}
