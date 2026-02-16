import type { Order, Direction } from "@/types";

// Common FIX 4.4 tag definitions
export const FIX_TAGS: Record<number, string> = {
  8: "BeginString",
  9: "BodyLength",
  10: "CheckSum",
  11: "ClOrdID",
  14: "CumQty",
  15: "Currency",
  17: "ExecID",
  20: "ExecTransType",
  21: "HandlInst",
  35: "MsgType",
  37: "OrderID",
  38: "OrderQty",
  39: "OrdStatus",
  40: "OrdType",
  44: "Price",
  49: "SenderCompID",
  52: "SendingTime",
  54: "Side",
  55: "Symbol",
  56: "TargetCompID",
  59: "TimeInForce",
  60: "TransactTime",
  150: "ExecType",
  151: "LeavesQty",
  167: "SecurityType",
};

export interface FixField {
  tag: number;
  tagName: string;
  value: string;
}

export interface FixMessage {
  raw: string;
  fields: FixField[];
  msgType: string;
  msgTypeName: string;
  timestamp: string;
}

const MSG_TYPES: Record<string, string> = {
  D: "NewOrderSingle",
  8: "ExecutionReport",
  F: "OrderCancelRequest",
  G: "OrderCancelReplaceRequest",
  9: "OrderCancelReject",
};

const SIDE_MAP: Record<string, string> = { Buy: "1", Sell: "2" };
const ORD_TYPE_MAP: Record<string, string> = { LIMIT: "2", STOP: "3", TWAP: "D", VWAP: "V" };
const TIF_MAP: Record<string, string> = { GTC: "1", IOC: "3", FOK: "4", GTD: "6", DAY: "0" };
const STATUS_MAP: Record<string, string> = {
  Working: "0",     // New
  Filled: "2",      // Filled
  PartiallyFilled: "1",
  Cancelled: "4",   // Canceled
  Suspended: "9",   // Suspended
  Rejected: "8",    // Rejected
};

function formatFixTime(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 17);
}

function computeChecksum(msg: string): string {
  let sum = 0;
  for (let i = 0; i < msg.length; i++) {
    sum += msg.charCodeAt(i);
  }
  return String(sum % 256).padStart(3, "0");
}

function buildFixString(fields: [number, string][]): string {
  const body = fields.map(([tag, value]) => `${tag}=${value}`).join("\x01");
  const withSoh = body + "\x01";
  const checksum = computeChecksum(withSoh);
  return `${withSoh}10=${checksum}\x01`;
}

/**
 * Generate a NewOrderSingle (D) FIX message for an order.
 */
export function generateNewOrderSingle(order: Order): FixMessage {
  const now = formatFixTime();
  const pair = order.pair.replace("/", "");
  const fields: [number, string][] = [
    [8, "FIX.4.4"],
    [35, "D"],
    [49, "MAREXFX"],
    [56, "VENUE"],
    [52, now],
    [11, order.id],
    [55, pair],
    [54, SIDE_MAP[order.direction] || "1"],
    [40, ORD_TYPE_MAP[order.type] || "2"],
    [38, String(order.amount)],
    [44, String(order.price)],
    [15, order.currency],
    [59, TIF_MAP[order.tif] || "1"],
    [21, "1"],        // AutomatedExecution
    [60, now],
    [167, "FOR"],     // FX
  ];

  const raw = buildFixString(fields);
  const bodyLength = raw.split("\x01").slice(1, -2).join("\x01").length;
  // Insert body length after BeginString
  fields.splice(1, 0, [9, String(bodyLength)]);
  const finalRaw = buildFixString(fields);

  return {
    raw: finalRaw,
    fields: fields.map(([tag, value]) => ({
      tag,
      tagName: FIX_TAGS[tag] || `Tag${tag}`,
      value,
    })),
    msgType: "D",
    msgTypeName: "NewOrderSingle",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate an ExecutionReport (8) FIX message for an order.
 */
export function generateExecutionReport(order: Order): FixMessage {
  const now = formatFixTime();
  const pair = order.pair.replace("/", "");
  const execId = `EXEC-${Date.now().toString(36).toUpperCase()}`;

  const fields: [number, string][] = [
    [8, "FIX.4.4"],
    [35, "8"],
    [49, "VENUE"],
    [56, "MAREXFX"],
    [52, now],
    [37, `ORD-${Date.now().toString(36).toUpperCase()}`],
    [11, order.id],
    [17, execId],
    [55, pair],
    [54, SIDE_MAP[order.direction] || "1"],
    [38, String(order.amount)],
    [44, String(order.price)],
    [15, order.currency],
    [39, STATUS_MAP[order.status] || "0"],
    [150, STATUS_MAP[order.status] || "0"],
    [14, String(order.filledAmount)],
    [151, String(order.amount - order.filledAmount)],
    [60, now],
  ];

  const raw = buildFixString(fields);

  return {
    raw,
    fields: fields.map(([tag, value]) => ({
      tag,
      tagName: FIX_TAGS[tag] || `Tag${tag}`,
      value,
    })),
    msgType: "8",
    msgTypeName: "ExecutionReport",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate a pair of FIX messages (NOS + ExecReport) for an order.
 */
export function generateFixMessagesForOrder(order: Order): FixMessage[] {
  return [generateNewOrderSingle(order), generateExecutionReport(order)];
}
