"use client";

import { FxRate } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatRate, formatPercentChange, formatSpread } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SparklineChart } from "./sparkline-chart";

interface RateCardProps {
  rate: FxRate;
  history: number[];
}

export function RateCard({ rate, history }: RateCardProps) {
  return (
    <Card
      className={cn(
        "transition-all border-2",
        rate.direction === "up" && "animate-flash-green",
        rate.direction === "down" && "animate-flash-red",
        rate.direction === "unchanged" && "border-transparent"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{rate.symbol}</h3>
            <div className="flex items-center space-x-1 mt-1">
              {rate.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" aria-hidden="true" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  rate.change24h >= 0 ? "text-green-400" : "text-red-400"
                )}
              >
                {formatPercentChange(rate.changePercent24h)}
              </span>
            </div>
          </div>
          <div className="h-8 w-20">
            <SparklineChart
              data={history}
              color={rate.change24h >= 0 ? "#22cc66" : "#ff4466"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Bid</p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {formatRate(rate.bid, rate.symbol)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-muted-foreground">Ask</p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {formatRate(rate.ask, rate.symbol)}
            </p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Spread: {formatSpread(rate.spread, rate.symbol)} pips</span>
          <span>
            {new Date(rate.timestamp).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
