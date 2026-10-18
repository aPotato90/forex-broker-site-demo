"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SEED, createMarket, stepMarket, type Quote } from "@/lib/forex/market";
import { useDocumentHidden, usePrefersReducedMotion } from "./use-media";

export type PauseReason = "user" | "hidden" | "reduced-motion" | null;

interface Options {
  symbols?: readonly string[];
  seed?: number;
  historyLength?: number;
  intervalMs?: number;
}

export interface SimulatedMarket {
  quotes: Quote[];
  running: boolean;
  pauseReason: PauseReason;
  /** True when the user has paused updates (the "Pause updates" toggle is pressed). */
  paused: boolean;
  togglePaused: () => void;
  intervalMs: number;
}

/**
 * Drives the seeded engine on a timer in the browser. Starts from the same deterministic state
 * the server rendered, then pauses automatically when the tab is hidden or the user prefers
 * reduced motion (they can still opt back in with the toggle).
 */
export function useSimulatedMarket({
  symbols,
  seed = DEFAULT_SEED,
  historyLength,
  intervalMs = 2000,
}: Options = {}): SimulatedMarket {
  const [state, setState] = useState(() => createMarket({ seed, symbols, historyLength }));
  const [userPaused, setUserPaused] = useState(false);
  const [allowMotion, setAllowMotion] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const hidden = useDocumentHidden();

  const motionBlocked = reducedMotion && !allowMotion;
  const pauseReason: PauseReason = userPaused
    ? "user"
    : motionBlocked
      ? "reduced-motion"
      : hidden
        ? "hidden"
        : null;
  const running = pauseReason === null;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setState(stepMarket), intervalMs);
    return () => window.clearInterval(id);
  }, [running, intervalMs]);

  const paused = userPaused || motionBlocked;

  function togglePaused() {
    if (paused) {
      setUserPaused(false);
      if (reducedMotion) setAllowMotion(true);
    } else {
      setUserPaused(true);
    }
  }

  return { quotes: state.quotes, running, pauseReason, paused, togglePaused, intervalMs };
}
