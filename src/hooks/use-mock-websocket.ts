"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FxRate } from "@/types";
import { getMockWebSocketEngine } from "@/lib/mock-websocket";

export function useMockWebSocket() {
  const [rates, setRates] = useState<Map<string, FxRate>>(new Map());
  const [connected, setConnected] = useState(false);
  const engineRef = useRef(getMockWebSocketEngine());

  useEffect(() => {
    const engine = engineRef.current;
    engine.start();
    setConnected(true);

    // Initialize with current rates
    setRates(new Map(engine.getCurrentRates()));

    const unsubscribe = engine.subscribe((rate) => {
      setRates((prev) => {
        const next = new Map(prev);
        next.set(rate.symbol, rate);
        return next;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getHistory = useCallback((symbol: string) => {
    return engineRef.current.getHistory(symbol);
  }, []);

  return { rates, connected, getHistory };
}
