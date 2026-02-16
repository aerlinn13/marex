"use client";

import { type MutableRefObject } from "react";
import { OrderEntryForm } from "./order-entry-form";
import { OrderStatusList } from "./order-status-list";

interface RightPanelProps {
  orderFormRef?: MutableRefObject<{ setDirection: (d: "Buy" | "Sell") => void; submit: () => void } | null>;
  cancelAllRef?: MutableRefObject<(() => void) | null>;
}

export function RightPanel({ orderFormRef, cancelAllRef }: RightPanelProps) {
  return (
    <div className="flex h-full flex-col bg-marex-bg-panel">
      <div className="min-h-0 overflow-y-auto border-b border-marex-border-subtle">
        <OrderEntryForm imperativeRef={orderFormRef} cancelAllRef={cancelAllRef} />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <OrderStatusList />
      </div>
    </div>
  );
}
