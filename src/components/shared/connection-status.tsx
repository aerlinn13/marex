"use client";

import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  connected: boolean;
  latency?: number;
  reconnecting?: boolean;
  reconnectAttempt?: number;
}

export function ConnectionStatus({ connected, latency, reconnecting, reconnectAttempt }: ConnectionStatusProps) {
  const label = reconnecting
    ? `Reconnecting (attempt ${reconnectAttempt})...`
    : connected
    ? `Live${latency ? ` ${latency}ms` : ""}`
    : "Disconnected";

  return (
    <div
      className="flex items-center space-x-2"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          reconnecting
            ? "bg-yellow-500 animate-pulse"
            : connected
            ? "bg-green-500 animate-pulse"
            : "bg-red-500"
        )}
      />
      <span className={cn(
        "text-xs font-mono",
        reconnecting
          ? "text-yellow-400"
          : connected
          ? "text-muted-foreground"
          : "text-red-400"
      )}>
        {label}
      </span>
    </div>
  );
}
