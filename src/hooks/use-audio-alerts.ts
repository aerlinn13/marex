"use client";

import { useCallback, useRef } from "react";

type AlertType = "fill" | "reject" | "risk";

const TONES: Record<AlertType, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  fill:   { frequency: 880, duration: 0.12, type: "sine",     gain: 0.15 },
  reject: { frequency: 220, duration: 0.25, type: "sawtooth", gain: 0.12 },
  risk:   { frequency: 440, duration: 0.3,  type: "triangle", gain: 0.18 },
};

export function useAudioAlerts(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: AlertType) => {
      if (!enabled) return;
      try {
        const ctx = getContext();
        const tone = TONES[type];

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = tone.type;
        osc.frequency.setValueAtTime(tone.frequency, ctx.currentTime);

        // For reject, add a quick frequency sweep down
        if (type === "reject") {
          osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + tone.duration);
        }

        // For risk, add a pulsing effect (two beeps)
        if (type === "risk") {
          gainNode.gain.setValueAtTime(tone.gain, ctx.currentTime);
          gainNode.gain.setValueAtTime(0, ctx.currentTime + 0.1);
          gainNode.gain.setValueAtTime(tone.gain, ctx.currentTime + 0.15);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + tone.duration);
        } else {
          gainNode.gain.setValueAtTime(tone.gain, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + tone.duration);
        }

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + tone.duration + 0.05);
      } catch {
        // Silently fail if audio context not available
      }
    },
    [enabled, getContext]
  );

  return { play };
}
