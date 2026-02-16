export type ProductType = "Spot" | "Forward" | "Swap" | "NDF";
export type Direction = "Buy" | "Sell";
export type TransactionStatus = "Completed" | "Pending" | "Failed" | "Processing";
export type SettlementType = "Gross" | "Net" | "PVP";
export type CurrencyPairCategory = "G10" | "EM";

export interface CurrencyPair {
  symbol: string;
  base: string;
  quote: string;
  category: CurrencyPairCategory;
  baseRate: number;
  pipSize: number;
  spreadPips: number;
  volatility: number;
}

export interface FxRate {
  symbol: string;
  bid: number;
  ask: number;
  mid: number;
  spread: number;
  change24h: number;
  changePercent24h: number;
  timestamp: number;
  direction: "up" | "down" | "unchanged";
}

export interface FxRateHistory {
  symbol: string;
  history: number[];
}

export interface Transaction {
  id: string;
  reference: string;
  timestamp: string;
  productType: ProductType;
  direction: Direction;
  currencyPair: string;
  notional: number;
  rate: number;
  status: TransactionStatus;
  counterparty: string;
  valueDate: string;
  settlementDate: string;
  settlementType: SettlementType;
}

export interface PaymentFormData {
  productType: ProductType;
  direction: Direction;
  currencyPair: string;
  amount: number;
  valueDate: string;
  settlementType: SettlementType;
  counterparty: string;
}

export interface KpiData {
  totalToday: number;
  pending: number;
  completed: number;
  failed: number;
}

export interface VolumeDataPoint {
  date: string;
  volume: number;
  count: number;
}

export interface WebSocketMessage {
  type: "rate_update" | "connection_status";
  data: FxRate | { connected: boolean };
}

// Terminal types
export type OrderType = "LIMIT" | "STOP" | "TWAP" | "VWAP";
export type OrderTimeInForce = "GTC" | "IOC" | "FOK" | "GTD" | "DAY";
export type OrderStatus = "Working" | "Filled" | "PartiallyFilled" | "Cancelled" | "Suspended" | "Rejected";
export type FillStatus = "Full" | "Partial" | "None";

export interface Order {
  id: string;
  pair: string;
  direction: Direction;
  type: OrderType;
  amount: number;
  currency: string;
  price: number;
  tif: OrderTimeInForce;
  status: OrderStatus;
  fills: number;
  filledAmount: number;
  submissionTime: string;
  notes?: string;
}

export type PositionStatus = "Open" | "Closed";
export type PositionDirection = "Long" | "Short";

export interface Position {
  id: string;
  pair: string;
  direction: PositionDirection;
  amount: number;
  currency: string;
  avgEntry: number;
  currentPrice: number;
  unrealizedPnl: number;
  pnlPercent: number;
  trades: number;
  openedAt: string;
  status: PositionStatus;
}

export type MessageCategory = "Trade Execution" | "Order Status" | "Risk Alert" | "Settlement" | "System";
export type MessagePriority = "high" | "medium" | "low";

export interface Message {
  id: string;
  timestamp: string;
  category: MessageCategory;
  priority: MessagePriority;
  subject: string;
  body: string;
  read: boolean;
  relatedRef?: string;
  relatedPair?: string;
}

export interface EspTile {
  id: string;
  pair: string;
  amount: number;
  currency: string;
  valueDate: string;
}

export interface LadderLevel {
  price: number;
  bidAmount: number;
  askAmount: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TerminalTab = "ESP" | "RFS" | "Watchlist";
export type EspView = "board" | "ladder";
export type BlotterTab = "Done Trades" | "Orders" | "Positions" | "Messages";
export type ChartTimeframe = "1m" | "5m" | "15m" | "1H" | "4H" | "1D";

export interface Balance {
  currency: string;
  available: number;
  reserved: number;
  total: number;
}
