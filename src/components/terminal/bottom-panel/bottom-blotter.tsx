"use client";

import { useState } from "react";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlotterToolbar } from "./blotter-toolbar";
import { BlotterTradesTable } from "./blotter-trades-table";
import { BlotterOrdersTable } from "./blotter-orders-table";
import { BlotterPositionsTable } from "./blotter-positions-table";
import { BlotterMessagesTable } from "./blotter-messages-table";
import type { BlotterTab } from "@/types";

export function BottomBlotter() {
  const { blotterTab, setBlotterTab } = useTerminalState();
  const [filterText, setFilterText] = useState("");

  return (
    <div data-learn="blotter" className="flex h-full flex-col border-t border-marex-border-subtle bg-marex-bg-panel">
      <Tabs value={blotterTab} onValueChange={(v) => setBlotterTab(v as BlotterTab)} className="flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-marex-border-subtle px-2">
          <TabsList className="h-7 bg-transparent p-0">
            <TabsTrigger value="Done Trades" className="h-6 px-3 text-xs">Done Trades</TabsTrigger>
            <TabsTrigger value="Orders" className="h-6 px-3 text-xs">Orders</TabsTrigger>
            <TabsTrigger value="Positions" className="h-6 px-3 text-xs">Positions</TabsTrigger>
            <TabsTrigger value="Messages" className="h-6 px-3 text-xs">Messages</TabsTrigger>
          </TabsList>
        </div>
        <BlotterToolbar searchValue={filterText} onSearchChange={setFilterText} />
        <div className="flex-1 overflow-auto min-h-0">
          <TabsContent value="Done Trades" className="mt-0 h-full">
            <BlotterTradesTable filterText={filterText} />
          </TabsContent>
          <TabsContent value="Orders" className="mt-0 h-full">
            <BlotterOrdersTable filterText={filterText} />
          </TabsContent>
          <TabsContent value="Positions" className="mt-0 h-full">
            <BlotterPositionsTable filterText={filterText} />
          </TabsContent>
          <TabsContent value="Messages" className="mt-0 h-full">
            <BlotterMessagesTable filterText={filterText} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
