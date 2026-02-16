"use client";

import { useMemo } from "react";
import type { Position } from "@/types";

export interface PnlByPair {
  pair: string;
  unrealized: number;
  realized: number;
  total: number;
}

export interface EquityPoint {
  time: string;
  equity: number;
}

export interface PnlSummary {
  totalUnrealized: number;
  totalRealized: number;
  totalPnl: number;
  byPair: PnlByPair[];
  equityCurve: EquityPoint[];
}

export function usePnlTracker(positions: Position[]): PnlSummary {
  return useMemo(() => {
    // Aggregate by pair
    const pairMap = new Map<string, { unrealized: number; realized: number }>();

    for (const pos of positions) {
      const entry = pairMap.get(pos.pair) || { unrealized: 0, realized: 0 };
      if (pos.status === "Open") {
        entry.unrealized += pos.unrealizedPnl;
      } else {
        // Closed positions contribute to realized
        entry.realized += pos.unrealizedPnl;
      }
      pairMap.set(pos.pair, entry);
    }

    const byPair: PnlByPair[] = Array.from(pairMap.entries())
      .map(([pair, { unrealized, realized }]) => ({
        pair,
        unrealized,
        realized,
        total: unrealized + realized,
      }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

    const totalUnrealized = byPair.reduce((s, p) => s + p.unrealized, 0);
    const totalRealized = byPair.reduce((s, p) => s + p.realized, 0);
    const totalPnl = totalUnrealized + totalRealized;

    // Generate a simulated equity curve (mock intraday data)
    const now = new Date();
    const points = 24;
    const equityCurve: EquityPoint[] = [];
    let equity = 10_000_000; // Starting equity
    const step = totalPnl / points;

    for (let i = 0; i < points; i++) {
      const t = new Date(now.getTime() - (points - i) * 3600 * 1000);
      const noise = (Math.random() - 0.5) * Math.abs(totalPnl) * 0.3;
      equity += step + noise;
      equityCurve.push({
        time: t.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        equity: Number(equity.toFixed(2)),
      });
    }

    return { totalUnrealized, totalRealized, totalPnl, byPair, equityCurve };
  }, [positions]);
}
