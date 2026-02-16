"use client";

import { EspTile } from "./esp-tile";
import { useTerminalState } from "@/hooks/use-terminal-state";

const DEFAULT_ESP_TILES = [
  { pair: "EUR/USD", amount: 1_000_000, currency: "EUR" },
  { pair: "GBP/USD", amount: 1_000_000, currency: "GBP" },
  { pair: "USD/JPY", amount: 1_000_000, currency: "USD" },
  { pair: "AUD/USD", amount: 500_000, currency: "AUD" },
];

export function EspBoard() {
  const { setSelectedPair } = useTerminalState();

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {DEFAULT_ESP_TILES.map((tile) => (
        <EspTile
          key={tile.pair}
          pair={tile.pair}
          amount={tile.amount}
          currency={tile.currency}
          onSelectPair={setSelectedPair}
        />
      ))}
    </div>
  );
}
