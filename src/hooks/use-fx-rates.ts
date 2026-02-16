"use client";

import { useMemo } from "react";
import { useMockWebSocket } from "./use-mock-websocket";
import { CURRENCY_PAIRS } from "@/lib/currency-pairs";
import { FxRate, CurrencyPairCategory } from "@/types";

export function useFxRates(category?: CurrencyPairCategory | "All") {
  const { rates, connected, latency, reconnecting, reconnectAttempt, getHistory } = useMockWebSocket();

  const filteredRates = useMemo(() => {
    const filtered: FxRate[] = [];
    for (const pair of CURRENCY_PAIRS) {
      if (category && category !== "All" && pair.category !== category) continue;
      const rate = rates.get(pair.symbol);
      if (rate) filtered.push(rate);
    }
    return filtered;
  }, [rates, category]);

  return { rates: filteredRates, ratesMap: rates, connected, latency, reconnecting, reconnectAttempt, getHistory };
}
