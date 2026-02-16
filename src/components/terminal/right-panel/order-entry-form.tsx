"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormSchema } from "@/lib/validators";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { useOrders } from "@/hooks/use-orders";
import { useFxRates } from "@/hooks/use-fx-rates";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceDisplay } from "../shared/price-display";
import { PanelHeader } from "../shared/panel-header";
import { TradeConfirmationDialog } from "./trade-confirmation-dialog";
import { getCurrencyPairSymbols } from "@/lib/currency-pairs";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { OrderType, OrderTimeInForce } from "@/types";

interface OrderEntryFormProps {
  imperativeRef?: MutableRefObject<{ setDirection: (d: "Buy" | "Sell") => void; submit: () => void } | null>;
  cancelAllRef?: MutableRefObject<(() => void) | null>;
}

export function OrderEntryForm({ imperativeRef, cancelAllRef }: OrderEntryFormProps) {
  const { selectedPair } = useTerminalState();
  const { placeOrder, cancelAllOrders } = useOrders();
  const { ratesMap } = useFxRates("All");
  const { toast } = useToast();
  const rate = ratesMap.get(selectedPair);
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<OrderFormSchema | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      pair: selectedPair,
      direction: "Buy",
      type: "LIMIT",
      amount: 1_000_000,
      currency: selectedPair.split("/")[0],
      price: rate?.mid || 0,
      tif: "GTC",
      notes: "",
    },
  });

  const watchedPrice = watch("price");
  const watchedType = watch("type");
  const watchedDirection = watch("direction");

  // Expose imperative methods for keyboard shortcuts
  useEffect(() => {
    if (imperativeRef) {
      imperativeRef.current = {
        setDirection: (d: "Buy" | "Sell") => {
          setValue("direction", d);
          // Focus the amount input
          const amountInput = document.getElementById("order-amount");
          amountInput?.focus();
        },
        submit: () => {
          formRef.current?.requestSubmit();
        },
      };
    }
    if (cancelAllRef) {
      cancelAllRef.current = cancelAllOrders;
    }
    return () => {
      if (imperativeRef) imperativeRef.current = null;
      if (cancelAllRef) cancelAllRef.current = null;
    };
  }, [imperativeRef, cancelAllRef, setValue, cancelAllOrders]);

  function adjustPrice(delta: number) {
    const isJpy = selectedPair.includes("JPY");
    const step = isJpy ? 0.01 : 0.0001;
    setValue("price", Number((watchedPrice + delta * step).toFixed(isJpy ? 3 : 5)));
  }

  function onSubmit(data: OrderFormSchema) {
    // Show confirmation dialog instead of placing immediately
    setPendingData(data);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    if (!pendingData) return;
    const order = placeOrder({
      pair: pendingData.pair,
      direction: pendingData.direction,
      type: pendingData.type as OrderType,
      amount: pendingData.amount,
      currency: pendingData.currency,
      price: pendingData.price,
      tif: pendingData.tif as OrderTimeInForce,
      notes: pendingData.notes,
    });

    toast({
      title: "Order placed",
      description: `${order.direction} ${order.pair} — ${order.id}`,
      variant: "success",
    });

    reset({
      pair: selectedPair,
      direction: "Buy",
      type: "LIMIT",
      amount: 1_000_000,
      currency: selectedPair.split("/")[0],
      price: rate?.mid || 0,
      tif: "GTC",
      notes: "",
    });

    setConfirmOpen(false);
    setPendingData(null);
  }

  function handleCancelConfirm() {
    setConfirmOpen(false);
    setPendingData(null);
  }

  const pairs = getCurrencyPairSymbols();

  return (
    <div className="flex flex-col">
      <PanelHeader title="Order Entry" />
      <form ref={formRef} data-learn="order-entry" onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-3" noValidate>
        {/* Direction toggle */}
        <div className="flex space-x-1">
          {(["Buy", "Sell"] as const).map((d) => (
            <Button
              key={d}
              type="button"
              variant={watchedDirection === d ? (d === "Buy" ? "default" : "destructive") : "terminalGhost"}
              size="xs"
              className="flex-1"
              onClick={() => setValue("direction", d)}
            >
              {d}
            </Button>
          ))}
        </div>

        {/* Type toggle */}
        <div className="flex space-x-1">
          {(["LIMIT", "STOP", "TWAP", "VWAP"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant={watchedType === t ? "secondary" : "terminalGhost"}
              size="xs"
              className="flex-1"
              data-learn={t === "LIMIT" ? "limit-order" : t === "STOP" ? "stop-order" : undefined}
              onClick={() => setValue("type", t)}
            >
              {t}
            </Button>
          ))}
        </div>

        {/* Algo parameters (for TWAP/VWAP) */}
        {(watchedType === "TWAP" || watchedType === "VWAP") && (
          <div data-learn="algo-orders" className="rounded border border-marex-border-subtle bg-marex-bg-elevated p-2 space-y-2">
            <div className="flex items-center space-x-1">
              <span className="inline-flex items-center rounded bg-marex-accent-purple/20 px-1.5 py-0.5 text-[10px] font-semibold text-marex-accent-purple">
                {watchedType}
              </span>
              <span className="text-[10px] text-muted-foreground">Algorithmic Execution</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-[10px] text-muted-foreground">Slices</Label>
                <Input type="number" defaultValue={10} className="h-6 text-xs font-mono" readOnly />
              </div>
              <div className="space-y-0.5">
                <Label className="text-[10px] text-muted-foreground">Duration</Label>
                <Input type="text" defaultValue="30m" className="h-6 text-xs font-mono" readOnly />
              </div>
              {watchedType === "VWAP" && (
                <div className="col-span-2 space-y-0.5">
                  <Label className="text-[10px] text-muted-foreground">Participation Rate</Label>
                  <Input type="text" defaultValue="25%" className="h-6 text-xs font-mono" readOnly />
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground italic">
              {watchedType === "TWAP"
                ? "Splits order into equal time-weighted slices over duration."
                : "Executes proportionally to volume, targeting VWAP benchmark."}
            </p>
          </div>
        )}

        {/* Live prices */}
        {rate && (
          <div className="flex items-center justify-between rounded bg-marex-bg-elevated px-2 py-1.5">
            <div className="text-center">
              <span className="text-[11px] uppercase text-marex-sell/70">Bid</span>
              <PriceDisplay rate={rate.bid} pair={selectedPair} size="sm" className="text-marex-sell block" />
            </div>
            <div className="text-center">
              <span className="text-[11px] uppercase text-marex-buy/70">Ask</span>
              <PriceDisplay rate={rate.ask} pair={selectedPair} size="sm" className="text-marex-buy block" />
            </div>
          </div>
        )}

        {/* Pair */}
        <div data-learn="currency-pair" className="space-y-1">
          <Label htmlFor="order-pair" className="text-xs text-muted-foreground">Currency Pair</Label>
          <Select
            defaultValue={selectedPair}
            onValueChange={(v) => {
              setValue("pair", v, { shouldValidate: true });
              setValue("currency", v.split("/")[0]);
            }}
          >
            <SelectTrigger id="order-pair" className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pairs.map((p) => (
                <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pair && <p className="text-xs text-destructive">{errors.pair.message}</p>}
        </div>

        {/* Amount */}
        <div data-learn="order-amount" className="space-y-1">
          <Label htmlFor="order-amount" className="text-xs text-muted-foreground">Amount</Label>
          <Input
            id="order-amount"
            type="number"
            className="h-8 text-xs font-mono"
            {...register("amount", { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
        </div>

        {/* Price with +/- arrows */}
        <div data-learn="order-price" className="space-y-1">
          <Label htmlFor="order-price" className="text-xs text-muted-foreground">{watchedType} Price</Label>
          <div className="flex items-center space-x-1">
            <Input
              id="order-price"
              type="number"
              step="any"
              className="h-8 flex-1 text-xs font-mono"
              {...register("price", { valueAsNumber: true })}
            />
            <div className="flex flex-col">
              <button
                type="button"
                className="rounded-t bg-marex-bg-elevated px-1 py-0 text-muted-foreground hover:text-foreground"
                onClick={() => adjustPrice(1)}
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                className="rounded-b bg-marex-bg-elevated px-1 py-0 text-muted-foreground hover:text-foreground"
                onClick={() => adjustPrice(-1)}
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        {/* TIF */}
        <div data-learn="tif-selector" className="space-y-1">
          <Label htmlFor="order-tif" className="text-xs text-muted-foreground">Time in Force</Label>
          <Select defaultValue="GTC" onValueChange={(v) => setValue("tif", v as OrderTimeInForce)}>
            <SelectTrigger id="order-tif" className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["GTC", "IOC", "FOK", "GTD", "DAY"] as const).map((t) => (
                <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <Label htmlFor="order-notes" className="text-xs text-muted-foreground">Notes</Label>
          <Input
            id="order-notes"
            className="h-8 text-xs"
            placeholder="Optional notes..."
            {...register("notes")}
          />
        </div>

        {/* Submit */}
        <Button type="submit" variant="accentPink" className="w-full" size="sm" data-learn="place-order">
          PLACE ORDER
        </Button>
      </form>

      <TradeConfirmationDialog
        open={confirmOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
        data={pendingData}
        rate={rate}
      />
    </div>
  );
}
