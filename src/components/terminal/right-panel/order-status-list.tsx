"use client";

import { useOrders } from "@/hooks/use-orders";
import { PanelHeader } from "../shared/panel-header";
import { OrderRow } from "./order-row";
import { Button } from "@/components/ui/button";

export function OrderStatusList() {
  const { orders, amendOrder, suspendOrder, cancelOrder, fillAtMarket, cancelAllOrders } =
    useOrders();

  const workingOrders = orders.filter((o) => o.status === "Working" || o.status === "Suspended");
  const doneOrders = orders.filter(
    (o) => o.status === "Filled" || o.status === "Cancelled" || o.status === "PartiallyFilled"
  );

  return (
    <div data-learn="order-status" className="flex flex-col h-full">
      <PanelHeader title={`Orders (${workingOrders.length} active)`}>
        <Button variant="offAll" size="xs" onClick={cancelAllOrders}>
          OFF ALL
        </Button>
      </PanelHeader>
      <div className="flex-1 overflow-auto">
        {workingOrders.length === 0 && doneOrders.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
            No orders
          </div>
        )}
        {workingOrders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onAmend={(id) => {
              const o = orders.find((o) => o.id === id);
              if (o) {
                const isJpy = o.pair.includes("JPY");
                const step = isJpy ? 0.01 : 0.0001;
                amendOrder(id, o.price + step);
              }
            }}
            onSuspend={suspendOrder}
            onFillAtMarket={fillAtMarket}
            onCancel={cancelOrder}
          />
        ))}
        {doneOrders.length > 0 && (
          <>
            <div className="bg-marex-bg-elevated px-3 py-1 text-xs uppercase text-muted-foreground">
              Done
            </div>
            {doneOrders.slice(0, 5).map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
