export const WORLD_W = 480;
export const WORLD_H_MIN = 720;
export const WORLD_H_MAX = 920;

export const STEP = 1 / 60;
export const MAX_STEPS = 5;
export const DT_CAP = 0.1;

export const PLAYER_SPEED = 320;
export const PLAYER_SPEED_BOOST = 1.42;
export const PLAYER_RADIUS = 16;
export const PLAYER_FIRE = 0.13;
export const PLAYER_INVULN = 1.8;
export const LIVES_START = 3;

export const BULLET_SPEED = 560;
export const ENEMY_BULLET_SPEED = 210;

export const POOL = {
  playerBullets: 96,
  enemyBullets: 128,
  enemies: 48,
  pickups: 10,
  particles: 220,
  flashes: 18,
  blasts: 16,
  floats: 24,
} as const;

export const SCORE = {
  drone: 120,
  fighter: 280,
  cruiser: 900,
} as const;

export const COLORS = {
  bg: "#070910",
  fg: "#e6ebf4",
  muted: "#8a92a6",
  primary: "#4de2c8",
  danger: "#ff5c7a",
  starFar: "#6a7388",
  starMid: "#b7c0d4",
  starNear: "#e6ebf4",
} as const;
