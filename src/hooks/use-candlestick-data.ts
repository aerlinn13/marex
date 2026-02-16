"use client";

import { useState, useEffect, useRef } from "react";
import type { CandlestickData, ChartTimeframe } from "@/types";
import { generateCandlestickData } from "@/lib/mock-data";
import { getMockWebSocketEngine } from "@/lib/mock-websocket";

const TIMEFRAME_MS: Record<ChartTimeframe, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "15m": 900_000,
  "1H": 3_600_000,
  "4H": 14_400_000,
  "1D": 86_400_000,
};

export function useCandlestickData(pair: string, timeframe: ChartTimeframe) {
  const [candles, setCandles] = useState<CandlestickData[]>(() =>
    generateCandlestickData(pair, timeframe, 60)
  );
  const engineRef = useRef(getMockWebSocketEngine());

  useEffect(() => {
    setCandles(generateCandlestickData(pair, timeframe, 60));
  }, [pair, timeframe]);

  useEffect(() => {
    const engine = engineRef.current;
    const intervalMs = TIMEFRAME_MS[timeframe];

    const unsubscribe = engine.subscribe((rate) => {
      if (rate.symbol !== pair) return;

      setCandles((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (!last) return prev;

        const now = Date.now();
        const candleStart = last.timestamp;

        if (now - candleStart < intervalMs) {
          // Update current candle
          const newLast = {
            ...last,
            close: rate.mid,
            high: Math.max(last.high, rate.mid),
            low: Math.min(last.low, rate.mid),
            volume: last.volume + Math.floor(Math.random() * 100),
          };
          updated[updated.length - 1] = newLast;
        } else {
          // Start new candle
          updated.push({
            timestamp: now,
            open: rate.mid,
            high: rate.mid,
            low: rate.mid,
            close: rate.mid,
            volume: Math.floor(Math.random() * 500),
          });
          if (updated.length > 100) updated.shift();
        }
        return updated;
      });
    });

    return unsubscribe;
  }, [pair, timeframe]);

  return candles;
}
