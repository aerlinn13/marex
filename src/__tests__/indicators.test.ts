import { describe, it, expect } from "vitest";
import { computeSMA, computeEMA, computeBollingerBands } from "@/lib/indicators";
import type { CandlestickData } from "@/types";

function makeCandles(closes: number[]): CandlestickData[] {
  return closes.map((close, i) => ({
    timestamp: 1000 + i * 1000,
    open: close - 0.0001,
    high: close + 0.001,
    low: close - 0.001,
    close,
    volume: 100,
  }));
}

describe("computeSMA", () => {
  it("returns empty array if fewer candles than period", () => {
    const candles = makeCandles([1.1, 1.2]);
    expect(computeSMA(candles, 5)).toEqual([]);
  });

  it("computes correct SMA for a simple series", () => {
    const candles = makeCandles([1, 2, 3, 4, 5]);
    const sma = computeSMA(candles, 3);
    expect(sma).toHaveLength(3); // 5 - 3 + 1
    expect(sma[0].value).toBeCloseTo(2); // (1+2+3)/3
    expect(sma[1].value).toBeCloseTo(3); // (2+3+4)/3
    expect(sma[2].value).toBeCloseTo(4); // (3+4+5)/3
  });

  it("preserves timestamps", () => {
    const candles = makeCandles([10, 20, 30, 40]);
    const sma = computeSMA(candles, 2);
    expect(sma[0].timestamp).toBe(candles[1].timestamp);
    expect(sma[2].timestamp).toBe(candles[3].timestamp);
  });
});

describe("computeEMA", () => {
  it("returns empty array if fewer candles than period", () => {
    const candles = makeCandles([1.1]);
    expect(computeEMA(candles, 5)).toEqual([]);
  });

  it("first EMA point equals SMA of first period candles", () => {
    const candles = makeCandles([2, 4, 6, 8, 10]);
    const ema = computeEMA(candles, 3);
    expect(ema[0].value).toBeCloseTo(4); // (2+4+6)/3 = 4
  });

  it("EMA responds to price changes", () => {
    const candles = makeCandles([1, 1, 1, 1, 1, 10]); // Sudden spike
    const ema = computeEMA(candles, 3);
    const lastEma = ema[ema.length - 1].value;
    expect(lastEma).toBeGreaterThan(1);
    expect(lastEma).toBeLessThan(10);
  });
});

describe("computeBollingerBands", () => {
  it("returns empty if not enough data", () => {
    const candles = makeCandles([1, 2]);
    expect(computeBollingerBands(candles, 5, 2)).toEqual([]);
  });

  it("middle band equals SMA", () => {
    const candles = makeCandles([1, 2, 3, 4, 5]);
    const bb = computeBollingerBands(candles, 3, 2);
    const sma = computeSMA(candles, 3);
    for (let i = 0; i < bb.length; i++) {
      expect(bb[i].middle).toBeCloseTo(sma[i].value, 5);
    }
  });

  it("upper band is above middle, lower is below", () => {
    const candles = makeCandles([1, 3, 2, 4, 3, 5, 4]);
    const bb = computeBollingerBands(candles, 3, 2);
    for (const point of bb) {
      expect(point.upper).toBeGreaterThanOrEqual(point.middle);
      expect(point.lower).toBeLessThanOrEqual(point.middle);
    }
  });

  it("bands are symmetric around middle", () => {
    const candles = makeCandles([1, 2, 3, 4, 5, 6, 7]);
    const bb = computeBollingerBands(candles, 3, 2);
    for (const point of bb) {
      const upperDist = point.upper - point.middle;
      const lowerDist = point.middle - point.lower;
      expect(upperDist).toBeCloseTo(lowerDist, 10);
    }
  });
});
