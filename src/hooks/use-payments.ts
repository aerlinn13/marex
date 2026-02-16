"use client";

import { useState, useCallback } from "react";
import { Transaction, PaymentFormData } from "@/types";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export function usePayments() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPayment = useCallback(
    async (data: PaymentFormData): Promise<Transaction> => {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        reference: `MRX-${Math.floor(Math.random() * 900000 + 100000)}`,
        timestamp: new Date().toISOString(),
        productType: data.productType,
        direction: data.direction,
        currencyPair: data.currencyPair,
        notional: data.amount,
        rate: 0, // Would come from server
        status: "Processing",
        counterparty: data.counterparty,
        valueDate: data.valueDate,
        settlementDate: data.valueDate,
        settlementType: data.settlementType,
      };

      setTransactions((prev) => [newTransaction, ...prev]);
      setIsSubmitting(false);

      return newTransaction;
    },
    []
  );

  return { transactions, submitPayment, isSubmitting };
}
