import { describe, it, expect } from "vitest";
import {
  generateNewOrderSingle,
  generateExecutionReport,
  generateFixMessagesForOrder,
  FIX_TAGS,
} from "@/lib/fix-message-generator";
import type { Order } from "@/types";

const mockOrder: Order = {
  id: "ORD-TEST1",
  pair: "EUR/USD",
  direction: "Buy",
  type: "LIMIT",
  amount: 1_000_000,
  currency: "EUR",
  price: 1.0842,
  tif: "GTC",
  status: "Working",
  fills: 0,
  filledAmount: 0,
  submissionTime: new Date().toISOString(),
};

describe("generateNewOrderSingle", () => {
  it("produces a FIX message with MsgType D", () => {
    const msg = generateNewOrderSingle(mockOrder);
    expect(msg.msgType).toBe("D");
    expect(msg.msgTypeName).toBe("NewOrderSingle");
  });

  it("contains required FIX fields", () => {
    const msg = generateNewOrderSingle(mockOrder);
    const tags = msg.fields.map((f) => f.tag);
    expect(tags).toContain(8);  // BeginString
    expect(tags).toContain(35); // MsgType
    expect(tags).toContain(11); // ClOrdID
    expect(tags).toContain(55); // Symbol
    expect(tags).toContain(54); // Side
    expect(tags).toContain(38); // OrderQty
    expect(tags).toContain(44); // Price
  });

  it("includes correct symbol without slash", () => {
    const msg = generateNewOrderSingle(mockOrder);
    const symbolField = msg.fields.find((f) => f.tag === 55);
    expect(symbolField?.value).toBe("EURUSD");
  });

  it("maps Buy direction to Side 1", () => {
    const msg = generateNewOrderSingle(mockOrder);
    const sideField = msg.fields.find((f) => f.tag === 54);
    expect(sideField?.value).toBe("1");
  });

  it("includes SOH-separated raw message", () => {
    const msg = generateNewOrderSingle(mockOrder);
    expect(msg.raw).toContain("8=FIX.4.4");
    expect(msg.raw).toContain("35=D");
  });
});

describe("generateExecutionReport", () => {
  it("produces a FIX message with MsgType 8", () => {
    const msg = generateExecutionReport(mockOrder);
    expect(msg.msgType).toBe("8");
    expect(msg.msgTypeName).toBe("ExecutionReport");
  });

  it("contains execution-specific fields", () => {
    const msg = generateExecutionReport(mockOrder);
    const tags = msg.fields.map((f) => f.tag);
    expect(tags).toContain(17); // ExecID
    expect(tags).toContain(39); // OrdStatus
    expect(tags).toContain(14); // CumQty
    expect(tags).toContain(151); // LeavesQty
  });

  it("reflects order status in OrdStatus field", () => {
    const filledOrder = { ...mockOrder, status: "Filled" as const, filledAmount: 1_000_000 };
    const msg = generateExecutionReport(filledOrder);
    const statusField = msg.fields.find((f) => f.tag === 39);
    expect(statusField?.value).toBe("2"); // Filled
  });
});

describe("generateFixMessagesForOrder", () => {
  it("generates both NOS and ExecutionReport", () => {
    const msgs = generateFixMessagesForOrder(mockOrder);
    expect(msgs).toHaveLength(2);
    expect(msgs[0].msgType).toBe("D");
    expect(msgs[1].msgType).toBe("8");
  });
});

describe("FIX_TAGS", () => {
  it("has mappings for all common tags", () => {
    expect(FIX_TAGS[8]).toBe("BeginString");
    expect(FIX_TAGS[35]).toBe("MsgType");
    expect(FIX_TAGS[55]).toBe("Symbol");
    expect(FIX_TAGS[39]).toBe("OrdStatus");
  });
});
