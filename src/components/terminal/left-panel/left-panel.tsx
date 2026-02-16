"use client";

import { useTerminalState } from "@/hooks/use-terminal-state";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EspBoard } from "./esp-board";
import { PriceLadder } from "./price-ladder";
import { WatchlistTable } from "./watchlist-table";
import type { TerminalTab } from "@/types";

export function LeftPanel() {
  const { leftTab, setLeftTab } = useTerminalState();

  return (
    <div className="flex h-full flex-col border-r border-marex-border-subtle bg-marex-bg-panel">
      <Tabs value={leftTab} onValueChange={(v) => setLeftTab(v as TerminalTab)} className="flex flex-col h-full">
        <div className="border-b border-marex-border-subtle px-2 pt-1">
          <TabsList className="h-7 bg-transparent p-0">
            <TabsTrigger value="ESP" className="h-6 px-3 text-xs" data-learn="esp-tile">ESP</TabsTrigger>
            <TabsTrigger value="RFS" className="h-6 px-3 text-xs" data-learn="rfs-pricing">RFS</TabsTrigger>
            <TabsTrigger value="Watchlist" className="h-6 px-3 text-xs" data-learn="watchlist">Watchlist</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="ESP" className="flex-1 overflow-auto mt-0">
          <EspBoard />
        </TabsContent>
        <TabsContent value="RFS" className="flex-1 overflow-auto mt-0">
          <PriceLadder />
        </TabsContent>
        <TabsContent value="Watchlist" className="flex-1 overflow-auto mt-0">
          <WatchlistTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
