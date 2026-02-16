import {
  Transaction,
  ProductType,
  Direction,
  TransactionStatus,
  SettlementType,
  VolumeDataPoint,
  Order,
  OrderType,
  OrderTimeInForce,
  OrderStatus,
  CandlestickData,
  LadderLevel,
  ChartTimeframe,
  Position,
  PositionDirection,
  Balance,
  Message,
  MessageCategory,
  MessagePriority,
} from "@/types";
import { CURRENCY_PAIRS } from "./currency-pairs";

const COUNTERPARTIES = [
  "Deutsche Bank AG",
  "Goldman Sachs International",
  "JP Morgan Securities",
  "Barclays Capital",
  "HSBC Holdings",
  "Morgan Stanley",
  "UBS Group AG",
  "Citi Global Markets",
  "BNP Paribas",
  "Credit Suisse",
  "Nomura International",
  "Standard Chartered",
];

const PRODUCT_TYPES: ProductType[] = ["Spot", "Forward", "Swap", "NDF"];
const DIRECTIONS: Direction[] = ["Buy", "Sell"];
const STATUSES: TransactionStatus[] = ["Completed", "Pending", "Failed", "Processing"];
const STATUS_WEIGHTS = [0.6, 0.2, 0.05, 0.15]; // Weighted distribution
const SETTLEMENT_TYPES: SettlementType[] = ["Gross", "Net", "PVP"];

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReference(): string {
  const prefix = "MRX";
  const num = Math.floor(Math.random() * 900000 + 100000);
  return `${prefix}-${num}`;
}

function generateTransactions(count: number): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 168); // Up to 7 days ago
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const pair = randomElement(CURRENCY_PAIRS);
    const rateVariation = (Math.random() - 0.5) * pair.volatility * 20;
    const rate = pair.baseRate + rateVariation;
    const notional = Math.round((10000 + Math.random() * 4990000) / 1000) * 1000;

    const valueDate = new Date(timestamp);
    valueDate.setDate(valueDate.getDate() + (pair.category === "G10" ? 2 : 3));
    const settlementDate = new Date(valueDate);

    transactions.push({
      id: `txn-${i + 1}`,
      reference: generateReference(),
      timestamp: timestamp.toISOString(),
      productType: randomElement(PRODUCT_TYPES),
      direction: randomElement(DIRECTIONS),
      currencyPair: pair.symbol,
      notional,
      rate: Number(rate.toFixed(pair.pipSize < 0.001 ? 4 : 2)),
      status: weightedRandom(STATUSES, STATUS_WEIGHTS),
      counterparty: randomElement(COUNTERPARTIES),
      valueDate: valueDate.toISOString().split("T")[0],
      settlementDate: settlementDate.toISOString().split("T")[0],
      settlementType: randomElement(SETTLEMENT_TYPES),
    });
  }

  return transactions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Generate 50 seeded transactions
export const MOCK_TRANSACTIONS = generateTransactions(50);

export function getKpiData() {
  const today = new Date().toDateString();
  const todayTxns = MOCK_TRANSACTIONS.filter(
    (t) => new Date(t.timestamp).toDateString() === today
  );
  return {
    totalToday: todayTxns.length || 12,
    pending: todayTxns.filter((t) => t.status === "Pending").length || 3,
    completed: todayTxns.filter((t) => t.status === "Completed").length || 7,
    failed: todayTxns.filter((t) => t.status === "Failed").length || 1,
  };
}

export function getVolumeData(): VolumeDataPoint[] {
  const data: VolumeDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short" });
    data.push({
      date: dateStr,
      volume: Math.round(5_000_000 + Math.random() * 15_000_000),
      count: Math.round(8 + Math.random() * 20),
    });
  }
  return data;
}

export function getRecentPayments(): Transaction[] {
  return MOCK_TRANSACTIONS.slice(0, 5);
}

// Terminal mock data generators

const ORDER_TYPES: OrderType[] = ["LIMIT", "STOP"];
const ORDER_TIFS: OrderTimeInForce[] = ["GTC", "IOC", "FOK", "GTD", "DAY"];
const ORDER_STATUSES: OrderStatus[] = ["Working", "Filled", "PartiallyFilled", "Cancelled", "Suspended"];
const ORDER_STATUS_WEIGHTS = [0.4, 0.25, 0.1, 0.15, 0.1];

export function generateMockOrders(count: number): Order[] {
  const orders: Order[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const pair = randomElement(CURRENCY_PAIRS);
    const direction: Direction = randomElement(DIRECTIONS);
    const status = weightedRandom(ORDER_STATUSES, ORDER_STATUS_WEIGHTS);
    const amount = Math.round((100_000 + Math.random() * 9_900_000) / 100_000) * 100_000;
    const rateVariation = (Math.random() - 0.5) * pair.volatility * 40;
    const price = pair.baseRate + rateVariation;
    const filled = status === "Filled" ? amount : status === "PartiallyFilled" ? Math.round(amount * Math.random() * 0.8 / 100_000) * 100_000 : 0;
    const minsAgo = Math.floor(Math.random() * 480);

    orders.push({
      id: `ORD-${(1000 + i).toString(36).toUpperCase()}`,
      pair: pair.symbol,
      direction,
      type: randomElement(ORDER_TYPES),
      amount,
      currency: pair.base,
      price: Number(price.toFixed(pair.pipSize < 0.001 ? 5 : 3)),
      tif: randomElement(ORDER_TIFS),
      status,
      fills: filled > 0 ? (status === "Filled" ? 1 : Math.ceil(Math.random() * 3)) : 0,
      filledAmount: filled,
      submissionTime: new Date(now.getTime() - minsAgo * 60 * 1000).toISOString(),
    });
  }

  return orders.sort(
    (a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime()
  );
}

export const MOCK_ORDERS = generateMockOrders(12);

// Position mock data

const POSITION_STATUSES: PositionDirection[] = ["Long", "Short"];

export function generateMockPositions(count: number): Position[] {
  const shuffled = [...CURRENCY_PAIRS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  const now = new Date();

  return selected
    .map((pair, i) => {
      const direction: PositionDirection = randomElement(POSITION_STATUSES);
      const amount = Math.round((100_000 + Math.random() * 9_900_000) / 100_000) * 100_000;
      const avgEntry = pair.baseRate + (Math.random() - 0.5) * pair.volatility * 20;
      const currentPrice = avgEntry + (Math.random() - 0.45) * pair.volatility * 30;
      const rawDiff = direction === "Long" ? currentPrice - avgEntry : avgEntry - currentPrice;
      const unrealizedPnl = rawDiff * amount;
      const pnlPercent = (rawDiff / avgEntry) * 100;
      const trades = 1 + Math.floor(Math.random() * 8);
      const hoursAgo = 1 + Math.floor(Math.random() * 72);
      const openedAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
      const status = weightedRandom<"Open" | "Closed">(["Open", "Closed"], [0.8, 0.2]);

      return {
        id: `POS-${(2000 + i).toString(36).toUpperCase()}`,
        pair: pair.symbol,
        direction,
        amount,
        currency: pair.base,
        avgEntry: Number(avgEntry.toFixed(pair.pipSize < 0.001 ? 5 : 3)),
        currentPrice: Number(currentPrice.toFixed(pair.pipSize < 0.001 ? 5 : 3)),
        unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
        pnlPercent: Number(pnlPercent.toFixed(4)),
        trades,
        openedAt,
        status,
      };
    })
    .sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
}

export const MOCK_POSITIONS = generateMockPositions(10);

const TIMEFRAME_SECONDS: Record<ChartTimeframe, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1H": 3600,
  "4H": 14400,
  "1D": 86400,
};

export function generateCandlestickData(
  pairSymbol: string,
  timeframe: ChartTimeframe,
  count: number
): CandlestickData[] {
  const pair = CURRENCY_PAIRS.find((p) => p.symbol === pairSymbol) || CURRENCY_PAIRS[0];
  const intervalSec = TIMEFRAME_SECONDS[timeframe];
  const candles: CandlestickData[] = [];
  const now = Date.now();
  let currentPrice = pair.baseRate;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * intervalSec * 1000;
    const open = currentPrice;
    const moves = 4 + Math.floor(Math.random() * 6);
    let high = open;
    let low = open;
    let close = open;

    for (let j = 0; j < moves; j++) {
      close += (Math.random() - 0.5) * pair.volatility * 3;
      high = Math.max(high, close);
      low = Math.min(low, close);
    }

    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.floor(500 + Math.random() * 5000),
    });

    currentPrice = close;
  }

  return candles;
}

export function generateLadderLevels(pairSymbol: string): LadderLevel[] {
  const pair = CURRENCY_PAIRS.find((p) => p.symbol === pairSymbol) || CURRENCY_PAIRS[0];
  const mid = pair.baseRate;
  const step = pair.pipSize;
  const levels: LadderLevel[] = [];

  for (let i = -10; i <= 10; i++) {
    const price = mid + i * step;
    levels.push({
      price: Number(price.toFixed(pair.pipSize < 0.001 ? 5 : 3)),
      bidAmount: i <= 0 ? Math.floor(100_000 + Math.random() * 5_000_000) : 0,
      askAmount: i >= 0 ? Math.floor(100_000 + Math.random() * 5_000_000) : 0,
    });
  }

  return levels;
}

// Balance mock data

// Message mock data

interface MessageTemplate {
  category: MessageCategory;
  priority: MessagePriority;
  subject: string;
  body: string;
  needsPair: boolean;
  needsRef: boolean;
  needsCpty: boolean;
}

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  // Trade Execution
  { category: "Trade Execution", priority: "high", subject: "Fill: {dir} {amount} {pair} @ {rate}", body: "Your order {ref} has been fully filled. {dir} {amount} {pair} at rate {rate} with counterparty {cpty}. Settlement T+2.", needsPair: true, needsRef: true, needsCpty: true },
  { category: "Trade Execution", priority: "medium", subject: "Partial Fill: {dir} {pair} — {pct}% done", body: "Order {ref} partially filled. {pct}% of {amount} {pair} executed at {rate}. Remaining quantity still working.", needsPair: true, needsRef: true, needsCpty: false },
  { category: "Trade Execution", priority: "high", subject: "Block Trade Executed: {pair}", body: "Block trade {ref} executed. {dir} {amount} {pair} at {rate} with {cpty}. Confirm allocation.", needsPair: true, needsRef: true, needsCpty: true },
  { category: "Trade Execution", priority: "low", subject: "Trade Confirm Sent: {ref}", body: "Trade confirmation for {ref} ({pair}) has been sent to {cpty} for matching.", needsPair: true, needsRef: true, needsCpty: true },
  // Order Status
  { category: "Order Status", priority: "medium", subject: "Order Acknowledged: {ref} {pair}", body: "Your {type} order {ref} for {amount} {pair} has been acknowledged by the venue. Status: Working.", needsPair: true, needsRef: true, needsCpty: false },
  { category: "Order Status", priority: "high", subject: "Order Rejected: {ref} {pair}", body: "Order {ref} for {pair} has been rejected. Reason: Insufficient credit limit. Please contact your credit officer.", needsPair: true, needsRef: true, needsCpty: false },
  { category: "Order Status", priority: "low", subject: "Order Expired: {ref} {pair}", body: "Your GTD order {ref} for {pair} has expired at end of session. No fills were executed.", needsPair: true, needsRef: true, needsCpty: false },
  { category: "Order Status", priority: "medium", subject: "Order Amended: {ref} {pair}", body: "Order {ref} price amended to {rate} for {pair}. New order is active and working.", needsPair: true, needsRef: true, needsCpty: false },
  // Risk Alert
  { category: "Risk Alert", priority: "high", subject: "Margin Call: {pair} position", body: "Margin utilisation for {pair} has exceeded 85%. Current exposure: {amount}. Reduce position or deposit additional collateral.", needsPair: true, needsRef: false, needsCpty: false },
  { category: "Risk Alert", priority: "high", subject: "Credit Limit Breach: {cpty}", body: "Counterparty credit limit for {cpty} has been exceeded. All new orders to this counterparty are suspended until limit is reviewed.", needsPair: false, needsRef: false, needsCpty: true },
  { category: "Risk Alert", priority: "medium", subject: "Position Limit Warning: {pair}", body: "Net {pair} position is approaching the maximum allowed limit. Current position: {amount}. Limit: 10M.", needsPair: true, needsRef: false, needsCpty: false },
  { category: "Risk Alert", priority: "high", subject: "Stop Loss Triggered: {pair}", body: "Stop loss order for {pair} triggered at {rate}. Position closed. Realised P&L will be reflected in EOD report.", needsPair: true, needsRef: false, needsCpty: false },
  // Settlement
  { category: "Settlement", priority: "medium", subject: "Confirmation Matched: {ref}", body: "Trade confirmation for {ref} ({pair}) has been matched with {cpty}. Proceeding to settlement.", needsPair: true, needsRef: true, needsCpty: true },
  { category: "Settlement", priority: "low", subject: "Netting Complete: {cpty}", body: "Netting cycle complete for {cpty}. Net settlement amount calculated across all eligible trades.", needsPair: false, needsRef: false, needsCpty: true },
  { category: "Settlement", priority: "high", subject: "Settlement Failed: {ref}", body: "Settlement for trade {ref} ({pair}) has failed. Reason: Nostro account funding shortfall. Escalated to operations.", needsPair: true, needsRef: true, needsCpty: false },
  // System
  { category: "System", priority: "low", subject: "Market Open: London session", body: "London trading session is now open. EUR/USD, GBP/USD, and EUR/GBP liquidity expected to increase.", needsPair: false, needsRef: false, needsCpty: false },
  { category: "System", priority: "high", subject: "Connectivity: LP disconnected", body: "Liquidity provider feed disconnected. Pricing may be stale for some pairs. Engineering team notified.", needsPair: false, needsRef: false, needsCpty: false },
  { category: "System", priority: "low", subject: "End of Day: PnL summary", body: "Daily P&L summary generated. Total realised P&L: +$142,350. Unrealised P&L: -$23,100. See full report in dashboard.", needsPair: false, needsRef: false, needsCpty: false },
];

const ORDER_TYPES_MSG: string[] = ["LIMIT", "STOP"];
const FILL_PCTS = [15, 25, 30, 45, 60, 75, 80];

export function generateMockMessages(count: number): Message[] {
  const messages: Message[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template = randomElement(MESSAGE_TEMPLATES);
    const pair = randomElement(CURRENCY_PAIRS);
    const cpty = randomElement(COUNTERPARTIES);
    const ref = generateReference();
    const direction = randomElement(DIRECTIONS);
    const amount = formatMsgAmount(Math.round((100_000 + Math.random() * 9_900_000) / 100_000) * 100_000);
    const rateVariation = (Math.random() - 0.5) * pair.volatility * 20;
    const rate = (pair.baseRate + rateVariation).toFixed(pair.pipSize < 0.001 ? 4 : 2);
    const pct = randomElement(FILL_PCTS);
    const type = randomElement(ORDER_TYPES_MSG);
    const minsAgo = Math.floor(Math.random() * 1440); // up to 24 hours

    let subject = template.subject
      .replace("{dir}", direction)
      .replace("{amount}", amount)
      .replace("{pair}", pair.symbol)
      .replace("{rate}", rate)
      .replace("{ref}", ref)
      .replace("{cpty}", cpty)
      .replace("{pct}", String(pct))
      .replace("{type}", type);

    let body = template.body
      .replace(/\{dir\}/g, direction)
      .replace(/\{amount\}/g, amount)
      .replace(/\{pair\}/g, pair.symbol)
      .replace(/\{rate\}/g, rate)
      .replace(/\{ref\}/g, ref)
      .replace(/\{cpty\}/g, cpty)
      .replace(/\{pct\}/g, String(pct))
      .replace(/\{type\}/g, type);

    messages.push({
      id: `MSG-${(3000 + i).toString(36).toUpperCase()}`,
      timestamp: new Date(now.getTime() - minsAgo * 60 * 1000).toISOString(),
      category: template.category,
      priority: template.priority,
      subject,
      body,
      read: Math.random() > 0.4, // ~40% unread
      relatedRef: template.needsRef ? ref : undefined,
      relatedPair: template.needsPair ? pair.symbol : undefined,
    });
  }

  return messages.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

function formatMsgAmount(amount: number): string {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const k = amount / 1_000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(0)}K`;
  }
  return amount.toString();
}

export const MOCK_MESSAGES = generateMockMessages(20);

export const MOCK_BALANCES: Balance[] = [
  { currency: "USD", available: 12_450_000, reserved: 3_200_000, total: 15_650_000 },
  { currency: "EUR", available: 8_320_000, reserved: 1_750_000, total: 10_070_000 },
  { currency: "GBP", available: 5_180_000, reserved: 920_000, total: 6_100_000 },
  { currency: "JPY", available: 1_840_000_000, reserved: 420_000_000, total: 2_260_000_000 },
  { currency: "CHF", available: 3_610_000, reserved: 480_000, total: 4_090_000 },
  { currency: "AUD", available: 4_250_000, reserved: 1_100_000, total: 5_350_000 },
  { currency: "CAD", available: 3_870_000, reserved: 650_000, total: 4_520_000 },
  { currency: "NZD", available: 2_140_000, reserved: 310_000, total: 2_450_000 },
  { currency: "MXN", available: 45_600_000, reserved: 8_400_000, total: 54_000_000 },
  { currency: "ZAR", available: 62_300_000, reserved: 11_500_000, total: 73_800_000 },
  { currency: "TRY", available: 98_000_000, reserved: 22_000_000, total: 120_000_000 },
  { currency: "NGN", available: 850_000_000, reserved: 150_000_000, total: 1_000_000_000 },
  { currency: "BRL", available: 18_700_000, reserved: 3_300_000, total: 22_000_000 },
];
