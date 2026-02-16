"use client";

import { useState, useEffect } from "react";
import { useTerminalState } from "@/hooks/use-terminal-state";
import { ConnectionStatus } from "@/components/shared/connection-status";
import { useFxRates } from "@/hooks/use-fx-rates";
import { Button } from "@/components/ui/button";
import { Settings, Lock, Zap, LogOut, Wallet, Shield, Volume2, VolumeX, TrendingUp, FileCode } from "lucide-react";
import { BalanceModal } from "@/components/terminal/balance-modal";
import { AboutMeModal } from "@/components/terminal/about-me-modal";
import { RiskDashboardModal } from "@/components/terminal/risk-dashboard-modal";
import { PnlSummaryModal } from "@/components/terminal/pnl-summary-modal";
import { FixMessageViewer } from "@/components/terminal/fix-message-viewer";
import { usePositions } from "@/hooks/use-positions";
import { usePnlTracker } from "@/hooks/use-pnl-tracker";

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs text-muted-foreground" aria-label="UTC time">
      {time} UTC
    </span>
  );
}

export function TerminalHeader() {
  const [showBalances, setShowBalances] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showRisk, setShowRisk] = useState(false);
  const [showPnl, setShowPnl] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const { screenLocked, setScreenLocked, volatileMarket, setVolatileMarket, provider, audioEnabled, setAudioEnabled } =
    useTerminalState();
  const { positions } = usePositions();
  const pnl = usePnlTracker(positions);
  const { connected, latency, reconnecting, reconnectAttempt } = useFxRates("All");
  const tradeDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="flex flex-col border-b border-marex-border-subtle bg-marex-bg-panel">
      {/* Row 1: Logo + info */}
      <div className="flex h-9 items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-marex-accent-pink">
            <span className="text-[11px] font-bold text-white">FX</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            MarexFX <span className="text-xs font-normal text-muted-foreground">Demo</span>
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <button
            className="hover:text-foreground cursor-pointer"
            onClick={() => setShowAboutMe(true)}
          >
            support@marexfx.demo
          </button>
          <span className="hidden sm:inline">|</span>
          <button
            className="hidden sm:inline-block animate-gradient-shift bg-gradient-to-r from-marex-accent-pink via-marex-accent-purple to-marex-accent-pink bg-[length:200%_auto] bg-clip-text text-transparent font-medium hover:brightness-125 transition-all cursor-pointer"
            onClick={() => setShowAboutMe(true)}
          >
            Danil Chernyshev
          </button>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">MarexFX Corp</span>
          <span>|</span>
          <span>{tradeDate}</span>
          <LiveClock />
          <button className="text-muted-foreground hover:text-foreground" aria-label="Logout">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Controls */}
      <div className="flex h-8 items-center justify-between border-t border-marex-border-subtle px-3">
        <div className="flex items-center space-x-2">
          <Button variant="terminalGhost" size="xs">
            <Settings className="mr-1 h-3 w-3" />
            Settings
          </Button>

          <button
            data-learn="screen-lock"
            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-xs transition-colors ${
              screenLocked
                ? "bg-marex-warning/20 text-marex-warning"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setScreenLocked(!screenLocked)}
          >
            <Lock className="h-3 w-3" />
            <span>Screen Lock {screenLocked ? "ON" : "OFF"}</span>
          </button>

          <button
            data-learn="volatile-market"
            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-xs transition-colors ${
              volatileMarket
                ? "bg-marex-sell/20 text-marex-sell"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setVolatileMarket(!volatileMarket)}
          >
            <Zap className="h-3 w-3" />
            <span>Volatile Market {volatileMarket ? "ON" : "OFF"}</span>
          </button>

          <button
            data-learn="audio-alerts"
            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-xs transition-colors ${
              audioEnabled
                ? "text-muted-foreground hover:text-foreground"
                : "bg-marex-sell/20 text-marex-sell"
            }`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? "Mute audio alerts" : "Unmute audio alerts"}
          >
            {audioEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            <span>{audioEnabled ? "Audio" : "Muted"}</span>
          </button>

          <span className="rounded bg-marex-bg-elevated px-2 py-0.5 text-xs text-muted-foreground">
            Provider: <span className="font-medium text-foreground">{provider}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            data-learn="pnl-summary"
            className="flex items-center space-x-1 rounded px-2 py-0.5 text-xs hover:bg-marex-bg-elevated transition-colors cursor-pointer"
            onClick={() => setShowPnl(true)}
            title="View P&L Summary"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-muted-foreground">P&L</span>
            <span className={`font-mono font-semibold ${pnl.totalPnl >= 0 ? "text-marex-buy" : "text-marex-sell"}`}>
              {pnl.totalPnl >= 0 ? "+" : ""}{Math.abs(pnl.totalPnl) >= 1_000_000 ? `${(pnl.totalPnl / 1_000_000).toFixed(2)}M` : Math.abs(pnl.totalPnl) >= 1_000 ? `${(pnl.totalPnl / 1_000).toFixed(1)}K` : pnl.totalPnl.toFixed(2)}
            </span>
          </button>
          <Button variant="offAll" size="xs" data-learn="off-all">
            OFF ALL ORG
          </Button>
          <Button variant="terminalGhost" size="xs" data-learn="fix-protocol" onClick={() => setShowFix(true)}>
            <FileCode className="mr-1 h-3 w-3" />
            FIX
          </Button>
          <Button variant="terminalGhost" size="xs" data-learn="risk-dashboard" onClick={() => setShowRisk(true)}>
            <Shield className="mr-1 h-3 w-3" />
            Risk
          </Button>
          <Button variant="terminalGhost" size="xs" data-learn="account-balances" onClick={() => setShowBalances(true)}>
            <Wallet className="mr-1 h-3 w-3" />
            View Balances
          </Button>
          <span data-learn="connection-status">
            <ConnectionStatus connected={connected} latency={latency} reconnecting={reconnecting} reconnectAttempt={reconnectAttempt} />
          </span>
        </div>
      </div>

      <BalanceModal open={showBalances} onClose={() => setShowBalances(false)} />
      <AboutMeModal open={showAboutMe} onClose={() => setShowAboutMe(false)} />
      <RiskDashboardModal open={showRisk} onClose={() => setShowRisk(false)} />
      <PnlSummaryModal open={showPnl} onClose={() => setShowPnl(false)} />
      <FixMessageViewer open={showFix} onClose={() => setShowFix(false)} />
    </header>
  );
}
