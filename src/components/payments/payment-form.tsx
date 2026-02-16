"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentFormSchema, type PaymentFormSchema } from "@/lib/validators";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCurrencyPairSymbols } from "@/lib/currency-pairs";
import { formatRate, formatCurrency } from "@/lib/formatters";
import { useFxRates } from "@/hooks/use-fx-rates";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function PaymentForm() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingData, setPendingData] = useState<PaymentFormSchema | null>(null);
  const { ratesMap } = useFxRates("All");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormSchema>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      productType: undefined,
      direction: undefined,
      currencyPair: "",
      amount: undefined,
      valueDate: "",
      settlementType: undefined,
      counterparty: "",
    },
  });

  const watchedPair = watch("currencyPair");
  const liveRate = watchedPair ? ratesMap.get(watchedPair) : null;

  function onPreSubmit(data: PaymentFormSchema) {
    setPendingData(data);
    setConfirmOpen(true);
  }

  async function onConfirm() {
    if (!pendingData) return;
    setIsSubmitting(true);
    setConfirmOpen(false);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      const result = await res.json();
      toast({
        title: "Payment submitted",
        description: `Reference: ${result.reference}`,
        variant: "success",
      });
      reset();
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setPendingData(null);
    }
  }

  const pairs = getCurrencyPairSymbols();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">New Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onPreSubmit)}
            className="grid gap-6 sm:grid-cols-2"
            noValidate
          >
            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select
                onValueChange={(v) =>
                  setValue("productType", v as PaymentFormSchema["productType"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="productType" aria-describedby="productType-error">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {(["Spot", "Forward", "Swap", "NDF"] as const).map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productType && (
                <p id="productType-error" className="text-sm text-destructive" role="alert">
                  {errors.productType.message}
                </p>
              )}
            </div>

            {/* Direction */}
            <div className="space-y-2">
              <Label htmlFor="direction">Direction</Label>
              <Select
                onValueChange={(v) =>
                  setValue("direction", v as PaymentFormSchema["direction"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="direction" aria-describedby="direction-error">
                  <SelectValue placeholder="Buy / Sell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buy">Buy</SelectItem>
                  <SelectItem value="Sell">Sell</SelectItem>
                </SelectContent>
              </Select>
              {errors.direction && (
                <p id="direction-error" className="text-sm text-destructive" role="alert">
                  {errors.direction.message}
                </p>
              )}
            </div>

            {/* Currency Pair */}
            <div className="space-y-2">
              <Label htmlFor="currencyPair">Currency Pair</Label>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={(v) =>
                    setValue("currencyPair", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="currencyPair" aria-describedby="currencyPair-error">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {pairs.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {liveRate && (
                  <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-mono text-foreground">
                    {formatRate(liveRate.mid, liveRate.symbol)}
                  </span>
                )}
              </div>
              {errors.currencyPair && (
                <p id="currencyPair-error" className="text-sm text-destructive" role="alert">
                  {errors.currencyPair.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1,000 — 50,000,000"
                aria-describedby="amount-error"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p id="amount-error" className="text-sm text-destructive" role="alert">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Value Date */}
            <div className="space-y-2">
              <Label htmlFor="valueDate">Value Date</Label>
              <Input
                id="valueDate"
                type="date"
                aria-describedby="valueDate-error"
                {...register("valueDate")}
              />
              {errors.valueDate && (
                <p id="valueDate-error" className="text-sm text-destructive" role="alert">
                  {errors.valueDate.message}
                </p>
              )}
            </div>

            {/* Settlement Type */}
            <div className="space-y-2">
              <Label htmlFor="settlementType">Settlement Type</Label>
              <Select
                onValueChange={(v) =>
                  setValue("settlementType", v as PaymentFormSchema["settlementType"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="settlementType" aria-describedby="settlementType-error">
                  <SelectValue placeholder="Select settlement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gross">Gross</SelectItem>
                  <SelectItem value="Net">Net</SelectItem>
                  <SelectItem value="PVP">PVP</SelectItem>
                </SelectContent>
              </Select>
              {errors.settlementType && (
                <p id="settlementType-error" className="text-sm text-destructive" role="alert">
                  {errors.settlementType.message}
                </p>
              )}
            </div>

            {/* Counterparty */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="counterparty">Counterparty</Label>
              <Input
                id="counterparty"
                placeholder="e.g. Deutsche Bank AG"
                aria-describedby="counterparty-error"
                {...register("counterparty")}
              />
              {errors.counterparty && (
                <p id="counterparty-error" className="text-sm text-destructive" role="alert">
                  {errors.counterparty.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => reset()}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Please review the payment details before submitting.
            </DialogDescription>
          </DialogHeader>
          {pendingData && (
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">{pendingData.productType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Direction</span>
                <span className="font-medium">{pendingData.direction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency Pair</span>
                <span className="font-medium">{pendingData.currencyPair}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(pendingData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Value Date</span>
                <span className="font-medium">{pendingData.valueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Settlement</span>
                <span className="font-medium">{pendingData.settlementType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Counterparty</span>
                <span className="font-medium">{pendingData.counterparty}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Confirm & Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
