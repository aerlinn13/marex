import { FxRate, FxRateHistory } from "@/types";
import { CURRENCY_PAIRS } from "./currency-pairs";

type RateCallback = (rate: FxRate) => void;
type ConnectionCallback = (event: ConnectionEvent) => void;

export interface ConnectionEvent {
  type: "connected" | "disconnected" | "reconnecting";
  timestamp: number;
  attempt?: number;
  latencyMs?: number;
}

interface MockWebSocketEngine {
  subscribe: (callback: RateCallback) => () => void;
  subscribeConnection: (callback: ConnectionCallback) => () => void;
  getCurrentRates: () => Map<string, FxRate>;
  getHistory: (symbol: string) => number[];
  getLatency: () => number;
  isConnected: () => boolean;
  start: () => void;
  stop: () => void;
}

const HISTORY_SIZE = 50;
const DISCONNECT_CHANCE = 0.05; // 5% per check
const DISCONNECT_CHECK_INTERVAL = 30_000; // Every 30s

function createMockWebSocketEngine(): MockWebSocketEngine {
  const subscribers = new Set<RateCallback>();
  const connectionSubscribers = new Set<ConnectionCallback>();
  const currentRates = new Map<string, FxRate>();
  const rateHistory = new Map<string, number[]>();
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let disconnectCheckId: ReturnType<typeof setInterval> | null = null;
  let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let connected = false;
  let latencyMs = 8 + Math.floor(Math.random() * 15); // 8-22ms simulated
  let reconnectAttempt = 0;

  // Initialize rates
  for (const pair of CURRENCY_PAIRS) {
    const spread = pair.spreadPips * pair.pipSize;
    const mid = pair.baseRate;
    const rate: FxRate = {
      symbol: pair.symbol,
      bid: mid - spread / 2,
      ask: mid + spread / 2,
      mid,
      spread,
      change24h: 0,
      changePercent24h: 0,
      timestamp: Date.now(),
      direction: "unchanged",
    };
    currentRates.set(pair.symbol, rate);

    // Seed history with slight variations
    const history: number[] = [];
    let histMid = mid;
    for (let i = 0; i < HISTORY_SIZE; i++) {
      histMid += (Math.random() - 0.5) * pair.volatility * 2;
      history.push(histMid);
    }
    rateHistory.set(pair.symbol, history);
  }

  function notifyConnection(event: ConnectionEvent) {
    connectionSubscribers.forEach((cb) => cb(event));
  }

  function emitUpdate() {
    if (!connected) return;

    // Simulate slight latency variation
    latencyMs = Math.max(5, latencyMs + Math.floor((Math.random() - 0.5) * 4));

    const pair = CURRENCY_PAIRS[Math.floor(Math.random() * CURRENCY_PAIRS.length)];
    const prev = currentRates.get(pair.symbol)!;

    const movement = (Math.random() - 0.5) * pair.volatility * 2;
    const newMid = prev.mid + movement;
    const spread = pair.spreadPips * pair.pipSize;

    const change24h = newMid - pair.baseRate;
    const changePercent24h = (change24h / pair.baseRate) * 100;

    const rate: FxRate = {
      symbol: pair.symbol,
      bid: newMid - spread / 2,
      ask: newMid + spread / 2,
      mid: newMid,
      spread,
      change24h,
      changePercent24h,
      timestamp: Date.now(),
      direction: movement > 0 ? "up" : movement < 0 ? "down" : "unchanged",
    };

    currentRates.set(pair.symbol, rate);

    const history = rateHistory.get(pair.symbol) || [];
    history.push(newMid);
    if (history.length > HISTORY_SIZE) history.shift();
    rateHistory.set(pair.symbol, history);

    subscribers.forEach((cb) => cb(rate));
  }

  function simulateDisconnect() {
    if (!connected) return;
    connected = false;
    reconnectAttempt = 0;
    notifyConnection({ type: "disconnected", timestamp: Date.now() });
    scheduleReconnect();
  }

  function scheduleReconnect() {
    reconnectAttempt++;
    // Exponential backoff: 1s, 2s, 4s, capped at 8s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempt - 1), 8000);

    notifyConnection({
      type: "reconnecting",
      timestamp: Date.now(),
      attempt: reconnectAttempt,
    });

    reconnectTimeoutId = setTimeout(() => {
      // 80% chance of successful reconnect per attempt
      if (Math.random() < 0.8 || reconnectAttempt >= 3) {
        connected = true;
        reconnectAttempt = 0;
        latencyMs = 8 + Math.floor(Math.random() * 15);
        notifyConnection({
          type: "connected",
          timestamp: Date.now(),
          latencyMs,
        });
      } else {
        scheduleReconnect();
      }
    }, delay);
  }

  function startDisconnectChecker() {
    disconnectCheckId = setInterval(() => {
      if (connected && Math.random() < DISCONNECT_CHANCE) {
        simulateDisconnect();
      }
    }, DISCONNECT_CHECK_INTERVAL);
  }

  return {
    subscribe(callback: RateCallback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    subscribeConnection(callback: ConnectionCallback) {
      connectionSubscribers.add(callback);
      return () => {
        connectionSubscribers.delete(callback);
      };
    },

    getCurrentRates() {
      return currentRates;
    },

    getHistory(symbol: string) {
      return rateHistory.get(symbol) || [];
    },

    getLatency() {
      return latencyMs;
    },

    isConnected() {
      return connected;
    },

    start() {
      if (intervalId) return;
      connected = true;
      notifyConnection({ type: "connected", timestamp: Date.now(), latencyMs });

      const tick = () => {
        emitUpdate();
        const delay = 1000 + Math.random() * 1000;
        intervalId = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
      };
      tick();
      startDisconnectChecker();
    },

    stop() {
      if (intervalId) {
        clearTimeout(intervalId as unknown as number);
        intervalId = null;
      }
      if (disconnectCheckId) {
        clearInterval(disconnectCheckId);
        disconnectCheckId = null;
      }
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }
      connected = false;
    },
  };
}

// Singleton
let engine: MockWebSocketEngine | null = null;

export function getMockWebSocketEngine(): MockWebSocketEngine {
  if (!engine) {
    engine = createMockWebSocketEngine();
  }
  return engine;
}
