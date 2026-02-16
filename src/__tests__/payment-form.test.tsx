import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentForm } from "@/components/payments/payment-form";

// Mock the hooks
vi.mock("@/hooks/use-fx-rates", () => ({
  useFxRates: () => ({
    rates: [],
    ratesMap: new Map(),
    connected: true,
    getHistory: () => [],
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
    toasts: [],
    dismiss: vi.fn(),
  }),
}));

describe("PaymentForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all form fields", () => {
    render(<PaymentForm />);

    expect(screen.getByLabelText(/product type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/direction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/currency pair/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/value date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/settlement type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/counterparty/i)).toBeInTheDocument();
  });

  it("renders submit and reset buttons", () => {
    render(<PaymentForm />);

    expect(screen.getByRole("button", { name: /submit payment/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty submission", async () => {
    const user = userEvent.setup();
    render(<PaymentForm />);

    await user.click(screen.getByRole("button", { name: /submit payment/i }));

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it("shows amount validation error for too-low amount", async () => {
    const user = userEvent.setup();
    render(<PaymentForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "500");
    await user.click(screen.getByRole("button", { name: /submit payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/minimum amount/i)).toBeInTheDocument();
    });
  });

  it("has proper aria-describedby attributes on fields", () => {
    render(<PaymentForm />);

    const amountInput = screen.getByLabelText(/amount/i);
    expect(amountInput).toHaveAttribute("aria-describedby", "amount-error");
  });
});
