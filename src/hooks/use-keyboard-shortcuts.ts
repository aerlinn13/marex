"use client";

import { useEffect, useCallback } from "react";
import { useTerminalState } from "./use-terminal-state";
import type { BlotterTab, TerminalTab } from "@/types";

interface KeyboardShortcutActions {
  onBuy?: () => void;
  onSell?: () => void;
  onSubmitOrder?: () => void;
  onCancelAll?: () => void;
  onToggleHotkeySheet?: () => void;
}

const BLOTTER_TABS: BlotterTab[] = ["Done Trades", "Orders", "Positions", "Messages"];
const LEFT_TABS: TerminalTab[] = ["ESP", "RFS", "Watchlist"];

export function useKeyboardShortcuts(actions: KeyboardShortcutActions = {}) {
  const {
    screenLocked,
    setScreenLocked,
    setBlotterTab,
    setLeftTab,
  } = useTerminalState();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;

      // Esc always works (close modal / deselect)
      if (e.key === "Escape") {
        // Let Radix dialogs handle their own Esc — don't prevent default
        return;
      }

      // ? always works for hotkey sheet
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        if (isInput) return;
        e.preventDefault();
        actions.onToggleHotkeySheet?.();
        return;
      }

      // Block all other shortcuts when screen is locked
      if (screenLocked && e.key !== "l" && e.key !== "L") {
        // Allow L to unlock even when locked
        if (e.key === "l" || e.key === "L") {
          if (isInput) return;
          e.preventDefault();
          setScreenLocked(false);
          return;
        }
        return;
      }

      // L — Toggle screen lock
      if ((e.key === "l" || e.key === "L") && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        setScreenLocked(!screenLocked);
        return;
      }

      // Ctrl+K — Focus blotter search
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          '[data-blotter-search]'
        );
        searchInput?.focus();
        return;
      }

      // Ctrl+Enter — Submit order
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        actions.onSubmitOrder?.();
        return;
      }

      // Ctrl+Shift+X — OFF ALL orders
      if (e.key === "X" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        actions.onCancelAll?.();
        return;
      }

      // Skip remaining shortcuts when focused on inputs
      if (isInput) return;

      // B / S — Set order direction
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        actions.onBuy?.();
        return;
      }
      if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        actions.onSell?.();
        return;
      }

      // 1-4 — Switch blotter tab
      if (e.key >= "1" && e.key <= "4") {
        const idx = parseInt(e.key) - 1;
        if (idx < BLOTTER_TABS.length) {
          e.preventDefault();
          setBlotterTab(BLOTTER_TABS[idx]);
        }
        return;
      }

      // F1-F3 — Switch left panel tab
      if (e.key === "F1" || e.key === "F2" || e.key === "F3") {
        const idx = parseInt(e.key.slice(1)) - 1;
        if (idx < LEFT_TABS.length) {
          e.preventDefault();
          setLeftTab(LEFT_TABS[idx]);
        }
        return;
      }
    },
    [screenLocked, setScreenLocked, setBlotterTab, setLeftTab, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
