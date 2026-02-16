import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FxTicker } from "@/components/dashboard/fx-ticker";

// Mock the hook
vi.mock("@/hooks/use-fx-rates", () => ({
  useFxRates: () => ({
    rates: [
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
      {
        symbol: "GBP/USD",
        bid: 1.263,
        ask: 1.2632,
        mid: 1.2631,
        spread: 0.0002,
        change24h: -0.002,
        changePercent24h: -0.16,
        timestamp: Date.now(),
        direction: "down" as const,
      },
    ],
    ratesMap: new Map(),
    connected: true,
    getHistory: () => [],
  }),
}));

describe("FxTicker", () => {
  it("renders the ticker section", () => {
    render(<FxTicker />);
    expect(screen.getByLabelText(/live fx rates ticker/i)).toBeInTheDocument();
  });

  it("displays currency pair symbols", () => {
    render(<FxTicker />);
    const eurElements = screen.getAllByText("EUR/USD");
    expect(eurElements.length).toBeGreaterThan(0);
  });

  it("shows connection status", () => {
    render(<FxTicker />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("displays rate values", () => {
    render(<FxTicker />);
    const bidElements = screen.getAllByText("1.0841");
    expect(bidElements.length).toBeGreaterThan(0);
  });

  it("shows percentage changes", () => {
    render(<FxTicker />);
    const positiveChanges = screen.getAllByText("+0.09%");
    expect(positiveChanges.length).toBeGreaterThan(0);
  });
});
