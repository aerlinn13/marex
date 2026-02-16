"use client";

import { useRef, useEffect, useState } from "react";
import { useFxRates } from "@/hooks/use-fx-rates";
import { PriceDisplay } from "../shared/price-display";
import { formatFxAmount, formatSpread } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface EspTileProps {
  pair: string;
  amount: number;
  currency: string;
  onSelectPair?: (pair: string) => void;
}

export function EspTile({ pair, amount, currency, onSelectPair }: EspTileProps) {
  const { ratesMap } = useFxRates("All");
  const rate = ratesMap.get(pair);
  const prevDirectionRef = useRef<string>("unchanged");
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  const rateDirection = rate?.direction;
  const rateTimestamp = rate?.timestamp;

  useEffect(() => {
    if (rateDirection && rateDirection !== "unchanged" && rateDirection !== prevDirectionRef.current) {
      setFlash(rateDirection);
      const timer = setTimeout(() => setFlash(null), 500);
      prevDirectionRef.current = rateDirection;
      return () => clearTimeout(timer);
    }
  }, [rateDirection, rateTimestamp]);

  if (!rate) {
    return (
      <div className="rounded border border-marex-border-subtle bg-marex-bg-card p-3">
        <span className="text-xs text-muted-foreground">Loading {pair}...</span>
      </div>
    );
  }

  return (
    <div
      data-learn="esp-tile"
      className={cn(
        "rounded border border-marex-border-subtle bg-marex-bg-card transition-colors cursor-pointer",
        flash === "up" && "animate-price-flash-up",
        flash === "down" && "animate-price-flash-down"
      )}
      onClick={() => onSelectPair?.(pair)}
    >
      {/* Pair + Amount header */}
      <div className="flex items-center justify-between border-b border-marex-border-subtle px-3 py-1.5">
        <span className="text-xs font-semibold text-foreground">{pair}</span>
        <span className="rounded bg-marex-bg-elevated px-1.5 py-0.5 text-xs text-muted-foreground">
          {formatFxAmount(amount)} {currency}
        </span>
      </div>

      {/* SELL / BUY prices */}
      <div className="grid grid-cols-2 gap-px bg-marex-border-subtle">
        <button data-learn="esp-sell-button" className="flex flex-col items-center bg-marex-sell/10 px-2 py-2 transition-colors hover:bg-marex-sell/20">
          <span className="text-[11px] uppercase tracking-wider text-marex-sell/70">Sell</span>
          <PriceDisplay rate={rate.bid} pair={pair} size="md" className="text-marex-sell" />
        </button>
        <button data-learn="esp-buy-button" className="flex flex-col items-center bg-marex-buy/10 px-2 py-2 transition-colors hover:bg-marex-buy/20">
          <span className="text-[11px] uppercase tracking-wider text-marex-buy/70">Buy</span>
          <PriceDisplay rate={rate.ask} pair={pair} size="md" className="text-marex-buy" />
        </button>
      </div>

      {/* Spread */}
      <div data-learn="spread-display" className="px-3 py-1 text-center">
        <span className="text-xs text-muted-foreground">
          Spread: {formatSpread(rate.spread, pair)} pips
        </span>
      </div>
    </div>
  );
}
