"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { TerminalTab, EspView, BlotterTab, ChartTimeframe } from "@/types";

interface TerminalState {
  selectedPair: string;
  leftTab: TerminalTab;
  espView: EspView;
  blotterTab: BlotterTab;
  chartTimeframe: ChartTimeframe;
  screenLocked: boolean;
  volatileMarket: boolean;
  provider: string;
  learningMode: boolean;
  audioEnabled: boolean;
  setSelectedPair: (pair: string) => void;
  setLeftTab: (tab: TerminalTab) => void;
  setEspView: (view: EspView) => void;
  setBlotterTab: (tab: BlotterTab) => void;
  setChartTimeframe: (tf: ChartTimeframe) => void;
  setScreenLocked: (locked: boolean) => void;
  setVolatileMarket: (volatile: boolean) => void;
  setProvider: (provider: string) => void;
  setLearningMode: (learning: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
}

const TerminalStateContext = createContext<TerminalState | null>(null);

export function TerminalStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedPair, setSelectedPair] = useState("EUR/USD");
  const [leftTab, setLeftTab] = useState<TerminalTab>("ESP");
  const [espView, setEspView] = useState<EspView>("board");
  const [blotterTab, setBlotterTab] = useState<BlotterTab>("Done Trades");
  const [chartTimeframe, setChartTimeframe] = useState<ChartTimeframe>("5m");
  const [screenLocked, setScreenLocked] = useState(false);
  const [volatileMarket, setVolatileMarket] = useState(false);
  const [provider, setProvider] = useState("ALL");
  const [learningMode, setLearningMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const value: TerminalState = {
    selectedPair,
    leftTab,
    espView,
    blotterTab,
    chartTimeframe,
    screenLocked,
    volatileMarket,
    provider,
    learningMode,
    audioEnabled,
    setSelectedPair: useCallback((p: string) => setSelectedPair(p), []),
    setLeftTab: useCallback((t: TerminalTab) => setLeftTab(t), []),
    setEspView: useCallback((v: EspView) => setEspView(v), []),
    setBlotterTab: useCallback((t: BlotterTab) => setBlotterTab(t), []),
    setChartTimeframe: useCallback((tf: ChartTimeframe) => setChartTimeframe(tf), []),
    setScreenLocked: useCallback((l: boolean) => setScreenLocked(l), []),
    setVolatileMarket: useCallback((v: boolean) => setVolatileMarket(v), []),
    setProvider: useCallback((p: string) => setProvider(p), []),
    setLearningMode: useCallback((l: boolean) => setLearningMode(l), []),
    setAudioEnabled: useCallback((e: boolean) => setAudioEnabled(e), []),
  };

  return React.createElement(TerminalStateContext.Provider, { value }, children);
}

export function useTerminalState(): TerminalState {
  const ctx = useContext(TerminalStateContext);
  if (!ctx) throw new Error("useTerminalState must be used within TerminalStateProvider");
  return ctx;
}
