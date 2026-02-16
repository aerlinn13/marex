"use client";

import dynamic from "next/dynamic";

const TerminalShell = dynamic(
  () => import("@/components/terminal/terminal-shell").then((m) => m.TerminalShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black text-zinc-500">
        Loading terminal…
      </div>
    ),
  }
);

export default function TradingTerminalPage() {
  return <TerminalShell />;
}
