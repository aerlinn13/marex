import { describe, it, expect } from "vitest";
import { paymentFormSchema } from "@/lib/validators";

describe("paymentFormSchema", () => {
  const validData = {
    productType: "Spot",
    direction: "Buy",
    currencyPair: "EUR/USD",
    amount: 100000,
    valueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    settlementType: "Gross",
    counterparty: "Deutsche Bank AG",
  };

  it("accepts valid payment data", () => {
    const result = paymentFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects missing product type", () => {
    const result = paymentFormSchema.safeParse({ ...validData, productType: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects invalid product type", () => {
    const result = paymentFormSchema.safeParse({ ...validData, productType: "Option" });
    expect(result.success).toBe(false);
  });

  it("rejects amount below minimum", () => {
    const result = paymentFormSchema.safeParse({ ...validData, amount: 500 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount).toBeDefined();
    }
  });

  it("rejects amount above maximum", () => {
    const result = paymentFormSchema.safeParse({ ...validData, amount: 100_000_000 });
    expect(result.success).toBe(false);
  });

  it("rejects negative amount", () => {
    const result = paymentFormSchema.safeParse({ ...validData, amount: -1000 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid currency pair format", () => {
    const result = paymentFormSchema.safeParse({ ...validData, currencyPair: "EURUSD" });
    expect(result.success).toBe(false);
  });

  it("accepts valid currency pair format", () => {
    const result = paymentFormSchema.safeParse({ ...validData, currencyPair: "GBP/USD" });
    expect(result.success).toBe(true);
  });

  it("rejects counterparty with special characters", () => {
    const result = paymentFormSchema.safeParse({
      ...validData,
      counterparty: "<script>alert('xss')</script>",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-short counterparty", () => {
    const result = paymentFormSchema.safeParse({ ...validData, counterparty: "A" });
    expect(result.success).toBe(false);
  });

  it("accepts counterparty with allowed special chars", () => {
    const result = paymentFormSchema.safeParse({
      ...validData,
      counterparty: "JP Morgan & Co. (UK)",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty value date", () => {
    const result = paymentFormSchema.safeParse({ ...validData, valueDate: "" });
    expect(result.success).toBe(false);
  });
});
