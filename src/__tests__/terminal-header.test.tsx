import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalHeader } from "@/components/layout/terminal-header";

// Mock hooks
vi.mock("@/hooks/use-terminal-state", () => ({
  useTerminalState: () => ({
    screenLocked: false,
    setScreenLocked: vi.fn(),
    volatileMarket: false,
    setVolatileMarket: vi.fn(),
    provider: "ALL",
  }),
}));

vi.mock("@/hooks/use-fx-rates", () => ({
  useFxRates: () => ({
    rates: [],
    ratesMap: new Map(),
    connected: true,
    getHistory: () => [],
  }),
}));

describe("TerminalHeader", () => {
  it("renders the MarexFX logo", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("MarexFX")).toBeInTheDocument();
  });

  it("renders the Demo label", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("shows connection status", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("displays Screen Lock OFF by default", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("Screen Lock OFF")).toBeInTheDocument();
  });

  it("displays Volatile Market OFF by default", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("Volatile Market OFF")).toBeInTheDocument();
  });

  it("displays Provider ALL", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("ALL")).toBeInTheDocument();
  });

  it("shows OFF ALL ORG button", () => {
    render(<TerminalHeader />);
    expect(screen.getByText("OFF ALL ORG")).toBeInTheDocument();
  });

  it("has a logout button", () => {
    render(<TerminalHeader />);
    expect(screen.getByLabelText("Logout")).toBeInTheDocument();
  });
});
