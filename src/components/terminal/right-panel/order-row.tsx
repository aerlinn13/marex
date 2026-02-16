"use client";

import type { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRate, formatFxAmount, formatTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface OrderRowProps {
  order: Order;
  onAmend?: (id: string) => void;
  onSuspend?: (id: string) => void;
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
    case "Rejected":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export function OrderRow({ order, onAmend, onSuspend, onFillAtMarket, onCancel }: OrderRowProps) {
  const isActive = order.status === "Working";

  return (
    <div className="border-b border-marex-border-subtle/50 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={cn(
              "text-xs font-bold",
              order.direction === "Buy" ? "text-marex-buy" : "text-marex-sell"
            )}
          >
            {order.direction}
          </span>
          <span className="text-xs font-semibold text-foreground">{order.pair}</span>
          <Badge variant={orderStatusVariant(order.status)} className="text-xs px-1.5 py-0">
            {order.status}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {formatTime(order.submissionTime)}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {order.type} · {formatFxAmount(order.amount)} {order.currency} @ {formatRate(order.price, order.pair)} · {order.tif}
        </span>
        {order.filledAmount > 0 && (
          <span className="text-marex-positive">
            Filled: {formatFxAmount(order.filledAmount)}
          </span>
        )}
      </div>
      {isActive && (
        <div className="mt-1.5 flex space-x-1">
          <Button variant="terminalGhost" size="xs" onClick={() => onAmend?.(order.id)} data-learn="order-amend">
            AMEND
          </Button>
          <Button variant="terminalGhost" size="xs" onClick={() => onSuspend?.(order.id)} data-learn="order-suspend">
            SUSPEND
          </Button>
          <Button variant="terminalGhost" size="xs" onClick={() => onFillAtMarket?.(order.id)} data-learn="fill-at-market">
            FILL@MKT
          </Button>
          <Button variant="offAll" size="xs" onClick={() => onCancel?.(order.id)} data-learn="off-all">
            OFF
          </Button>
        </div>
      )}
    </div>
  );
}
