"use client";

import { useState, useCallback, useMemo } from "react";
import type { Message } from "@/types";
import { generateMockMessages } from "@/lib/mock-data";

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(() => generateMockMessages(20));

  const markAsRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  return { messages, markAsRead, markAllRead, unreadCount };
}
