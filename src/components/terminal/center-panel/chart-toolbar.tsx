"use client";

import { useTerminalState } from "@/hooks/use-terminal-state";
import { Button } from "@/components/ui/button";
import type { ChartTimeframe } from "@/types";

const TIMEFRAMES: ChartTimeframe[] = ["1m", "5m", "15m", "1H", "4H", "1D"];

export function ChartToolbar() {
  const { selectedPair, chartTimeframe, setChartTimeframe } = useTerminalState();

  return (
    <div className="flex h-8 items-center justify-between border-b border-marex-border-subtle bg-marex-bg-elevated px-3">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-foreground">{selectedPair}</span>
        <span className="text-xs text-muted-foreground">Chart</span>
      </div>
      <div data-learn="chart-timeframe" className="flex items-center space-x-0.5">
        {TIMEFRAMES.map((tf) => (
          <Button
            key={tf}
            variant={chartTimeframe === tf ? "secondary" : "terminalGhost"}
            size="xs"
            onClick={() => setChartTimeframe(tf)}
            className="min-w-[32px]"
          >
            {tf}
          </Button>
        ))}
      </div>
    </div>
  );
}
