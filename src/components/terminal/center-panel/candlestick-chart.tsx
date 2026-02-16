"use client";

import { useMemo } from "react";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { useCandlestickData } from "@/hooks/use-candlestick-data";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface CandleBar {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  body: [number, number];
  wick: [number, number];
  color: string;
}

export function CandlestickChart() {
  const { selectedPair, chartTimeframe } = useTerminalState();
  const candles = useCandlestickData(selectedPair, chartTimeframe);

  const chartData: CandleBar[] = useMemo(() => {
    return candles.map((c) => {
      const isUp = c.close >= c.open;
      return {
        time: new Date(c.timestamp).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: c.timestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        body: isUp ? [c.open, c.close] : [c.close, c.open],
        wick: [c.low, c.high],
        color: isUp ? "#22cc66" : "#ff4466",
      };
    });
  }, [candles]);

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;

  const domain = useMemo(() => {
    if (chartData.length === 0) return [0, 1];
    const lows = chartData.map((c) => c.low);
    const highs = chartData.map((c) => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [chartData]);

  const isJpy = selectedPair.includes("JPY");
  const decimals = isJpy ? 3 : 5;

  return (
    <div data-learn="candlestick-chart" className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333355" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#8888aa", fontSize: 10 }}
            tickLine={{ stroke: "#333355" }}
            axisLine={{ stroke: "#333355" }}
            interval={Math.floor(chartData.length / 8)}
          />
          <YAxis
            domain={domain}
            tick={{ fill: "#8888aa", fontSize: 10 }}
            tickLine={{ stroke: "#333355" }}
            axisLine={{ stroke: "#333355" }}
            tickFormatter={(v) => v.toFixed(decimals)}
            orientation="right"
            width={70}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#141428",
              border: "1px solid #333355",
              borderRadius: "0.375rem",
              fontSize: "11px",
            }}
            labelStyle={{ color: "#8888aa" }}
            itemStyle={{ color: "#e0e0f0" }}
            formatter={(value: number | number[]) => {
              if (Array.isArray(value)) return [value.map((v) => v.toFixed(decimals)).join(" – "), ""];
              return [typeof value === "number" ? value.toFixed(decimals) : value, ""];
            }}
          />
          {/* Candle wicks */}
          <Bar dataKey="wick" fill="transparent" stroke="#8888aa" strokeWidth={1} barSize={1} />
          {/* Candle bodies */}
          <Bar
            dataKey="body"
            barSize={6}
            shape={(props: unknown) => {
              const { x, y, width, height, payload } = props as {
                x: number;
                y: number;
                width: number;
                height: number;
                payload: CandleBar;
              };
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={Math.max(height, 1)}
                  fill={payload.color}
                  rx={0.5}
                />
              );
            }}
          />
          {/* Current price line */}
          {currentPrice > 0 && (
            <ReferenceLine
              y={currentPrice}
              stroke="#e91e8c"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
