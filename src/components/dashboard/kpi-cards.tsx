"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react";

interface KpiCardsProps {
  totalToday: number;
  pending: number;
  completed: number;
  failed: number;
}

const kpis = [
  { key: "totalToday", label: "Total Payments Today", icon: DollarSign, color: "text-marex-accent-pink" },
  { key: "pending", label: "Pending", icon: Clock, color: "text-yellow-400" },
  { key: "completed", label: "Completed", icon: CheckCircle2, color: "text-green-400" },
  { key: "failed", label: "Failed", icon: XCircle, color: "text-red-400" },
] as const;

export function KpiCards({ totalToday, pending, completed, failed }: KpiCardsProps) {
  const values = { totalToday, pending, completed, failed };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{values[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
