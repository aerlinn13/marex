"use client";

import type { Position } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRate, formatFxAmount, formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PositionDetailModalProps {
  position: Position | null;
  open: boolean;
  onClose: () => void;
  onClosePosition?: (id: string) => void;
}

function positionStatusVariant(status: string) {
  switch (status) {
    case "Open":
      return "active" as const;
    case "Closed":
      return "cancelled" as const;
    default:
      return "secondary" as const;
  }
}

export function PositionDetailModal({
  position,
  open,
  onClose,
  onClosePosition,
}: PositionDetailModalProps) {
  if (!position) return null;

  const isOpen = position.status === "Open";
  const isProfit = position.unrealizedPnl >= 0;

  function handleClosePosition() {
    if (onClosePosition && position) {
      onClosePosition(position.id);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={positionStatusVariant(position.status)} className="text-xs px-1.5 py-0">
              {position.status}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">{position.id}</span>
          </div>
          <DialogTitle className="text-base text-foreground">
            <span data-learn="position-direction" className={cn(position.direction === "Long" ? "text-marex-buy" : "text-marex-sell")}>
              {position.direction}
            </span>{" "}
            {position.pair}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {position.trades} contributing trade{position.trades !== 1 ? "s" : ""} · Opened {formatDateTime(position.openedAt)}
          </DialogDescription>
        </DialogHeader>

        {/* Info cards grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Amount</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {formatFxAmount(position.amount)} {position.currency}
            </div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Avg Entry</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {formatRate(position.avgEntry, position.pair)}
            </div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Current Price</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {formatRate(position.currentPrice, position.pair)}
            </div>
          </div>
          <div
            data-learn="unrealized-pnl"
            className={cn(
              "rounded border p-2.5",
              isProfit
                ? "border-marex-positive/30 bg-marex-positive/5"
                : "border-marex-sell/30 bg-marex-sell/5"
            )}
          >
            <div
              className={cn(
                "text-[10px] uppercase tracking-wider mb-0.5",
                isProfit ? "text-marex-positive" : "text-marex-sell"
              )}
            >
              Unrealized PnL
            </div>
            <div
              className={cn(
                "text-sm font-mono font-semibold",
                isProfit ? "text-marex-positive" : "text-marex-sell"
              )}
            >
              {isProfit ? "+" : ""}
              {position.unrealizedPnl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Direction</span>
            <span className={cn("font-medium", position.direction === "Long" ? "text-marex-buy" : "text-marex-sell")}>
              {position.direction}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PnL %</span>
            <span className={cn("font-mono", isProfit ? "text-marex-positive" : "text-marex-sell")}>
              {isProfit ? "+" : ""}{position.pnlPercent.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contributing Trades</span>
            <span className="text-foreground">{position.trades}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opened</span>
            <span className="text-foreground font-mono">{formatDateTime(position.openedAt)}</span>
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="gap-2 sm:gap-2">
          {isOpen ? (
            <Button data-learn="close-position" variant="offAll" size="xs" onClick={handleClosePosition}>
              Close Position
            </Button>
          ) : (
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
