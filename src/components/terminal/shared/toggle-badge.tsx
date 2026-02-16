"use client";

import { cn } from "@/lib/utils";

interface ToggleBadgeProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  activeColor?: string;
}

export function ToggleBadge({
  label,
  active,
  onToggle,
  activeColor = "text-marex-positive",
}: ToggleBadgeProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "rounded px-2 py-0.5 text-xs font-medium transition-colors",
        active
          ? `${activeColor} bg-current/10`
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label} {active ? "ON" : "OFF"}
    </button>
  );
}
