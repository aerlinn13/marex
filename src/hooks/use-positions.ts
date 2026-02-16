"use client";

import { useState, useCallback } from "react";
import type { Position } from "@/types";
import { generateMockPositions } from "@/lib/mock-data";

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>(() => generateMockPositions(10));

  const closePosition = useCallback((id: string) => {
    setPositions((prev) =>
      prev.map((p) =>
        p.id === id && p.status === "Open"
          ? { ...p, status: "Closed" as const }
          : p
      )
    );
  }, []);

  return { positions, closePosition };
}
