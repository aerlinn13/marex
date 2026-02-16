"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePositions } from "@/hooks/use-positions";
import { usePnlTracker } from "@/hooks/use-pnl-tracker";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PnlSummaryModalProps {
  open: boolean;
  onClose: () => void;
}

function formatPnl(value: number): string {
  const sign = value >= 0 ? "+" : "";
  if (Math.abs(value) >= 1_000_000) return `${sign}${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `${sign}${(value / 1_000).toFixed(1)}K`;
  return `${sign}${value.toFixed(2)}`;
}

export function PnlSummaryModal({ open, onClose }: PnlSummaryModalProps) {
  const { positions } = usePositions();
  const pnl = usePnlTracker(positions);
  const isPositive = pnl.totalPnl >= 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-learn="pnl-summary" className="max-w-lg bg-marex-bg-panel border-marex-border-subtle max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-sm font-semibold">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-marex-buy" />
            ) : (
              <TrendingDown className="h-4 w-4 text-marex-sell" />
            )}
            <span>P&L Summary</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Aggregate P&L across all positions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Summary numbers */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5 text-center">
              <div className="text-[10px] uppercase text-muted-foreground">Unrealized</div>
              <div className={`text-sm font-mono font-semibold ${pnl.totalUnrealized >= 0 ? "text-marex-buy" : "text-marex-sell"}`}>
                {formatPnl(pnl.totalUnrealized)}
              </div>
            </div>
            <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5 text-center">
              <div className="text-[10px] uppercase text-muted-foreground">Realized</div>
              <div className={`text-sm font-mono font-semibold ${pnl.totalRealized >= 0 ? "text-marex-buy" : "text-marex-sell"}`}>
                {formatPnl(pnl.totalRealized)}
              </div>
            </div>
            <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5 text-center">
              <div className="text-[10px] uppercase text-muted-foreground">Total P&L</div>
              <div className={`text-sm font-mono font-bold ${isPositive ? "text-marex-buy" : "text-marex-sell"}`}>
                {formatPnl(pnl.totalPnl)}
              </div>
            </div>
          </div>

          {/* Equity Curve */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Equity Curve (24h)
            </h3>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnl.equityCurve} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#22cc66" : "#ff4466"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={isPositive ? "#22cc66" : "#ff4466"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333355" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#8888aa", fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(pnl.equityCurve.length / 6)}
                  />
                  <YAxis
                    tick={{ fill: "#8888aa", fontSize: 9 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#141428",
                      border: "1px solid #333355",
                      borderRadius: "0.375rem",
                      fontSize: "11px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke={isPositive ? "#22cc66" : "#ff4466"}
                    fill="url(#equityGradient)"
                    strokeWidth={1.5}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* P&L by Pair */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              P&L by Pair
            </h3>
            <div className="space-y-1">
              {pnl.byPair.map((entry) => (
                <div key={entry.pair} className="flex items-center justify-between rounded px-2 py-1 text-xs hover:bg-marex-bg-elevated">
                  <span className="font-mono">{entry.pair}</span>
                  <span className={`font-mono ${entry.total >= 0 ? "text-marex-buy" : "text-marex-sell"}`}>
                    {formatPnl(entry.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
