"use client";

import { useState } from "react";
import type { Message, MessageCategory } from "@/types";
import { useMessages } from "@/hooks/use-messages";
import { formatTime } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageDetailModal } from "./message-detail-modal";

interface BlotterMessagesTableProps {
  filterText: string;
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

function priorityDotColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-slate-500";
  }
}

export function BlotterMessagesTable({ filterText }: BlotterMessagesTableProps) {
  const { messages, markAsRead, markAllRead, unreadCount } = useMessages();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = messages.filter((m) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      m.id.toLowerCase().includes(search) ||
      m.subject.toLowerCase().includes(search) ||
      m.category.toLowerCase().includes(search) ||
      (m.relatedPair?.toLowerCase().includes(search) ?? false) ||
      (m.relatedRef?.toLowerCase().includes(search) ?? false)
    );
  });

  function handleRowClick(message: Message) {
    setSelectedMessage(message);
    setModalOpen(true);
    if (!message.read) {
      markAsRead(message.id);
    }
  }

  return (
    <div data-learn="blotter-messages" className="overflow-auto">
      {unreadCount > 0 && (
        <div className="flex items-center justify-end px-3 py-1 border-b border-marex-border-subtle/50">
          <Button variant="terminalGhost" size="xs" onClick={markAllRead}>
            Mark all read ({unreadCount})
          </Button>
        </div>
      )}
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
            <th className="w-6 px-2 py-1"></th>
            <th className="px-3 py-1 text-left">Time</th>
            <th className="px-3 py-1 text-left">Category</th>
            <th className="px-3 py-1 text-left">Subject</th>
            <th className="px-3 py-1 text-left">Pair</th>
            <th className="px-3 py-1 text-left">Ref</th>
            <th className="px-3 py-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr
              key={m.id}
              className={cn(
                "cursor-pointer border-b border-marex-border-subtle/50 transition-colors hover:bg-marex-bg-hover",
                !m.read && "bg-marex-bg-elevated/50"
              )}
              onClick={() => handleRowClick(m)}
            >
              <td className="px-2 py-1 text-center">
                <span className={cn("inline-block h-2 w-2 rounded-full", priorityDotColor(m.priority))} />
              </td>
              <td className="px-3 py-1 text-muted-foreground">{formatTime(m.timestamp)}</td>
              <td className="px-3 py-1">
                <Badge variant={categoryVariant(m.category)} className="text-xs px-1.5 py-0">
                  {m.category}
                </Badge>
              </td>
              <td className={cn("px-3 py-1", !m.read ? "font-semibold text-foreground" : "text-muted-foreground")}>
                {m.subject}
              </td>
              <td className="px-3 py-1 font-mono">{m.relatedPair ?? "—"}</td>
              <td className="px-3 py-1 font-mono text-muted-foreground">{m.relatedRef ?? "—"}</td>
              <td className="px-3 py-1">
                <Badge variant={m.read ? "cancelled" : "buy"} className="text-xs px-1.5 py-0">
                  {m.read ? "Read" : "Unread"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <MessageDetailModal
        message={selectedMessage}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
