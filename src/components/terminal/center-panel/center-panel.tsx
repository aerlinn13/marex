"use client";

import { ChartToolbar } from "./chart-toolbar";
import { CandlestickChart } from "./candlestick-chart";

export function CenterPanel() {
  return (
    <div className="flex h-full flex-col border-r border-marex-border-subtle bg-marex-bg-panel">
      <ChartToolbar />
      <div className="flex-1 min-h-0">
        <CandlestickChart />
      </div>
    </div>
  );
}
