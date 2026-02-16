import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the mock-websocket engine directly (not the React hook) for unit testing
describe("MockWebSocketEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it("should initialize with rates for all currency pairs", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    const rates = engine.getCurrentRates();

    expect(rates.size).toBeGreaterThan(0);
    expect(rates.has("EUR/USD")).toBe(true);
    expect(rates.has("GBP/USD")).toBe(true);
    expect(rates.has("USD/JPY")).toBe(true);
  });

  it("should have bid < ask for all rates", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    const rates = engine.getCurrentRates();

    rates.forEach((rate) => {
      expect(rate.bid).toBeLessThan(rate.ask);
    });
  });

  it("should provide history for each pair", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    const history = engine.getHistory("EUR/USD");

    expect(history.length).toBe(50);
    history.forEach((val) => expect(typeof val).toBe("number"));
  });

  it("should notify subscribers on rate updates", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    const callback = vi.fn();

    engine.subscribe(callback);
    engine.start();

    // Advance time to trigger updates
    vi.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalled();
    const lastCall = callback.mock.calls[callback.mock.calls.length - 1][0];
    expect(lastCall).toHaveProperty("symbol");
    expect(lastCall).toHaveProperty("bid");
    expect(lastCall).toHaveProperty("ask");

    engine.stop();
  });

  it("should stop notifying after unsubscribe", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    const callback = vi.fn();

    const unsubscribe = engine.subscribe(callback);
    engine.start();

    vi.advanceTimersByTime(2000);
    const callCountBefore = callback.mock.calls.length;

    unsubscribe();
    vi.advanceTimersByTime(5000);

    // Should not have received more calls after unsubscribe
    expect(callback.mock.calls.length).toBe(callCountBefore);

    engine.stop();
  });

  it("should return empty array for unknown symbol history", async () => {
    const { getMockWebSocketEngine } = await import("@/lib/mock-websocket");
    const engine = getMockWebSocketEngine();
    expect(engine.getHistory("XXX/YYY")).toEqual([]);
  });
});
