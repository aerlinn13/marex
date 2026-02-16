"use client";

import type { Order } from "@/types";
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
import { formatRate, formatFxAmount, formatTime, formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onAmend?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onResume?: (id: string) => void;
  onFillAtMarket?: (id: string) => void;
  onCancel?: (id: string) => void;
}

function orderStatusVariant(status: string) {
  switch (status) {
    case "Working":
      return "active" as const;
    case "Filled":
      return "filled" as const;
    case "PartiallyFilled":
      return "buy" as const;
    case "Cancelled":
      return "cancelled" as const;
    case "Suspended":
      return "suspended" as const;
    default:
      return "secondary" as const;
  }
}

export function OrderDetailModal({
  order,
  open,
  onClose,
  onAmend,
  onSuspend,
  onResume,
  onFillAtMarket,
  onCancel,
}: OrderDetailModalProps) {
  if (!order) return null;

  const isWorking = order.status === "Working";
  const isSuspended = order.status === "Suspended";
  const isDone = order.status === "Filled" || order.status === "Cancelled";
  const hasPartialFill = order.filledAmount > 0 && order.filledAmount < order.amount;

  function handleAction(action: ((id: string) => void) | undefined) {
    if (action && order) {
      action(order.id);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={orderStatusVariant(order.status)} className="text-xs px-1.5 py-0">
              {order.status}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">{order.id}</span>
          </div>
          <DialogTitle className="text-base text-foreground">
            <span className={cn(order.direction === "Buy" ? "text-marex-buy" : "text-marex-sell")}>
              {order.direction}
            </span>{" "}
            {order.pair}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {order.type} order · Submitted {formatDateTime(order.submissionTime)}
          </DialogDescription>
        </DialogHeader>

        {/* Info cards grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Amount</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {formatFxAmount(order.amount)} {order.currency}
            </div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Price</div>
            <div className="text-sm font-mono font-semibold text-foreground">
              {formatRate(order.price, order.pair)}
            </div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Time in Force</div>
            <div className="text-sm font-semibold text-foreground">{order.tif}</div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Fills</div>
            <div className="text-sm font-mono font-semibold text-foreground">{order.fills}</div>
          </div>
        </div>

        {/* Filled amount highlight */}
        {hasPartialFill && (
          <div className="rounded border border-marex-buy/30 bg-marex-buy/5 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-marex-buy mb-0.5">Filled Amount</div>
            <div className="text-sm font-mono font-semibold text-marex-buy">
              {formatFxAmount(order.filledAmount)} / {formatFxAmount(order.amount)}
            </div>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Notes</div>
            <div className="text-xs text-muted-foreground">{order.notes}</div>
          </div>
        )}

        {/* Details section */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Direction</span>
            <span className={cn("font-medium", order.direction === "Buy" ? "text-marex-buy" : "text-marex-sell")}>
              {order.direction}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Type</span>
            <span className="text-foreground">{order.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted</span>
            <span className="text-foreground font-mono">{formatTime(order.submissionTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Filled Amount</span>
            <span className="text-foreground font-mono">
              {order.filledAmount > 0 ? formatFxAmount(order.filledAmount) : "—"}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="gap-2 sm:gap-2">
          {isWorking && (
            <>
              <Button data-learn="order-amend" variant="terminalGhost" size="xs" onClick={() => handleAction(onAmend)}>
                Amend
              </Button>
              <Button data-learn="order-suspend" variant="terminalGhost" size="xs" onClick={() => handleAction(onSuspend)}>
                Suspend
              </Button>
              <Button data-learn="fill-at-market" variant="terminalGhost" size="xs" onClick={() => handleAction(onFillAtMarket)}>
                Fill@Mkt
              </Button>
              <Button data-learn="off-all" variant="offAll" size="xs" onClick={() => handleAction(onCancel)}>
                Cancel
              </Button>
            </>
          )}
          {isSuspended && (
            <>
              <Button variant="terminalGhost" size="xs" onClick={() => handleAction(onResume)}>
                Resume
              </Button>
              <Button variant="offAll" size="xs" onClick={() => handleAction(onCancel)}>
                Cancel
              </Button>
            </>
          )}
          {isDone && (
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
