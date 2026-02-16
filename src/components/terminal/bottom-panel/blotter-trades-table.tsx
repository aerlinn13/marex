"use client";

import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { formatDateTime, formatCompactCurrency, formatRate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlotterTradesTableProps {
  filterText: string;
}

function statusVariant(status: string) {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "Pending":
      return "warning" as const;
    case "Failed":
      return "destructive" as const;
    case "Processing":
      return "processing" as const;
    default:
      return "secondary" as const;
  }
}

export function BlotterTradesTable({ filterText }: BlotterTradesTableProps) {
  const filtered = MOCK_TRANSACTIONS.filter((t) => {
    if (!filterText) return true;
    const search = filterText.toLowerCase();
    return (
      t.reference.toLowerCase().includes(search) ||
      t.currencyPair.toLowerCase().includes(search) ||
      t.counterparty.toLowerCase().includes(search) ||
      t.status.toLowerCase().includes(search)
    );
  });

  return (
    <div data-learn="blotter-trades" className="overflow-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-marex-border-subtle bg-marex-bg-elevated text-xs uppercase text-muted-foreground">
            <th className="px-3 py-1 text-left">Ref</th>
            <th className="px-3 py-1 text-left">Time</th>
            <th className="px-3 py-1 text-left">Pair</th>
            <th className="px-3 py-1 text-left">Dir</th>
            <th className="px-3 py-1 text-right">Amount</th>
            <th className="px-3 py-1 text-right">Rate</th>
            <th className="px-3 py-1 text-left">Product</th>
            <th className="px-3 py-1 text-left">Status</th>
            <th className="px-3 py-1 text-left">Counterparty</th>
          </tr>
        </thead>
        <tbody>
          {filtered.slice(0, 20).map((t) => (
            <tr
              key={t.id}
              className="border-b border-marex-border-subtle/50 transition-colors hover:bg-marex-bg-hover"
            >
              <td className="px-3 py-1 font-mono">{t.reference}</td>
              <td className="px-3 py-1 text-muted-foreground">{formatDateTime(t.timestamp)}</td>
              <td className="px-3 py-1 font-semibold">{t.currencyPair}</td>
              <td className={cn("px-3 py-1 font-medium", t.direction === "Buy" ? "text-marex-buy" : "text-marex-sell")}>
                {t.direction}
              </td>
              <td className="px-3 py-1 text-right font-mono">{formatCompactCurrency(t.notional)}</td>
              <td className="px-3 py-1 text-right font-mono">{formatRate(t.rate, t.currencyPair)}</td>
              <td className="px-3 py-1">{t.productType}</td>
              <td className="px-3 py-1">
                <Badge variant={statusVariant(t.status)} className="text-xs px-1.5 py-0">
                  {t.status}
                </Badge>
              </td>
              <td className="px-3 py-1 text-muted-foreground truncate max-w-[120px]">{t.counterparty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
