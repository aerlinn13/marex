"use client";

import { useFxRates } from "@/hooks/use-fx-rates";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { formatRate, formatPercentChange } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function WatchlistTable() {
  const { rates } = useFxRates("All");
  const { selectedPair, setSelectedPair } = useTerminalState();

  return (
    <div data-learn="watchlist" className="overflow-auto" role="table" aria-label="FX Watchlist">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
            <th className="px-3 py-1.5 text-left">Currency</th>
            <th className="px-3 py-1.5 text-right">Bid</th>
            <th className="px-3 py-1.5 text-right">Offer</th>
            <th className="px-3 py-1.5 text-right">Change</th>
            <th className="px-3 py-1.5 text-right">%Change</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr
              key={rate.symbol}
              role="row"
              className={cn(
                "border-b border-marex-border-subtle/50 cursor-pointer transition-colors hover:bg-marex-bg-hover",
                selectedPair === rate.symbol && "bg-marex-tabActive"
              )}
              onClick={() => setSelectedPair(rate.symbol)}
            >
              <td className="px-3 py-1.5 font-semibold text-foreground">{rate.symbol}</td>
              <td className="px-3 py-1.5 text-right font-mono">{formatRate(rate.bid, rate.symbol)}</td>
              <td className="px-3 py-1.5 text-right font-mono">{formatRate(rate.ask, rate.symbol)}</td>
              <td
                className={cn(
                  "px-3 py-1.5 text-right font-mono",
                  rate.change24h >= 0 ? "text-marex-positive" : "text-marex-sell"
                )}
              >
                {rate.change24h >= 0 ? "+" : ""}
                {rate.change24h.toFixed(4)}
              </td>
              <td
                className={cn(
                  "px-3 py-1.5 text-right font-mono",
                  rate.change24h >= 0 ? "text-marex-positive" : "text-marex-sell"
                )}
              >
                {formatPercentChange(rate.changePercent24h)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
