"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import {
  generateFixMessagesForOrder,
  FIX_TAGS,
  type FixMessage,
  type FixField,
} from "@/lib/fix-message-generator";
import { FileCode } from "lucide-react";

interface FixMessageViewerProps {
  open: boolean;
  onClose: () => void;
}

function FixTagBadge({ field }: { field: FixField }) {
  const isKey = [35, 11, 55, 54, 38, 44, 39, 150].includes(field.tag);

  return (
    <span className="inline-flex items-baseline space-x-0.5 group">
      <span
        className={`font-mono text-[10px] ${isKey ? "text-marex-accent-pink" : "text-marex-accent-purple/70"}`}
        title={field.tagName}
      >
        {field.tag}
      </span>
      <span className="text-muted-foreground text-[10px]">=</span>
      <span
        className={`font-mono text-[10px] ${isKey ? "text-foreground font-semibold" : "text-foreground/80"}`}
      >
        {field.value}
      </span>
      <span className="hidden group-hover:inline-flex ml-1 rounded bg-marex-accent-purple/20 px-1 py-0 text-[9px] text-marex-accent-purple">
        {field.tagName}
      </span>
    </span>
  );
}

function FixMessageCard({ message, index }: { message: FixMessage; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isInbound = message.msgType === "8";

  return (
    <div className="rounded border border-marex-border-subtle bg-marex-bg-elevated">
      <button
        className="flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-marex-bg-panel/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            isInbound ? "bg-marex-buy/20 text-marex-buy" : "bg-marex-accent-pink/20 text-marex-accent-pink"
          }`}>
            {isInbound ? "IN" : "OUT"}
          </span>
          <span className="font-semibold">{message.msgTypeName}</span>
          <span className="text-muted-foreground">({message.msgType})</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString("en-GB")}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-marex-border-subtle px-3 py-2 space-y-1">
          {/* Decoded fields */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {message.fields.map((field, i) => (
              <FixTagBadge key={i} field={field} />
            ))}
          </div>
          {/* Raw message */}
          <div className="mt-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Raw FIX</span>
            <div className="mt-0.5 rounded bg-marex-bg-panel px-2 py-1 font-mono text-[10px] text-foreground/70 break-all">
              {message.raw.replace(/\x01/g, "|")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FixMessageViewer({ open, onClose }: FixMessageViewerProps) {
  const { orders } = useOrders();

  const fixMessages = useMemo(() => {
    // Generate FIX messages for the 5 most recent orders
    const recent = orders.slice(0, 5);
    const msgs: FixMessage[] = [];
    for (const order of recent) {
      msgs.push(...generateFixMessagesForOrder(order));
    }
    return msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [orders]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-learn="fix-protocol" className="max-w-xl bg-marex-bg-panel border-marex-border-subtle max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-sm font-semibold">
            <FileCode className="h-4 w-4 text-marex-accent-purple" />
            <span>FIX Protocol Messages</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            FIX 4.4 message log. Hover over tags to see field names. Click to expand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {fixMessages.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No FIX messages yet. Place an order to see messages.
            </p>
          ) : (
            fixMessages.map((msg, i) => (
              <FixMessageCard key={i} message={msg} index={i} />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
