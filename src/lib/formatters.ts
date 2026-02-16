/**
 * Format a number as currency with appropriate decimal places.
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a compact currency (e.g., $1.2M).
 */
export function formatCompactCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format an FX rate to appropriate decimal places based on the pair.
 */
export function formatRate(rate: number, pair: string): string {
  const isJpy = pair.includes("JPY");
  const isEm =
    pair.includes("MXN") ||
    pair.includes("ZAR") ||
    pair.includes("TRY") ||
    pair.includes("NGN") ||
    pair.includes("BRL");

  if (isJpy) return rate.toFixed(2);
  if (isEm) return rate.toFixed(4);
  return rate.toFixed(4);
}

/**
 * Format a number with commas and decimals.
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format a timestamp for display (time only).
 */
export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Format a timestamp for display (date + time).
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Format a percentage change with sign.
 */
export function formatPercentChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a spread in pips.
 */
export function formatSpread(spread: number, pair: string): string {
  const isJpy = pair.includes("JPY");
  if (isJpy) return (spread * 100).toFixed(1);
  return (spread * 10000).toFixed(1);
}

/**
 * Split an FX rate into parts for superscript display.
 * Returns { whole, big, pip } — e.g. 1.0642 → { whole: "1.06", big: "42", pip: "7" }
 */
export function formatRateParts(
  rate: number,
  pair: string
): { whole: string; big: string; pip: string } {
  const isJpy = pair.includes("JPY");
  const formatted = isJpy ? rate.toFixed(3) : rate.toFixed(5);
  const parts = formatted.split(".");
  const intPart = parts[0];
  const decPart = parts[1] || "";

  if (isJpy) {
    // JPY: 149.527 → whole="149.", big="52", pip="7"
    return {
      whole: intPart + ".",
      big: decPart.slice(0, 2),
      pip: decPart.slice(2, 3),
    };
  }

  // Standard: 1.06427 → whole="1.06", big="42", pip="7"
  return {
    whole: intPart + "." + decPart.slice(0, 2),
    big: decPart.slice(2, 4),
    pip: decPart.slice(4, 5),
  };
}

/**
 * Format an FX notional amount compactly: "1M", "500K", etc.
 */
export function formatFxAmount(amount: number): string {
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
