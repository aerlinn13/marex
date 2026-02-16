"use client";

import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <div
      className="flex items-center space-x-2"
      role="status"
      aria-live="polite"
      aria-label={connected ? "Connected to live feed" : "Disconnected from live feed"}
    >
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "bg-green-500 animate-pulse" : "bg-red-500"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {connected ? "Live" : "Disconnected"}
      </span>
    </div>
  );
}
