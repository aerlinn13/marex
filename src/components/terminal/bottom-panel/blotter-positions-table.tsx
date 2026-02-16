"use client";

import { useState } from "react";
import type { Position } from "@/types";
import { usePositions } from "@/hooks/use-positions";
import { formatRate, formatFxAmount, formatDateTime } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PositionDetailModal } from "./position-detail-modal";

interface BlotterPositionsTableProps {
  filterText: string;
}

function positionStatusVariant(status: string) {
  switch (status) {
    case "Open":
      return "active" as const;
    case "Closed":
      return "cancelled" as const;
    default:
      return "secondary" as const;
  }
}

export function BlotterPositionsTable({ filterText }: BlotterPositionsTableProps) {
  const { positions, closePosition } = usePositions();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = positions.filter((p) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      p.id.toLowerCase().includes(search) ||
      p.pair.toLowerCase().includes(search) ||
      p.status.toLowerCase().includes(search) ||
      p.direction.toLowerCase().includes(search)
    );
  });

  return (
    <div data-learn="blotter-positions" className="overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
            <th className="px-3 py-1 text-left">Pair</th>
            <th className="px-3 py-1 text-left">Dir</th>
            <th className="px-3 py-1 text-right">Amount</th>
            <th className="px-3 py-1 text-right">Avg Entry</th>
            <th className="px-3 py-1 text-right">Current</th>
            <th className="px-3 py-1 text-right">PnL</th>
            <th className="px-3 py-1 text-right">PnL%</th>
            <th className="px-3 py-1 text-right">Trades</th>
            <th className="px-3 py-1 text-left">Opened</th>
            <th className="px-3 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => {
            const isProfit = p.unrealizedPnl >= 0;
            return (
              <tr
                key={p.id}
                className="cursor-pointer border-b border-marex-border-subtle/50 transition-colors hover:bg-marex-bg-hover"
                onClick={() => {
                  setSelectedPosition(p);
                  setModalOpen(true);
                }}
              >
                <td className="px-3 py-1 font-semibold">{p.pair}</td>
                <td className={cn("px-3 py-1 font-medium", p.direction === "Long" ? "text-marex-buy" : "text-marex-sell")}>
                  {p.direction}
                </td>
                <td className="px-3 py-1 text-right font-mono">{formatFxAmount(p.amount)}</td>
                <td className="px-3 py-1 text-right font-mono">{formatRate(p.avgEntry, p.pair)}</td>
                <td className="px-3 py-1 text-right font-mono">{formatRate(p.currentPrice, p.pair)}</td>
                <td className={cn("px-3 py-1 text-right font-mono", isProfit ? "text-marex-positive" : "text-marex-sell")}>
                  {isProfit ? "+" : ""}
                  {p.unrealizedPnl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className={cn("px-3 py-1 text-right font-mono", isProfit ? "text-marex-positive" : "text-marex-sell")}>
                  {isProfit ? "+" : ""}{p.pnlPercent.toFixed(2)}%
                </td>
                <td className="px-3 py-1 text-right font-mono">{p.trades}</td>
                <td className="px-3 py-1 text-muted-foreground">{formatDateTime(p.openedAt)}</td>
                <td className="px-3 py-1">
                  <Badge variant={positionStatusVariant(p.status)} className="text-xs px-1.5 py-0">
                    {p.status}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <PositionDetailModal
        position={selectedPosition}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onClosePosition={closePosition}
      />
    </div>
  );
}
