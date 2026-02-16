"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePositions } from "@/hooks/use-positions";
import { useRiskMetrics, type RiskMetrics } from "@/hooks/use-risk-metrics";
import { MOCK_BALANCES } from "@/lib/mock-data";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

interface RiskDashboardModalProps {
  open: boolean;
  onClose: () => void;
}

function ExposureBar({ currency, net, maxAbs }: { currency: string; net: number; maxAbs: number }) {
  const pct = maxAbs > 0 ? (net / maxAbs) * 50 : 0; // ±50% of bar width
  const isPositive = net >= 0;
  const formatted = Math.abs(net) >= 1_000_000
    ? `${(net / 1_000_000).toFixed(1)}M`
    : Math.abs(net) >= 1_000
    ? `${(net / 1_000).toFixed(0)}K`
    : net.toFixed(0);

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className="w-8 font-mono text-muted-foreground">{currency}</span>
      <div className="relative h-3 flex-1 rounded bg-marex-bg-elevated">
        <div className="absolute left-1/2 top-0 h-full w-px bg-marex-border-subtle" />
        <div
          className={`absolute top-0 h-full rounded ${isPositive ? "bg-marex-buy/60" : "bg-marex-sell/60"}`}
          style={{
            left: isPositive ? "50%" : `${50 + pct}%`,
            width: `${Math.abs(pct)}%`,
          }}
        />
      </div>
      <span className={`w-16 text-right font-mono ${isPositive ? "text-marex-buy" : "text-marex-sell"}`}>
        {formatted}
      </span>
    </div>
  );
}

function LimitBar({ pair, utilization, current, limit }: { pair: string; utilization: number; current: number; limit: number }) {
  const color = utilization > 0.8 ? "bg-marex-sell" : utilization > 0.5 ? "bg-marex-warning" : "bg-marex-buy";
  const formatted = current >= 1_000_000 ? `${(current / 1_000_000).toFixed(1)}M` : `${(current / 1_000).toFixed(0)}K`;
  const limitFormatted = limit >= 1_000_000 ? `${(limit / 1_000_000).toFixed(0)}M` : `${(limit / 1_000).toFixed(0)}K`;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono">{pair}</span>
        <span className="text-muted-foreground">{formatted} / {limitFormatted}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-marex-bg-elevated">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${utilization * 100}%` }} />
      </div>
    </div>
  );
}

function MarginGauge({ utilization }: { utilization: number }) {
  const pct = utilization * 100;
  const color = pct > 80 ? "text-marex-sell" : pct > 60 ? "text-marex-warning" : "text-marex-buy";
  const barColor = pct > 80 ? "bg-marex-sell" : pct > 60 ? "bg-marex-warning" : "bg-marex-buy";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Margin Utilization</span>
        <span className={`font-mono font-semibold ${color}`}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-marex-bg-elevated">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function RiskDashboardModal({ open, onClose }: RiskDashboardModalProps) {
  const { positions } = usePositions();
  const metrics = useRiskMetrics(positions, MOCK_BALANCES);
  const maxAbsExposure = Math.max(...metrics.exposures.map((e) => e.absNet), 1);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-learn="risk-dashboard" className="max-w-lg bg-marex-bg-panel border-marex-border-subtle max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-sm font-semibold">
            <Shield className="h-4 w-4 text-marex-accent-purple" />
            <span>Risk / Exposure Dashboard</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Real-time risk metrics derived from open positions and account balances.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Top Risk Items */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Top Risks
            </h3>
            <div className="space-y-1.5">
              {metrics.topRisks.map((risk, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-2 rounded px-2.5 py-1.5 text-xs ${
                    risk.severity === "high"
                      ? "bg-marex-sell/10 text-marex-sell"
                      : risk.severity === "medium"
                      ? "bg-marex-warning/10 text-marex-warning"
                      : "bg-marex-buy/10 text-marex-buy"
                  }`}
                >
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{risk.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Margin Gauge */}
          <MarginGauge utilization={metrics.marginUtilization} />

          {/* Net Currency Exposure */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Currency Exposure
            </h3>
            <div className="space-y-1.5">
              {metrics.exposures.slice(0, 8).map((exp) => (
                <ExposureBar key={exp.currency} currency={exp.currency} net={exp.net} maxAbs={maxAbsExposure} />
              ))}
            </div>
          </div>

          {/* Position Limit Utilization */}
          {metrics.pairLimits.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Position Limit Utilization
              </h3>
              <div className="space-y-2">
                {metrics.pairLimits.map((pl) => (
                  <LimitBar key={pl.pair} {...pl} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
