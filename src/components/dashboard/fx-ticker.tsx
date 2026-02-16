"use client";

import { useFxRates } from "@/hooks/use-fx-rates";
import { formatRate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/components/shared/connection-status";

export function FxTicker() {
  const { rates, connected } = useFxRates("All");

  return (
    <section aria-label="Live FX rates ticker">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-muted-foreground">Live FX Rates</h2>
        <ConnectionStatus connected={connected} />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <div
          className="flex animate-ticker-scroll motion-reduce:animate-none"
          aria-live="polite"
          aria-atomic="false"
        >
          {/* Duplicate for seamless loop */}
          {[...rates, ...rates].map((rate, i) => (
            <div
              key={`${rate.symbol}-${i}`}
              className={cn(
                "flex shrink-0 items-center space-x-3 border-r px-4 py-3 transition-colors",
                rate.direction === "up" && "bg-green-500/10",
                rate.direction === "down" && "bg-red-500/10"
              )}
            >
              <span className="text-sm font-semibold text-foreground">
                {rate.symbol}
              </span>
              <span className="text-sm font-mono">
                {formatRate(rate.bid, rate.symbol)}
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-sm font-mono">
                {formatRate(rate.ask, rate.symbol)}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  rate.change24h >= 0 ? "text-green-400" : "text-red-400"
                )}
              >
                {rate.change24h >= 0 ? "+" : ""}
                {rate.changePercent24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
