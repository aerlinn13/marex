import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WatchlistTable } from "@/components/terminal/left-panel/watchlist-table";

const mockSetSelectedPair = vi.fn();

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

vi.mock("@/hooks/use-terminal-state", () => ({
  useTerminalState: () => ({
    selectedPair: "EUR/USD",
    setSelectedPair: mockSetSelectedPair,
  }),
}));

describe("WatchlistTable", () => {
  it("renders the watchlist table", () => {
    render(<WatchlistTable />);
    expect(screen.getByRole("table", { name: /fx watchlist/i })).toBeInTheDocument();
  });

  it("displays currency pair symbols", () => {
    render(<WatchlistTable />);
    expect(screen.getByText("EUR/USD")).toBeInTheDocument();
    expect(screen.getByText("GBP/USD")).toBeInTheDocument();
  });

  it("displays bid and ask columns", () => {
    render(<WatchlistTable />);
    expect(screen.getByText("Bid")).toBeInTheDocument();
    expect(screen.getByText("Offer")).toBeInTheDocument();
  });

  it("shows percentage changes", () => {
    render(<WatchlistTable />);
    expect(screen.getByText("+0.09%")).toBeInTheDocument();
    expect(screen.getByText("-0.16%")).toBeInTheDocument();
  });

  it("selects a pair when row is clicked", async () => {
    const user = userEvent.setup();
    render(<WatchlistTable />);
    const gbpRow = screen.getByText("GBP/USD").closest("tr");
    if (gbpRow) await user.click(gbpRow);
    expect(mockSetSelectedPair).toHaveBeenCalledWith("GBP/USD");
  });

  it("highlights the selected pair row", () => {
    render(<WatchlistTable />);
    const eurRow = screen.getByText("EUR/USD").closest("tr");
    expect(eurRow?.className).toContain("bg-marex-tabActive");
  });
});
