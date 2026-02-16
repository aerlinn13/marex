"use client";

import { formatRateParts } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  rate: number;
  pair: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: { whole: "text-xs", big: "text-sm", pip: "text-[11px]" },
  md: { whole: "text-sm", big: "text-lg", pip: "text-xs" },
  lg: { whole: "text-base", big: "text-2xl", pip: "text-sm" },
};

export function PriceDisplay({ rate, pair, size = "md", className }: PriceDisplayProps) {
  const { whole, big, pip } = formatRateParts(rate, pair);
  const s = sizeClasses[size];

  return (
    <span data-learn="price-display" className={cn("font-mono inline-flex items-baseline", className)}>
      <span className={s.whole}>{whole}</span>
      <span className={cn(s.big, "font-bold")}>{big}</span>
      <sup className={cn(s.pip, "ml-px")}>{pip}</sup>
    </span>
  );
}
