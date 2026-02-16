"use client";

import { useState } from "react";
import type { Order } from "@/types";
import { useOrders } from "@/hooks/use-orders";
import { formatRate, formatFxAmount, formatTime } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderDetailModal } from "./order-detail-modal";

interface BlotterOrdersTableProps {
  filterText: string;
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

export function BlotterOrdersTable({ filterText }: BlotterOrdersTableProps) {
  const { orders, amendOrder, suspendOrder, resumeOrder, cancelOrder, fillAtMarket } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = orders.filter((o) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      o.id.toLowerCase().includes(search) ||
      o.pair.toLowerCase().includes(search) ||
      o.status.toLowerCase().includes(search)
    );
  });

  function handleAmend(id: string) {
    const o = orders.find((o) => o.id === id);
    if (o) {
      const isJpy = o.pair.includes("JPY");
      const step = isJpy ? 0.01 : 0.0001;
      amendOrder(id, o.price + step);
    }
  }

  return (
    <div data-learn="blotter-orders" className="overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
            <th className="px-3 py-1 text-left">ID</th>
            <th className="px-3 py-1 text-left">Time</th>
            <th className="px-3 py-1 text-left">Pair</th>
            <th className="px-3 py-1 text-left">Dir</th>
            <th className="px-3 py-1 text-left">Type</th>
            <th className="px-3 py-1 text-right">Amount</th>
            <th className="px-3 py-1 text-right">Price</th>
            <th className="px-3 py-1 text-left">TIF</th>
            <th className="px-3 py-1 text-left">Status</th>
            <th className="px-3 py-1 text-right">Filled</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr
              key={o.id}
              className="cursor-pointer border-b border-marex-border-subtle/50 transition-colors hover:bg-marex-bg-hover"
              onClick={() => {
                setSelectedOrder(o);
                setModalOpen(true);
              }}
            >
              <td className="px-3 py-1 font-mono">{o.id}</td>
              <td className="px-3 py-1 text-muted-foreground">{formatTime(o.submissionTime)}</td>
              <td className="px-3 py-1 font-semibold">{o.pair}</td>
              <td className={cn("px-3 py-1 font-medium", o.direction === "Buy" ? "text-marex-buy" : "text-marex-sell")}>
                {o.direction}
              </td>
              <td className="px-3 py-1">{o.type}</td>
              <td className="px-3 py-1 text-right font-mono">{formatFxAmount(o.amount)}</td>
              <td className="px-3 py-1 text-right font-mono">{formatRate(o.price, o.pair)}</td>
              <td className="px-3 py-1">{o.tif}</td>
              <td className="px-3 py-1">
                <Badge variant={orderStatusVariant(o.status)} className="text-xs px-1.5 py-0">
                  {o.status}
                </Badge>
              </td>
              <td className="px-3 py-1 text-right font-mono">
                {o.filledAmount > 0 ? formatFxAmount(o.filledAmount) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <OrderDetailModal
        order={selectedOrder}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAmend={handleAmend}
        onSuspend={suspendOrder}
        onResume={resumeOrder}
        onFillAtMarket={fillAtMarket}
        onCancel={cancelOrder}
      />
    </div>
  );
}
