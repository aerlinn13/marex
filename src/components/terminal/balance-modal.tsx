"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MOCK_BALANCES } from "@/lib/mock-data";
import { formatFxAmount } from "@/lib/formatters";

interface BalanceModalProps {
  open: boolean;
  onClose: () => void;
}

export function BalanceModal({ open, onClose }: BalanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto border-marex-border-subtle bg-marex-bg-panel">
        <DialogHeader>
          <DialogTitle className="text-base text-foreground">
            Account Balances
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Currency balances across all accounts
          </DialogDescription>
        </DialogHeader>

        <div className="rounded border border-marex-border-subtle overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-marex-bg-elevated text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Currency</th>
                <th className="px-3 py-2 text-right font-medium">Available</th>
                <th className="px-3 py-2 text-right font-medium">Reserved</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BALANCES.map((b) => (
                <tr
                  key={b.currency}
                  className="border-t border-marex-border-subtle hover:bg-marex-bg-elevated/50 transition-colors"
                >
                  <td className="px-3 py-1.5 font-medium text-foreground">
                    {b.currency}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-foreground">
                    {formatFxAmount(b.available)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                    {formatFxAmount(b.reserved)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono font-semibold text-foreground">
                    {formatFxAmount(b.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
