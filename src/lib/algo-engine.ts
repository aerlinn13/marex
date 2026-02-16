import type { Direction } from "@/types";

export type AlgoType = "TWAP" | "VWAP";

export interface AlgoParams {
  type: AlgoType;
  pair: string;
  direction: Direction;
  totalAmount: number;
  currency: string;
  durationMinutes: number;
  slices: number;
  participationRate: number; // 0-1, for VWAP
  limitPrice?: number;
}

export interface AlgoChildOrder {
  sliceIndex: number;
  amount: number;
  scheduledTime: string;
  status: "Pending" | "Sent" | "Filled";
  fillPrice?: number;
}

export interface AlgoExecution {
  id: string;
  params: AlgoParams;
  childOrders: AlgoChildOrder[];
  startTime: string;
  status: "Running" | "Completed" | "Cancelled";
  filledAmount: number;
  avgFillPrice: number;
}

/**
 * Creates a simulated algo execution with child order schedule.
 */
export function createAlgoExecution(params: AlgoParams): AlgoExecution {
  const now = new Date();
  const intervalMs = (params.durationMinutes * 60 * 1000) / params.slices;
  const sliceAmount = Math.floor(params.totalAmount / params.slices);
  const remainder = params.totalAmount - sliceAmount * params.slices;

  const childOrders: AlgoChildOrder[] = [];

  for (let i = 0; i < params.slices; i++) {
    const amount = sliceAmount + (i === params.slices - 1 ? remainder : 0);
    const scheduledTime = new Date(now.getTime() + i * intervalMs);

    childOrders.push({
      sliceIndex: i + 1,
      amount,
      scheduledTime: scheduledTime.toISOString(),
      status: "Pending",
    });
  }

  return {
    id: `ALGO-${Date.now().toString(36).toUpperCase()}`,
    params,
    childOrders,
    startTime: now.toISOString(),
    status: "Running",
    filledAmount: 0,
    avgFillPrice: 0,
  };
}

/**
 * Simulates progress on an algo execution.
 * Returns a new execution with some child orders filled.
 */
export function simulateAlgoProgress(
  execution: AlgoExecution,
  currentMarketPrice: number
): AlgoExecution {
  const updated = { ...execution, childOrders: [...execution.childOrders] };
  const now = Date.now();

  let filledAmount = 0;
  let weightedPriceSum = 0;

  for (let i = 0; i < updated.childOrders.length; i++) {
    const child = { ...updated.childOrders[i] };

    if (child.status === "Pending" && new Date(child.scheduledTime).getTime() <= now) {
      child.status = "Sent";
    }

    if (child.status === "Sent") {
      // Simulate fill with slight slippage
      const slippage = (Math.random() - 0.5) * 0.0002;
      child.fillPrice = currentMarketPrice + slippage;
      child.status = "Filled";
    }

    if (child.status === "Filled" && child.fillPrice) {
      filledAmount += child.amount;
      weightedPriceSum += child.amount * child.fillPrice;
    }

    updated.childOrders[i] = child;
  }

  updated.filledAmount = filledAmount;
  updated.avgFillPrice = filledAmount > 0 ? weightedPriceSum / filledAmount : 0;

  const allFilled = updated.childOrders.every((c) => c.status === "Filled");
  if (allFilled) {
    updated.status = "Completed";
  }

  return updated;
}

/**
 * Format duration as human-readable string.
 */
export function formatAlgoDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
