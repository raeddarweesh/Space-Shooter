import type { ScoreRow } from "./types";

const KEY = "aphelion-save";
const VERSION = 1;

export type SaveData = {
  version: number;
  scores: ScoreRow[];
  muted: boolean;
  shakeOn: boolean;
};

const DEFAULT_SCORES: ScoreRow[] = [
  { name: "NOVA", score: 48600, wave: 11 },
  { name: "RAIL", score: 32100, wave: 8 },
  { name: "LYNX", score: 24400, wave: 7 },
  { name: "ORIN", score: 16800, wave: 5 },
  { name: "VEX", score: 9200, wave: 4 },
];

const DEFAULT_SAVE: SaveData = {
  version: VERSION,
  scores: DEFAULT_SCORES,
  muted: false,
  shakeOn: true,
};

function migrate(raw: Partial<SaveData> & { version?: number }): SaveData {
  const next: SaveData = {
    ...DEFAULT_SAVE,
    ...raw,
    scores: Array.isArray(raw.scores) && raw.scores.length ? raw.scores : DEFAULT_SCORES,
    muted: Boolean(raw.muted),
    shakeOn: raw.shakeOn !== false,
    version: VERSION,
  };
  next.scores = next.scores
    .filter((s) => s && typeof s.name === "string" && typeof s.score === "number")
    .slice(0, 8);
  return next;
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SAVE, scores: [...DEFAULT_SCORES] };
    return migrate(JSON.parse(raw) as Partial<SaveData>);
  } catch {
    return { ...DEFAULT_SAVE, scores: [...DEFAULT_SCORES] };
  }
}

export function writeSave(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, version: VERSION }));
  } catch {
    /* private mode / quota */
  }
}

export function qualifies(scores: ScoreRow[], score: number) {
  if (scores.length < 8) return score > 0;
  return score > (scores[scores.length - 1]?.score ?? 0);
}

export function insertScore(scores: ScoreRow[], row: ScoreRow) {
  return [...scores, row].sort((a, b) => b.score - a.score).slice(0, 8);
}
