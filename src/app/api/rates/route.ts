import { NextResponse } from "next/server";
import { CURRENCY_PAIRS } from "@/lib/currency-pairs";

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

  const rates = CURRENCY_PAIRS.map((pair) => {
    const movement = (Math.random() - 0.5) * pair.volatility * 2;
    const mid = pair.baseRate + movement;
    const spread = pair.spreadPips * pair.pipSize;

    return {
      symbol: pair.symbol,
      bid: mid - spread / 2,
      ask: mid + spread / 2,
      mid,
      spread,
      change24h: movement,
      changePercent24h: (movement / pair.baseRate) * 100,
      timestamp: Date.now(),
    };
  });

  return NextResponse.json({ rates }, { status: 200 });
}
