"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatCompactCurrency, formatRate } from "@/lib/formatters";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("reference")}</span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatDateTime(row.getValue("timestamp")),
  },
  {
    accessorKey: "productType",
    header: "Product",
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "currencyPair",
    header: "Pair",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("currencyPair")}</span>
    ),
  },
  {
    accessorKey: "direction",
    header: "Direction",
    cell: ({ row }) => {
      const dir = row.getValue("direction") as string;
      return (
        <span className={dir === "Buy" ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
          {dir}
        </span>
      );
    },
  },
  {
    accessorKey: "notional",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatCompactCurrency(row.getValue("notional")),
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const rate = row.getValue("rate") as number;
      const pair = row.original.currencyPair;
      return <span className="font-mono text-sm">{formatRate(rate, pair)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge variant={statusVariant(status)}>{status}</Badge>;
    },
  },
];
