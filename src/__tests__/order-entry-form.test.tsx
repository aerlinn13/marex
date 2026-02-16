import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderEntryForm } from "@/components/terminal/right-panel/order-entry-form";

vi.mock("@/hooks/use-terminal-state", () => ({
  useTerminalState: () => ({
    selectedPair: "EUR/USD",
  }),
}));

vi.mock("@/hooks/use-orders", () => ({
  useOrders: () => ({
    orders: [],
    placeOrder: vi.fn(() => ({
      id: "ORD-TEST",
      pair: "EUR/USD",
      direction: "Buy",
      type: "LIMIT",
      amount: 1000000,
      currency: "EUR",
      price: 1.0842,
      tif: "GTC",
      status: "Working",
      fills: 0,
      filledAmount: 0,
      submissionTime: new Date().toISOString(),
    })),
  }),
}));

vi.mock("@/hooks/use-fx-rates", () => ({
  useFxRates: () => ({
    rates: [],
    ratesMap: new Map([
      [
        "EUR/USD",
        {
          symbol: "EUR/USD",
          bid: 1.0841,
          ask: 1.0843,
          mid: 1.0842,
          spread: 0.0002,
          change24h: 0.001,
          changePercent24h: 0.09,
          timestamp: Date.now(),
          direction: "up" as const,
        },
      ],
    ]),
    connected: true,
    getHistory: () => [],
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("OrderEntryForm", () => {
  it("renders the order entry panel header", () => {
    render(<OrderEntryForm />);
    expect(screen.getByText("Order Entry")).toBeInTheDocument();
  });

  it("displays LIMIT and STOP type buttons", () => {
    render(<OrderEntryForm />);
    expect(screen.getByRole("button", { name: "LIMIT" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "STOP" })).toBeInTheDocument();
  });

  it("shows live bid and ask prices", () => {
    render(<OrderEntryForm />);
    expect(screen.getByText("Bid")).toBeInTheDocument();
    expect(screen.getByText("Ask")).toBeInTheDocument();
  });

  it("has currency pair selector", () => {
    render(<OrderEntryForm />);
    expect(screen.getByLabelText("Currency Pair")).toBeInTheDocument();
  });

  it("has amount input", () => {
    render(<OrderEntryForm />);
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
  });

  it("has PLACE ORDER button", () => {
    render(<OrderEntryForm />);
    expect(screen.getByRole("button", { name: "PLACE ORDER" })).toBeInTheDocument();
  });

  it("has Time in Force selector", () => {
    render(<OrderEntryForm />);
    expect(screen.getByLabelText("Time in Force")).toBeInTheDocument();
  });

  it("has Notes field", () => {
    render(<OrderEntryForm />);
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });
});
