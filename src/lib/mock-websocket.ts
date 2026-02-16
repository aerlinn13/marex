import { FxRate, FxRateHistory } from "@/types";
import { CURRENCY_PAIRS } from "./currency-pairs";

type RateCallback = (rate: FxRate) => void;

interface MockWebSocketEngine {
  subscribe: (callback: RateCallback) => () => void;
  getCurrentRates: () => Map<string, FxRate>;
  getHistory: (symbol: string) => number[];
  start: () => void;
  stop: () => void;
}

const HISTORY_SIZE = 50;

function createMockWebSocketEngine(): MockWebSocketEngine {
  const subscribers = new Set<RateCallback>();
  const currentRates = new Map<string, FxRate>();
  const rateHistory = new Map<string, number[]>();
  let intervalId: ReturnType<typeof setInterval> | null = null;

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

  function emitUpdate() {
    // Pick a random pair to update
    const pair = CURRENCY_PAIRS[Math.floor(Math.random() * CURRENCY_PAIRS.length)];
    const prev = currentRates.get(pair.symbol)!;

    // Random walk
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

    // Update history
    const history = rateHistory.get(pair.symbol) || [];
    history.push(newMid);
    if (history.length > HISTORY_SIZE) history.shift();
    rateHistory.set(pair.symbol, history);

    // Notify subscribers
    subscribers.forEach((cb) => {
      cb(rate);
    });
  }

  return {
    subscribe(callback: RateCallback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    getCurrentRates() {
      return currentRates;
    },

    getHistory(symbol: string) {
      return rateHistory.get(symbol) || [];
    },

    start() {
      if (intervalId) return;
      // Emit updates every 1-2 seconds (random interval for realism)
      const tick = () => {
        emitUpdate();
        const delay = 1000 + Math.random() * 1000;
        intervalId = setTimeout(tick, delay) as unknown as ReturnType<typeof setInterval>;
      };
      tick();
    },

    stop() {
      if (intervalId) {
        clearTimeout(intervalId as unknown as number);
        intervalId = null;
      }
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
