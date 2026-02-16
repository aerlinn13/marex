"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FxRate } from "@/types";
import { getMockWebSocketEngine, type ConnectionEvent } from "@/lib/mock-websocket";

export function useMockWebSocket() {
  const [rates, setRates] = useState<Map<string, FxRate>>(new Map());
  const [connected, setConnected] = useState(false);
  const [latency, setLatency] = useState(0);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const engineRef = useRef(getMockWebSocketEngine());

  useEffect(() => {
    const engine = engineRef.current;
    engine.start();
    setConnected(true);

    // Initialize with current rates
    setRates(new Map(engine.getCurrentRates()));

    const unsubscribeRates = engine.subscribe((rate) => {
      setRates((prev) => {
        const next = new Map(prev);
        next.set(rate.symbol, rate);
        return next;
      });
      setLatency(engine.getLatency());
    });

    const unsubscribeConnection = engine.subscribeConnection((event: ConnectionEvent) => {
      switch (event.type) {
        case "connected":
          setConnected(true);
          setReconnecting(false);
          setReconnectAttempt(0);
          if (event.latencyMs) setLatency(event.latencyMs);
          break;
        case "disconnected":
          setConnected(false);
          setReconnecting(false);
          break;
        case "reconnecting":
          setReconnecting(true);
          if (event.attempt) setReconnectAttempt(event.attempt);
          break;
      }
    });

    return () => {
      unsubscribeRates();
      unsubscribeConnection();
    };
  }, []);

  const getHistory = useCallback((symbol: string) => {
    return engineRef.current.getHistory(symbol);
  }, []);

  return { rates, connected, latency, reconnecting, reconnectAttempt, getHistory };
}
