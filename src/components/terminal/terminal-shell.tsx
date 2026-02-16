"use client";

import { TerminalStateProvider } from "@/hooks/use-terminal-state";
import { TerminalHeader } from "@/components/layout/terminal-header";
import { LeftPanel } from "./left-panel/left-panel";
import { CenterPanel } from "./center-panel/center-panel";
import { RightPanel } from "./right-panel/right-panel";
import { BottomBlotter } from "./bottom-panel/bottom-blotter";
import { LearningOverlay } from "./learning/learning-overlay";

export function TerminalShell() {
  return (
    <TerminalStateProvider>
      <LearningOverlay />
      <div className="flex h-full flex-col">
        <TerminalHeader />
        <div className="flex-1 min-h-0 grid grid-cols-[35%_35%_30%] grid-rows-[minmax(0,1fr)_220px]">
          {/* Top row: three panels */}
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
          {/* Bottom row: blotter spanning all columns */}
          <div className="col-span-3">
            <BottomBlotter />
          </div>
        </div>
      </div>
    </TerminalStateProvider>
  );
}
