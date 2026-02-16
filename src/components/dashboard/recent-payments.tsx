"use client";

import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatDateTime } from "@/lib/formatters";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentPaymentsProps {
  payments: Transaction[];
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

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Payments</CardTitle>
        <Link
          href="/transactions"
          className="flex items-center space-x-1 text-sm text-marex-accent-pink hover:underline"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {payment.reference}
                  </span>
                  <Badge variant={statusVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {payment.currencyPair} · {payment.direction} · {formatDateTime(payment.timestamp)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatCompactCurrency(payment.notional)}
                </p>
                <p className="text-xs text-muted-foreground">{payment.productType}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
