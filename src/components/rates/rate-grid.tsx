"use client";

import { FxRate } from "@/types";
import { RateCard } from "./rate-card";

interface RateGridProps {
  rates: FxRate[];
  getHistory: (symbol: string) => number[];
}

export function RateGrid({ rates, getHistory }: RateGridProps) {
  if (rates.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No rates available. Waiting for connection...
      </p>
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-live="polite"
      aria-atomic="false"
    >
      {rates.map((rate) => (
        <RateCard key={rate.symbol} rate={rate} history={getHistory(rate.symbol)} />
      ))}
    </div>
  );
}
