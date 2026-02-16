"use client";

import { useState, useCallback } from "react";
import type { Order, Direction, OrderType, OrderTimeInForce } from "@/types";
import { generateMockOrders } from "@/lib/mock-data";

interface PlaceOrderParams {
  pair: string;
  direction: Direction;
  type: OrderType;
  amount: number;
  currency: string;
  price: number;
  tif: OrderTimeInForce;
  notes?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => generateMockOrders(8));

  const placeOrder = useCallback((params: PlaceOrderParams) => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      pair: params.pair,
      direction: params.direction,
      type: params.type,
      amount: params.amount,
      currency: params.currency,
      price: params.price,
      tif: params.tif,
      status: "Working",
      fills: 0,
      filledAmount: 0,
      submissionTime: new Date().toISOString(),
      notes: params.notes,
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const amendOrder = useCallback((id: string, newPrice: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id && o.status === "Working" ? { ...o, price: newPrice } : o))
    );
  }, []);

  const suspendOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === "Working" ? { ...o, status: "Suspended" as const } : o
      )
    );
  }, []);

  const resumeOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === "Suspended" ? { ...o, status: "Working" as const } : o
      )
    );
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && (o.status === "Working" || o.status === "Suspended")
          ? { ...o, status: "Cancelled" as const }
          : o
      )
    );
  }, []);

  const fillAtMarket = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id && o.status === "Working"
          ? { ...o, status: "Filled" as const, fills: 1, filledAmount: o.amount }
          : o
      )
    );
  }, []);

  const cancelAllOrders = useCallback(() => {
    setOrders((prev) =>
      prev.map((o) =>
        o.status === "Working" || o.status === "Suspended"
          ? { ...o, status: "Cancelled" as const }
          : o
      )
    );
  }, []);

  return { orders, placeOrder, amendOrder, suspendOrder, resumeOrder, cancelOrder, fillAtMarket, cancelAllOrders };
}
