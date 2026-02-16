"use client";

import { useState, useCallback, useRef } from "react";
import { TerminalStateProvider } from "@/hooks/use-terminal-state";
import { TerminalHeader } from "@/components/layout/terminal-header";
import { LeftPanel } from "./left-panel/left-panel";
import { CenterPanel } from "./center-panel/center-panel";
import { RightPanel } from "./right-panel/right-panel";
import { BottomBlotter } from "./bottom-panel/bottom-blotter";
import { LearningOverlay } from "./learning/learning-overlay";
import { HotkeyCheatSheet } from "./hotkey-cheat-sheet";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

function TerminalContent() {
  const [hotkeySheetOpen, setHotkeySheetOpen] = useState(false);
  const orderFormRef = useRef<{ setDirection: (d: "Buy" | "Sell") => void; submit: () => void } | null>(null);
  const cancelAllRef = useRef<(() => void) | null>(null);

  const toggleHotkeySheet = useCallback(() => setHotkeySheetOpen((v) => !v), []);

  useKeyboardShortcuts({
    onBuy: () => orderFormRef.current?.setDirection("Buy"),
    onSell: () => orderFormRef.current?.setDirection("Sell"),
    onSubmitOrder: () => orderFormRef.current?.submit(),
    onCancelAll: () => cancelAllRef.current?.(),
    onToggleHotkeySheet: toggleHotkeySheet,
  });

  return (
    <>
      <LearningOverlay />
      <div className="flex h-full flex-col">
        <TerminalHeader />
        <div className="flex-1 min-h-0 grid grid-cols-[35%_35%_30%] grid-rows-[minmax(0,1fr)_220px]">
          {/* Top row: three panels */}
          <LeftPanel />
          <CenterPanel />
          <RightPanel orderFormRef={orderFormRef} cancelAllRef={cancelAllRef} />
          {/* Bottom row: blotter spanning all columns */}
          <div className="col-span-3">
            <BottomBlotter />
          </div>
        </div>
      </div>
      <HotkeyCheatSheet open={hotkeySheetOpen} onClose={() => setHotkeySheetOpen(false)} />
    </>
  );
}

export function TerminalShell() {
  return (
    <TerminalStateProvider>
      <TerminalContent />
    </TerminalStateProvider>
  );
}
