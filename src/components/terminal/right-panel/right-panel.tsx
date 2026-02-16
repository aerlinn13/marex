"use client";

import { OrderEntryForm } from "./order-entry-form";
import { OrderStatusList } from "./order-status-list";

export function RightPanel() {
  return (
    <div className="flex h-full flex-col bg-marex-bg-panel">
      <div className="min-h-0 overflow-y-auto border-b border-marex-border-subtle">
        <OrderEntryForm />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <OrderStatusList />
      </div>
    </div>
  );
}
