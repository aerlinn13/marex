"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { OrderFormSchema } from "@/lib/validators";
import type { FxRate } from "@/types";

interface TradeConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  data: OrderFormSchema | null;
  rate: FxRate | undefined;
}

function computePipDistance(orderPrice: number, marketPrice: number, pair: string): number {
  const isJpy = pair.includes("JPY");
  const pipSize = isJpy ? 0.01 : 0.0001;
  return Math.abs(orderPrice - marketPrice) / pipSize;
}

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toLocaleString();
}

export function TradeConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  data,
  rate,
}: TradeConfirmationDialogProps) {
  if (!data || !rate) return null;

  const marketPrice = data.direction === "Buy" ? rate.ask : rate.bid;
  const pipDistance = computePipDistance(data.price, marketPrice, data.pair);
  const isLargeNotional = data.amount > 5_000_000;
  const isDistantPrice = pipDistance > 50;
  const hasWarnings = isLargeNotional || isDistantPrice;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent data-learn="trade-confirmation" className="max-w-sm bg-marex-bg-panel border-marex-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Confirm Order</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Review order details before submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Order summary */}
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Direction</span>
              <span className={data.direction === "Buy" ? "font-semibold text-marex-buy" : "font-semibold text-marex-sell"}>
                {data.direction}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pair</span>
              <span className="font-semibold">{data.pair}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Type</span>
              <span className="font-mono">{data.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono">{formatAmount(data.amount)} {data.currency}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Price</span>
              <span className="font-mono">{data.price}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Market ({data.direction === "Buy" ? "Ask" : "Bid"})</span>
              <span className="font-mono text-muted-foreground">{marketPrice.toFixed(data.pair.includes("JPY") ? 3 : 5)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Distance</span>
              <span className={`font-mono ${pipDistance > 50 ? "text-marex-warning" : ""}`}>
                {pipDistance.toFixed(1)} pips
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">TIF</span>
              <span>{data.tif}</span>
            </div>
          </div>

          {/* Warnings */}
          {hasWarnings && (
            <div className="space-y-1.5">
              {isLargeNotional && (
                <div className="flex items-start space-x-2 rounded border border-marex-warning/30 bg-marex-warning/10 px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-marex-warning" />
                  <span className="text-xs text-marex-warning">
                    Large notional: {formatAmount(data.amount)} exceeds 5M threshold
                  </span>
                </div>
              )}
              {isDistantPrice && (
                <div className="flex items-start space-x-2 rounded border border-marex-warning/30 bg-marex-warning/10 px-3 py-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-marex-warning" />
                  <span className="text-xs text-marex-warning">
                    Distant price: {pipDistance.toFixed(1)} pips from market (threshold: 50)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row space-x-2">
          <Button variant="terminalGhost" size="sm" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant={hasWarnings ? "destructive" : "accentPink"}
            size="sm"
            onClick={onConfirm}
            className="flex-1"
          >
            {hasWarnings ? "Confirm Anyway" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { computePipDistance };
