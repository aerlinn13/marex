import { CurrencyPair } from "@/types";

export const CURRENCY_PAIRS: CurrencyPair[] = [
  // G10 pairs
  { symbol: "EUR/USD", base: "EUR", quote: "USD", category: "G10", baseRate: 1.0842, pipSize: 0.0001, spreadPips: 1.2, volatility: 0.0003 },
  { symbol: "GBP/USD", base: "GBP", quote: "USD", category: "G10", baseRate: 1.2631, pipSize: 0.0001, spreadPips: 1.5, volatility: 0.0004 },
  { symbol: "USD/JPY", base: "USD", quote: "JPY", category: "G10", baseRate: 149.52, pipSize: 0.01, spreadPips: 1.3, volatility: 0.05 },
  { symbol: "USD/CHF", base: "USD", quote: "CHF", category: "G10", baseRate: 0.8765, pipSize: 0.0001, spreadPips: 1.4, volatility: 0.0003 },
  { symbol: "AUD/USD", base: "AUD", quote: "USD", category: "G10", baseRate: 0.6543, pipSize: 0.0001, spreadPips: 1.6, volatility: 0.0004 },
  { symbol: "USD/CAD", base: "USD", quote: "CAD", category: "G10", baseRate: 1.3587, pipSize: 0.0001, spreadPips: 1.5, volatility: 0.0003 },
  { symbol: "NZD/USD", base: "NZD", quote: "USD", category: "G10", baseRate: 0.6098, pipSize: 0.0001, spreadPips: 1.8, volatility: 0.0005 },
  { symbol: "EUR/GBP", base: "EUR", quote: "GBP", category: "G10", baseRate: 0.8584, pipSize: 0.0001, spreadPips: 1.3, volatility: 0.0003 },
  // Emerging Market pairs
  { symbol: "USD/MXN", base: "USD", quote: "MXN", category: "EM", baseRate: 17.15, pipSize: 0.001, spreadPips: 30, volatility: 0.02 },
  { symbol: "USD/ZAR", base: "USD", quote: "ZAR", category: "EM", baseRate: 18.45, pipSize: 0.001, spreadPips: 50, volatility: 0.03 },
  { symbol: "USD/TRY", base: "USD", quote: "TRY", category: "EM", baseRate: 32.18, pipSize: 0.001, spreadPips: 80, volatility: 0.05 },
  { symbol: "USD/NGN", base: "USD", quote: "NGN", category: "EM", baseRate: 1520.0, pipSize: 0.1, spreadPips: 200, volatility: 2.0 },
  { symbol: "USD/BRL", base: "USD", quote: "BRL", category: "EM", baseRate: 4.97, pipSize: 0.0001, spreadPips: 25, volatility: 0.005 },
];

export const CURRENCY_PAIR_MAP = new Map(
  CURRENCY_PAIRS.map((pair) => [pair.symbol, pair])
);

export function getCurrencyPairSymbols(): string[] {
  return CURRENCY_PAIRS.map((p) => p.symbol);
}

export function getG10Pairs(): CurrencyPair[] {
  return CURRENCY_PAIRS.filter((p) => p.category === "G10");
}

export function getEMPairs(): CurrencyPair[] {
  return CURRENCY_PAIRS.filter((p) => p.category === "EM");
}
