"use client";

import { useTerminalState } from "@/hooks/use-terminal-state";
import { Button } from "@/components/ui/button";
import type { ChartTimeframe } from "@/types";

const TIMEFRAMES: ChartTimeframe[] = ["1m", "5m", "15m", "1H", "4H", "1D"];

interface ChartToolbarProps {
  showSMA: boolean;
  showEMA: boolean;
  showBollinger: boolean;
  onToggleSMA: () => void;
  onToggleEMA: () => void;
  onToggleBollinger: () => void;
}

export function ChartToolbar({ showSMA, showEMA, showBollinger, onToggleSMA, onToggleEMA, onToggleBollinger }: ChartToolbarProps) {
  const { selectedPair, chartTimeframe, setChartTimeframe } = useTerminalState();

  return (
    <div className="flex h-8 items-center justify-between border-b border-marex-border-subtle bg-marex-bg-elevated px-3">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-foreground">{selectedPair}</span>
        <span className="text-xs text-muted-foreground">Chart</span>
        <div className="mx-1 h-3 w-px bg-marex-border-subtle" />
        <Button
          variant={showSMA ? "secondary" : "terminalGhost"}
          size="xs"
          onClick={onToggleSMA}
          className="min-w-[44px] text-[10px]"
          title="Simple Moving Average (20)"
          data-learn="sma-indicator"
        >
          <span className={showSMA ? "text-[#ffcc00]" : ""}>SMA</span>
        </Button>
        <Button
          variant={showEMA ? "secondary" : "terminalGhost"}
          size="xs"
          onClick={onToggleEMA}
          className="min-w-[44px] text-[10px]"
          title="Exponential Moving Average (10)"
          data-learn="ema-indicator"
        >
          <span className={showEMA ? "text-[#00ccff]" : ""}>EMA</span>
        </Button>
        <Button
          variant={showBollinger ? "secondary" : "terminalGhost"}
          size="xs"
          onClick={onToggleBollinger}
          className="min-w-[44px] text-[10px]"
          title="Bollinger Bands (20, 2)"
          data-learn="bollinger-bands"
        >
          <span className={showBollinger ? "text-[#9966ff]" : ""}>BB</span>
        </Button>
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
