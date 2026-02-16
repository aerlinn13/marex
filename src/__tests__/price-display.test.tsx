import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "@/components/terminal/shared/price-display";

describe("PriceDisplay", () => {
  it("renders a standard pair rate with superscript parts", () => {
    render(<PriceDisplay rate={1.06427} pair="EUR/USD" />);
    // The whole part "1.06" should be present
    expect(screen.getByText("1.06")).toBeInTheDocument();
    // The big figure "42" should be present and bold
    expect(screen.getByText("42")).toBeInTheDocument();
    // The pip "7" should be present as superscript
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders a JPY pair rate correctly", () => {
    render(<PriceDisplay rate={149.527} pair="USD/JPY" />);
    expect(screen.getByText("149.")).toBeInTheDocument();
    expect(screen.getByText("52")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("applies size classes for sm", () => {
    const { container } = render(<PriceDisplay rate={1.0842} pair="EUR/USD" size="sm" />);
    const wrapper = container.querySelector(".font-mono");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies size classes for lg", () => {
    const { container } = render(<PriceDisplay rate={1.0842} pair="EUR/USD" size="lg" />);
    const wrapper = container.querySelector(".font-mono");
    expect(wrapper).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const { container } = render(
      <PriceDisplay rate={1.0842} pair="EUR/USD" className="text-marex-sell" />
    );
    const wrapper = container.querySelector(".text-marex-sell");
    expect(wrapper).toBeInTheDocument();
  });
});
