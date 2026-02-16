"use client";

import { useState, useCallback } from "react";
import { ChartToolbar } from "./chart-toolbar";
import { CandlestickChart } from "./candlestick-chart";

export function CenterPanel() {
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);

  return (
    <div className="flex h-full flex-col border-r border-marex-border-subtle bg-marex-bg-panel">
      <ChartToolbar
        showSMA={showSMA}
        showEMA={showEMA}
        showBollinger={showBollinger}
        onToggleSMA={useCallback(() => setShowSMA((v) => !v), [])}
        onToggleEMA={useCallback(() => setShowEMA((v) => !v), [])}
        onToggleBollinger={useCallback(() => setShowBollinger((v) => !v), [])}
      />
      <div className="flex-1 min-h-0">
        <CandlestickChart showSMA={showSMA} showEMA={showEMA} showBollinger={showBollinger} />
      </div>
    </div>
  );
}
