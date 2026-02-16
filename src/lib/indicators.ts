import type { CandlestickData } from "@/types";

export interface SMAPoint {
  timestamp: number;
  value: number;
}

export interface EMAPoint {
  timestamp: number;
  value: number;
}

export interface BollingerBandsPoint {
  timestamp: number;
  upper: number;
  middle: number;
  lower: number;
}

/**
 * Simple Moving Average over `period` candles.
 * Returns one value per candle once enough data is available.
 */
export function computeSMA(candles: CandlestickData[], period: number): SMAPoint[] {
  if (candles.length < period) return [];
  const result: SMAPoint[] = [];
  let sum = 0;

  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) {
      sum -= candles[i - period].close;
    }
    if (i >= period - 1) {
      result.push({
        timestamp: candles[i].timestamp,
        value: sum / period,
      });
    }
  }

  return result;
}

/**
 * Exponential Moving Average over `period` candles.
 * Uses smoothing factor k = 2 / (period + 1).
 */
export function computeEMA(candles: CandlestickData[], period: number): EMAPoint[] {
  if (candles.length < period) return [];
  const k = 2 / (period + 1);
  const result: EMAPoint[] = [];

  // Seed with SMA of first `period` candles
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += candles[i].close;
  }
  let ema = sum / period;
  result.push({ timestamp: candles[period - 1].timestamp, value: ema });

  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
    result.push({ timestamp: candles[i].timestamp, value: ema });
  }

  return result;
}

/**
 * Bollinger Bands: SMA(period) ± stddev * multiplier.
 */
export function computeBollingerBands(
  candles: CandlestickData[],
  period: number = 20,
  multiplier: number = 2
): BollingerBandsPoint[] {
  if (candles.length < period) return [];
  const result: BollingerBandsPoint[] = [];

  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
    const mean = sum / period;

    let sqDiffSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = candles[j].close - mean;
      sqDiffSum += diff * diff;
    }
    const stddev = Math.sqrt(sqDiffSum / period);

    result.push({
      timestamp: candles[i].timestamp,
      upper: mean + multiplier * stddev,
      middle: mean,
      lower: mean - multiplier * stddev,
    });
  }

  return result;
}
