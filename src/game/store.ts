import { create } from "zustand";
import type { HudSnapshot } from "./types";

const initial: HudSnapshot = {
  mode: "title",
  score: 0,
  lives: 3,
  wave: 1,
  combo: 0,
  multi: 0,
  shield: 0,
  speedLeft: 0,
  ready: false,
  muted: false,
  shakeOn: true,
  lastScore: 0,
  isHigh: false,
  initials: "AAA",
  scores: [],
};

export const useHud = create<HudSnapshot>(() => initial);
