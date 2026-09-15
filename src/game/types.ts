export type GameMode = "boot" | "title" | "playing" | "paused" | "over" | "scores";

export type EnemyKind = "drone" | "fighter" | "cruiser";
export type Pattern = "dive" | "sine" | "strafe" | "seek" | "weave";
export type PickupKind = "multi" | "shield" | "speed" | "life";

export type ScoreRow = { name: string; score: number; wave: number };

export type HudSnapshot = {
  mode: GameMode;
  score: number;
  lives: number;
  wave: number;
  combo: number;
  multi: number;
  shield: number;
  speedLeft: number;
  ready: boolean;
  muted: boolean;
  shakeOn: boolean;
  lastScore: number;
  isHigh: boolean;
  initials: string;
  scores: ScoreRow[];
};

export type Vec = { x: number; y: number };

export type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  fireCd: number;
  invuln: number;
  flash: number;
  lives: number;
  multi: number;
  shield: number;
  speedT: number;
  tilt: number;
};

export type Bullet = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  ttl: number;
  frame: number;
  fromPlayer: boolean;
};

export type Enemy = {
  alive: boolean;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  fireCd: number;
  age: number;
  phase: number;
  pattern: Pattern;
  holdY: number;
  baseSpeed: number;
  flash: number;
  score: number;
  drop: number;
};

export type Pickup = {
  alive: boolean;
  kind: PickupKind;
  x: number;
  y: number;
  vy: number;
  age: number;
};

export type Particle = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
};

export type Flash = {
  alive: boolean;
  x: number;
  y: number;
  age: number;
  max: number;
};

export type Blast = {
  alive: boolean;
  x: number;
  y: number;
  age: number;
  max: number;
  size: number;
};

export type Floater = {
  alive: boolean;
  x: number;
  y: number;
  vy: number;
  age: number;
  max: number;
  text: string;
  color: string;
};
