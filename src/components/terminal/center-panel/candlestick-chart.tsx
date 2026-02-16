"use client";

import { useMemo } from "react";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { useCandlestickData } from "@/hooks/use-candlestick-data";
import { computeSMA, computeEMA, computeBollingerBands } from "@/lib/indicators";
import {
  ComposedChart,
  Bar,
  Line,
  Area,
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
  sma20?: number;
  ema10?: number;
  bbUpper?: number;
  bbLower?: number;
  bbBand?: [number, number];
}

interface CandlestickChartProps {
  showSMA?: boolean;
  showEMA?: boolean;
  showBollinger?: boolean;
}

export function CandlestickChart({ showSMA = false, showEMA = false, showBollinger = false }: CandlestickChartProps) {
  const { selectedPair, chartTimeframe } = useTerminalState();
  const candles = useCandlestickData(selectedPair, chartTimeframe);

  const smaData = useMemo(() => showSMA ? computeSMA(candles, 20) : [], [candles, showSMA]);
  const emaData = useMemo(() => showEMA ? computeEMA(candles, 10) : [], [candles, showEMA]);
  const bbData = useMemo(() => showBollinger ? computeBollingerBands(candles, 20, 2) : [], [candles, showBollinger]);

  const chartData: CandleBar[] = useMemo(() => {
    // Build lookup maps by timestamp
    const smaMap = new Map(smaData.map((p) => [p.timestamp, p.value]));
    const emaMap = new Map(emaData.map((p) => [p.timestamp, p.value]));
    const bbMap = new Map(bbData.map((p) => [p.timestamp, p]));

    return candles.map((c) => {
      const isUp = c.close >= c.open;
      const bb = bbMap.get(c.timestamp);
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
        sma20: smaMap.get(c.timestamp),
        ema10: emaMap.get(c.timestamp),
        bbUpper: bb?.upper,
        bbLower: bb?.lower,
        bbBand: bb ? [bb.lower, bb.upper] : undefined,
      };
    });
  }, [candles, smaData, emaData, bbData]);

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].close : 0;

  const domain = useMemo(() => {
    if (chartData.length === 0) return [0, 1];
    const lows = chartData.map((c) => Math.min(c.low, c.bbLower ?? c.low));
    const highs = chartData.map((c) => Math.max(c.high, c.bbUpper ?? c.high));
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
            formatter={(value: number | number[], name: string) => {
              if (Array.isArray(value)) return [value.map((v) => v.toFixed(decimals)).join(" – "), ""];
              if (typeof value === "number") {
                if (name === "sma20") return [value.toFixed(decimals), "SMA(20)"];
                if (name === "ema10") return [value.toFixed(decimals), "EMA(10)"];
                return [value.toFixed(decimals), ""];
              }
              return [value, ""];
            }}
          />

          {/* Bollinger Bands fill */}
          {showBollinger && (
            <Area
              dataKey="bbBand"
              fill="#9966ff"
              fillOpacity={0.08}
              stroke="none"
              type="monotone"
              isAnimationActive={false}
            />
          )}

          {/* Candle wicks */}
          <Bar dataKey="wick" fill="transparent" stroke="#8888aa" strokeWidth={1} barSize={1} isAnimationActive={false} />
          {/* Candle bodies */}
          <Bar
            dataKey="body"
            barSize={6}
            isAnimationActive={false}
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

          {/* SMA(20) — yellow dashed */}
          {showSMA && (
            <Line
              dataKey="sma20"
              stroke="#ffcc00"
              strokeWidth={1}
              strokeDasharray="4 3"
              dot={false}
              type="monotone"
              connectNulls
              isAnimationActive={false}
            />
          )}

          {/* EMA(10) — cyan solid */}
          {showEMA && (
            <Line
              dataKey="ema10"
              stroke="#00ccff"
              strokeWidth={1.5}
              dot={false}
              type="monotone"
              connectNulls
              isAnimationActive={false}
            />
          )}

          {/* Bollinger upper/lower lines */}
          {showBollinger && (
            <>
              <Line
                dataKey="bbUpper"
                stroke="#9966ff"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                type="monotone"
                connectNulls
                isAnimationActive={false}
              />
              <Line
                dataKey="bbLower"
                stroke="#9966ff"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                type="monotone"
                connectNulls
                isAnimationActive={false}
              />
            </>
          )}

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
