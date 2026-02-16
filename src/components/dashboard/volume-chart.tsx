"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VolumeDataPoint } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VolumeChartProps {
  data: VolumeDataPoint[];
}

function formatYAxis(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function VolumeChart({ data }: VolumeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">7-Day Payment Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e91e8c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e91e8c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "#8888aa", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                className="text-xs"
                tick={{ fill: "#8888aa", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${(value / 1_000_000).toFixed(1)}M`,
                  "Volume",
                ]}
                contentStyle={{
                  backgroundColor: "#141428",
                  border: "1px solid #333355",
                  borderRadius: "0.375rem",
                  color: "#e0e0f0",
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#e91e8c"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
