"use client";

import type { Message, MessageCategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/formatters";

interface MessageDetailModalProps {
  message: Message | null;
  open: boolean;
  onClose: () => void;
}

function categoryVariant(category: MessageCategory) {
  switch (category) {
    case "Trade Execution":
      return "filled" as const;
    case "Order Status":
      return "active" as const;
    case "Risk Alert":
      return "destructive" as const;
    case "Settlement":
      return "processing" as const;
    case "System":
      return "suspended" as const;
  }
}

function priorityVariant(priority: string) {
  switch (priority) {
    case "high":
      return "destructive" as const;
    case "medium":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

export function MessageDetailModal({ message, open, onClose }: MessageDetailModalProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={categoryVariant(message.category)} className="text-xs px-1.5 py-0">
              {message.category}
            </Badge>
            <Badge variant={priorityVariant(message.priority)} className="text-xs px-1.5 py-0">
              {message.priority}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">{message.id}</span>
          </div>
          <DialogTitle className="text-base text-foreground">
            {message.subject}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Received {formatDateTime(message.timestamp)}
          </DialogDescription>
        </DialogHeader>

        {/* Info cards grid */}
        <div className="grid grid-cols-2 gap-2">
          {message.relatedPair && (
            <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Currency Pair</div>
              <div className="text-sm font-semibold text-foreground">{message.relatedPair}</div>
            </div>
          )}
          {message.relatedRef && (
            <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Reference</div>
              <div className="text-sm font-mono font-semibold text-foreground">{message.relatedRef}</div>
            </div>
          )}
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Time</div>
            <div className="text-sm font-mono font-semibold text-foreground">{formatDateTime(message.timestamp)}</div>
          </div>
          <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Priority</div>
            <div className="text-sm font-semibold text-foreground capitalize">{message.priority}</div>
          </div>
        </div>

        {/* Message body */}
        <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2.5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Message</div>
          <div className="text-xs text-foreground leading-relaxed">{message.body}</div>
        </div>

        {/* Details section */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category</span>
            <span className="text-foreground">{message.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Received</span>
            <span className="text-foreground font-mono">{formatDateTime(message.timestamp)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="text-foreground">{message.read ? "Read" : "Unread"}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="xs" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
