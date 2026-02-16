"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface HotkeyCheatSheetProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutEntry {
  keys: string;
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: ShortcutEntry[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: "Trading",
    shortcuts: [
      { keys: "B", description: "Set direction to Buy, focus order form" },
      { keys: "S", description: "Set direction to Sell, focus order form" },
      { keys: "Ctrl+Enter", description: "Submit order" },
      { keys: "Ctrl+Shift+X", description: "OFF ALL orders" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: "1 - 4", description: "Switch blotter tab" },
      { keys: "F1 - F3", description: "Switch left panel tab (ESP/RFS/Watchlist)" },
      { keys: "Ctrl+K", description: "Focus blotter search" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: "L", description: "Toggle screen lock" },
      { keys: "Esc", description: "Close modal / deselect" },
      { keys: "?", description: "Open this cheat sheet" },
    ],
  },
];

function KeyBadge({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-marex-border-subtle bg-marex-bg-elevated px-1.5 font-mono text-[10px] font-medium text-foreground">
      {children}
    </kbd>
  );
}

export function HotkeyCheatSheet({ open, onClose }: HotkeyCheatSheetProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-learn="keyboard-shortcuts" className="max-w-md bg-marex-bg-panel border-marex-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Shortcuts are disabled when focused on input fields.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {SHORTCUT_CATEGORIES.map((category) => (
            <div key={category.title}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {category.title}
              </h3>
              <div className="space-y-1.5">
                {category.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between rounded px-2 py-1 text-xs hover:bg-marex-bg-elevated"
                  >
                    <span className="text-foreground">{shortcut.description}</span>
                    <KeyBadge>{shortcut.keys}</KeyBadge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
