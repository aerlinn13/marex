"use client";

import { useMemo } from "react";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { useFxRates } from "@/hooks/use-fx-rates";
import { generateLadderLevels } from "@/lib/mock-data";
import { formatRate, formatFxAmount } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { PanelHeader } from "../shared/panel-header";

export function PriceLadder() {
  const { selectedPair } = useTerminalState();
  const { ratesMap } = useFxRates("All");
  const rate = ratesMap.get(selectedPair);

  const levels = useMemo(() => generateLadderLevels(selectedPair), [selectedPair]);

  return (
    <div data-learn="price-ladder" className="flex flex-col h-full">
      <PanelHeader title={`Depth: ${selectedPair}`} />
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
              <th className="px-2 py-1 text-right">Bid Amt</th>
              <th className="px-2 py-1 text-center">Price</th>
              <th className="px-2 py-1 text-left">Ask Amt</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level, i) => {
              const isMid = rate && Math.abs(level.price - rate.mid) < 0.00005;
              return (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-marex-border-subtle/50 transition-colors hover:bg-marex-bg-hover",
                    isMid && "bg-marex-accent-purple/10"
                  )}
                >
                  <td className="px-2 py-0.5 text-right font-mono">
                    {level.bidAmount > 0 && (
                      <span className="text-marex-sell">{formatFxAmount(level.bidAmount)}</span>
                    )}
                  </td>
                  <td className={cn("px-2 py-0.5 text-center font-mono font-medium", isMid && "text-marex-accent-purple")}>
                    {formatRate(level.price, selectedPair)}
                  </td>
                  <td className="px-2 py-0.5 text-left font-mono">
                    {level.askAmount > 0 && (
                      <span className="text-marex-buy">{formatFxAmount(level.askAmount)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
