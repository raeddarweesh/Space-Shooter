import {
  BULLET_SPEED,
  COLORS,
  DT_CAP,
  ENEMY_BULLET_SPEED,
  LIVES_START,
  MAX_STEPS,
  PLAYER_FIRE,
  PLAYER_INVULN,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  PLAYER_SPEED_BOOST,
  POOL,
  SCORE,
  STEP,
  WORLD_H_MAX,
  WORLD_H_MIN,
  WORLD_W,
} from "./constants";
import { AudioBus } from "./audio";
import { Input } from "./input";
import { insertScore, loadSave, qualifies, writeSave, type SaveData } from "./save";
import { Starfield } from "./starfield";
import { drawSheet, loadSprites, type SpriteBank } from "./sprites";
import type {
  Blast,
  Bullet,
  Enemy,
  EnemyKind,
  Flash,
  Floater,
  GameMode,
  HudSnapshot,
  Particle,
  Pattern,
  Pickup,
  PickupKind,
  Player,
} from "./types";

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getX: () => number;
      getY: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
      setSteer?: (v: number) => void;
    };
  }
}

function pool<T>(n: number, make: () => T): T[] {
  return Array.from({ length: n }, make);
}

function grab<T extends { alive: boolean }>(arr: T[]): T | null {
  for (const it of arr) if (!it.alive) return it;
  return null;
}

function circ(ax: number, ay: number, ar: number, bx: number, by: number, br: number) {
  const dx = ax - bx;
  const dy = ay - by;
  const r = ar + br;
  return dx * dx + dy * dy < r * r;
}

function pickupFrame(kind: PickupKind) {
  if (kind === "multi") return 0;
  if (kind === "shield") return 1;
  if (kind === "speed") return 2;
  return 3;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: Input;
  audio = new AudioBus();
  stars = new Starfield();
  sprites: SpriteBank | null = null;
  save: SaveData;
  onHud: (s: HudSnapshot) => void;

  mode: GameMode = "title";
  ready = false;
  worldW = WORLD_W;
  worldH = 800;
  view = { scale: 1, ox: 0, oy: 0, cssW: 1, cssH: 1 };
  acc = 0;
  time = 0;
  raf = 0;
  last = 0;
  reduced = false;
  shakeOn = true;
  trauma = 0;
  freeze = 0;
  flashScreen = 0;

  player: Player = this.freshPlayer();
  score = 0;
  wave = 1;
  combo = 0;
  comboT = 0;
  lastScore = 0;
  isHigh = false;
  initials = "AAA";
  waveTime = 0;
  spawned = 0;
  spawnPlan: Array<{ t: number; kind: EnemyKind; x: number; pattern: Pattern }> = [];
  waveClearT = 0;
  announcing = 0;
  returnMode: GameMode = "title";

  playerBullets = pool(POOL.playerBullets, (): Bullet => this.emptyBullet(true));
  enemyBullets = pool(POOL.enemyBullets, (): Bullet => this.emptyBullet(false));
  enemies = pool(POOL.enemies, (): Enemy => this.emptyEnemy());
  pickups = pool(POOL.pickups, (): Pickup => ({ alive: false, kind: "multi", x: 0, y: 0, vy: 70, age: 0 }));
  particles = pool(POOL.particles, (): Particle => ({ alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 2, color: COLORS.fg }));
  flashes = pool(POOL.flashes, (): Flash => ({ alive: false, x: 0, y: 0, age: 0, max: 0.08 }));
  blasts = pool(POOL.blasts, (): Blast => ({ alive: false, x: 0, y: 0, age: 0, max: 0.4, size: 64 }));
  floats = pool(POOL.floats, (): Floater => ({ alive: false, x: 0, y: 0, vy: -40, age: 0, max: 0.8, text: "", color: COLORS.fg }));

  private lastHud = "";
  private running = false;
  private unsubResize?: () => void;
  private unsubVis?: () => void;

  constructor(canvas: HTMLCanvasElement, onHud: (s: HudSnapshot) => void) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D unavailable");
    this.ctx = ctx;
    this.onHud = onHud;
    this.save = loadSave();
    this.shakeOn = this.save.shakeOn;
    this.audio.setMuted(this.save.muted);
    this.reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    this.input = new Input(canvas, (cx, cy) => this.clientToWorld(cx, cy));
    this.layout();
    this.unsubResize = () => window.removeEventListener("resize", this.onResize);
    window.addEventListener("resize", this.onResize);
    this.unsubVis = () => document.removeEventListener("visibilitychange", this.onVis);
    document.addEventListener("visibilitychange", this.onVis);
    this.installProbe();
  }

  private onResize = () => this.layout();
  private onVis = () => {
    if (document.hidden) {
      if (this.mode === "playing") this.setMode("paused");
    } else {
      this.audio.resume();
    }
  };

  private freshPlayer(): Player {
    return {
      x: WORLD_W / 2,
      y: 680,
      vx: 0,
      vy: 0,
      radius: PLAYER_RADIUS,
      fireCd: 0,
      invuln: 0,
      flash: 0,
      lives: LIVES_START,
      multi: 0,
      shield: 0,
      speedT: 0,
      tilt: 0,
    };
  }

  private emptyBullet(fromPlayer: boolean): Bullet {
    return { alive: false, x: 0, y: 0, vx: 0, vy: 0, radius: fromPlayer ? 5 : 6, ttl: 0, frame: 0, fromPlayer };
  }

  private emptyEnemy(): Enemy {
    return {
      alive: false,
      kind: "drone",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 14,
      hp: 1,
      maxHp: 1,
      fireCd: 0,
      age: 0,
      phase: 0,
      pattern: "dive",
      holdY: 180,
      baseSpeed: 90,
      flash: 0,
      score: 100,
      drop: 0.1,
    };
  }

  async boot() {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
    try {
      const loaded = await Promise.race([loadSprites(), timeout]);
      if (loaded) this.sprites = loaded;
    } catch (err) {
      console.error(err);
    }
    this.ready = true;
    if (this.mode === "title" || this.mode === "boot") this.setMode("title");
    this.emitHud();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.emitHud();
    this.last = performance.now();
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      let dt = (now - this.last) / 1000;
      this.last = now;
      if (dt > DT_CAP) dt = DT_CAP;
      this.acc += dt;
      let steps = 0;
      while (this.acc >= STEP && steps < MAX_STEPS) {
        this.tick(STEP);
        this.acc -= STEP;
        steps += 1;
      }
      this.draw();
    };
    this.raf = requestAnimationFrame(loop);
    void this.boot();
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.input.destroy();
    this.unsubResize?.();
    this.unsubVis?.();
    if (window.__controlsTest) delete window.__controlsTest;
  }

  snapshot(): HudSnapshot {
    return {
      mode: this.mode,
      score: this.score,
      lives: this.player.lives,
      wave: this.wave,
      combo: this.combo,
      multi: this.player.multi,
      shield: this.player.shield,
      speedLeft: this.player.speedT,
      ready: this.ready,
      muted: this.save.muted,
      shakeOn: this.shakeOn,
      lastScore: this.lastScore,
      isHigh: this.isHigh,
      initials: this.initials,
      scores: this.save.scores,
    };
  }

  private emitHud() {
    const snap = this.snapshot();
    const key = JSON.stringify(snap);
    if (key === this.lastHud) return;
    this.lastHud = key;
    this.onHud(snap);
  }

  setMode(mode: GameMode) {
    this.mode = mode;
    this.emitHud();
  }

  startRun() {
    this.audio.unlock();
    this.audio.ui();
    this.resetRun();
    this.setMode("playing");
    this.announcing = 1.4;
    this.audio.wave();
  }

  pause() {
    if (this.mode === "playing") {
      this.audio.ui();
      this.setMode("paused");
    }
  }

  resume() {
    if (this.mode === "paused") {
      this.audio.unlock();
      this.audio.ui();
      this.setMode("playing");
    }
  }

  toTitle() {
    this.audio.ui();
    this.resetRun();
    this.setMode("title");
  }

  toScores() {
    this.audio.ui();
    this.returnMode = this.mode === "paused" ? "paused" : "title";
    this.setMode("scores");
  }

  backFromScores() {
    this.audio.ui();
    this.setMode(this.returnMode);
  }

  toggleMute() {
    this.save.muted = !this.save.muted;
    this.audio.setMuted(this.save.muted);
    writeSave(this.save);
    this.audio.unlock();
    if (!this.save.muted) this.audio.ui();
    this.emitHud();
  }

  toggleShake() {
    this.shakeOn = !this.shakeOn;
    this.save.shakeOn = this.shakeOn;
    writeSave(this.save);
    this.audio.ui();
    this.emitHud();
  }

  submitName(name: string) {
    const clean = (name || "AAA").replace(/[^A-Z]/gi, "").toUpperCase().padEnd(3, "A").slice(0, 3);
    this.save.scores = insertScore(this.save.scores, { name: clean, score: this.lastScore, wave: this.wave });
    writeSave(this.save);
    this.isHigh = false;
    this.audio.pickup();
    this.setMode("scores");
  }

  private resetRun() {
    this.score = 0;
    this.wave = 1;
    this.combo = 0;
    this.comboT = 0;
    this.player = this.freshPlayer();
    this.player.y = this.worldH - 90;
    this.player.x = this.worldW / 2;
    this.clearEntities();
    this.buildWave(1);
    this.waveTime = 0;
    this.spawned = 0;
    this.waveClearT = 0;
    this.trauma = 0;
    this.freeze = 0;
    this.input.pointer.moved = false;
    this.input.steerOverride = null;
  }

  private clearEntities() {
    for (const a of [
      this.playerBullets,
      this.enemyBullets,
      this.enemies,
      this.pickups,
      this.particles,
      this.flashes,
      this.blasts,
      this.floats,
    ]) {
      for (const it of a) it.alive = false;
    }
  }

  private layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.max(1, window.innerWidth);
    const cssH = Math.max(1, window.innerHeight);
    this.canvas.width = Math.floor(cssW * dpr);
    this.canvas.height = Math.floor(cssH * dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.worldW = WORLD_W;
    if (cssW >= cssH) {
      this.worldH = 800;
      const scale = Math.min(cssW / this.worldW, cssH / this.worldH);
      this.view = {
        scale,
        ox: (cssW - this.worldW * scale) / 2,
        oy: (cssH - this.worldH * scale) / 2,
        cssW,
        cssH,
      };
    } else {
      this.worldH = Math.round(Math.min(WORLD_H_MAX, Math.max(WORLD_H_MIN, WORLD_W * (cssH / cssW))));
      const scale = cssW / this.worldW;
      this.view = { scale, ox: 0, oy: (cssH - this.worldH * scale) / 2, cssW, cssH };
    }
    this.stars.rebuild(this.worldW, this.worldH);
    if (this.mode !== "playing") {
      this.player.x = this.worldW / 2;
      this.player.y = this.worldH - 90;
    }
  }

  clientToWorld(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left - this.view.ox) / this.view.scale;
    const y = (clientY - rect.top - this.view.oy) / this.view.scale;
    return { x, y };
  }

  private installProbe() {
    window.__controlsTest = {
      getYaw: () => 0,
      getX: () => this.player.x,
      getY: () => this.player.y,
      getSpeed: () => Math.hypot(this.player.vx, this.player.vy),
      setKeys: (codes) => this.input.setInjected(codes),
      setSteer: (v) => this.input.setSteer(v),
    };
  }

  private tick(dt: number) {
    this.input.sample();
    if (this.input.mutePressed) this.toggleMute();
    if (this.input.pausePressed) {
      if (this.mode === "playing") this.pause();
      else if (this.mode === "paused") this.resume();
    }

    const starSpeed = this.mode === "playing" ? 1 : this.mode === "paused" ? 0.15 : 0.45;
    this.stars.step(dt, starSpeed);
    this.time += dt;
    if (this.trauma > 0) this.trauma = Math.max(0, this.trauma - dt * 1.8);
    if (this.flashScreen > 0) this.flashScreen = Math.max(0, this.flashScreen - dt * 3);

    if (this.mode !== "playing") {
      this.animIdle(dt);
      return;
    }

    if (this.freeze > 0) {
      this.freeze -= dt;
      this.animIdle(dt);
      return;
    }

    this.stepPlayer(dt);
    this.stepWave(dt);
    this.stepEnemies(dt);
    this.stepBullets(dt);
    this.stepPickups(dt);
    this.stepFx(dt);
    this.collide();
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.combo = 0;
    }
    this.emitHud();
  }

  private animIdle(dt: number) {
    for (const p of this.particles) if (p.alive) this.stepParticle(p, dt);
    for (const b of this.blasts) if (b.alive) {
      b.age += dt;
      if (b.age >= b.max) b.alive = false;
    }
  }

  private stepPlayer(dt: number) {
    const p = this.player;
    const axis = this.input.moveAxis();
    const boost = p.speedT > 0 ? PLAYER_SPEED_BOOST : 1;
    const speed = PLAYER_SPEED * boost;
    let tx = axis.x * speed;
    let ty = axis.y * speed;

    const injecting = this.input.injected.size > 0 || this.input.steerOverride != null;
    const pointerDrive = !injecting && (this.input.pointer.active || this.input.pointer.moved);
    if (pointerDrive) {
      const k = 1 - Math.exp(-12 * dt);
      p.x += (this.input.pointer.x - p.x) * k;
      p.y += (this.input.pointer.y - p.y) * k;
      tx += axis.x * speed * 0.35;
      ty += axis.y * speed * 0.35;
    }

    const damp = 1 - Math.exp(-14 * dt);
    p.vx += (tx - p.vx) * damp;
    p.vy += (ty - p.vy) * damp;
    if (!pointerDrive || axis.x || axis.y) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    } else {
      p.vx = (this.input.pointer.x - p.x) / Math.max(dt, 0.001) * 0.15;
      p.vy = (this.input.pointer.y - p.y) / Math.max(dt, 0.001) * 0.15;
    }

    const m = 28;
    p.x = Math.max(m, Math.min(this.worldW - m, p.x));
    p.y = Math.max(m + 40, Math.min(this.worldH - m, p.y));
    p.tilt += ((p.vx / speed) * 0.28 - p.tilt) * (1 - Math.exp(-10 * dt));
    if (p.fireCd > 0) p.fireCd -= dt;
    if (p.invuln > 0) p.invuln -= dt;
    if (p.flash > 0) p.flash -= dt;
    if (p.speedT > 0) p.speedT -= dt;
    this.autoFire();
  }

  private autoFire() {
    const p = this.player;
    if (p.fireCd > 0) return;
    p.fireCd = PLAYER_FIRE * (p.speedT > 0 ? 0.85 : 1);
    const shots = this.shotPattern(p.multi);
    for (const s of shots) {
      this.spawnPlayerBullet(p.x + s.x, p.y - 20, s.a);
    }
    const fl = grab(this.flashes);
    if (fl) {
      fl.alive = true;
      fl.x = p.x;
      fl.y = p.y - 26;
      fl.age = 0;
      fl.max = 0.09;
    }
    this.audio.shoot();
  }

  private shotPattern(multi: number) {
    if (multi <= 0) return [{ x: 0, a: -Math.PI / 2 }];
    if (multi === 1) return [
      { x: -10, a: -Math.PI / 2 },
      { x: 10, a: -Math.PI / 2 },
    ];
    if (multi === 2)
      return [
        { x: 0, a: -Math.PI / 2 },
        { x: -12, a: -Math.PI / 2 - 0.16 },
        { x: 12, a: -Math.PI / 2 + 0.16 },
      ];
    return [
      { x: 0, a: -Math.PI / 2 },
      { x: -11, a: -Math.PI / 2 - 0.14 },
      { x: 11, a: -Math.PI / 2 + 0.14 },
      { x: -18, a: -Math.PI / 2 - 0.3 },
      { x: 18, a: -Math.PI / 2 + 0.3 },
    ];
  }

  private spawnPlayerBullet(x: number, y: number, angle: number) {
    const b = grab(this.playerBullets);
    if (!b) return;
    b.alive = true;
    b.x = x;
    b.y = y;
    b.vx = Math.cos(angle) * BULLET_SPEED;
    b.vy = Math.sin(angle) * BULLET_SPEED;
    b.ttl = 1.4;
    b.frame = 0;
    b.fromPlayer = true;
  }

  private spawnEnemyBullet(x: number, y: number, angle: number, speed = ENEMY_BULLET_SPEED) {
    const b = grab(this.enemyBullets);
    if (!b) return;
    b.alive = true;
    b.x = x;
    b.y = y;
    b.vx = Math.cos(angle) * speed;
    b.vy = Math.sin(angle) * speed;
    b.ttl = 4;
    b.frame = 0;
    b.fromPlayer = false;
    this.audio.enemyShoot();
  }

  private buildWave(n: number) {
    const plan: Array<{ t: number; kind: EnemyKind; x: number; pattern: Pattern }> = [];
    const drones = Math.min(14, 5 + n);
    const fighters = Math.min(8, Math.floor(n / 2));
    const cruisers = Math.min(3, Math.floor((n - 1) / 4));
    let t = 0.2;
    const col = (i: number, count: number) => 0.14 + (i % count) * ((0.86 - 0.14) / Math.max(1, count - 1));

    for (let i = 0; i < drones; i++) {
      const pattern: Pattern = n % 3 === 0 ? "weave" : n % 2 === 0 ? "sine" : "dive";
      plan.push({ t, kind: "drone", x: col(i, Math.min(6, drones)), pattern });
      t += 0.18;
    }
    t += 0.4;
    for (let i = 0; i < fighters; i++) {
      plan.push({
        t,
        kind: "fighter",
        x: col(i + 1, Math.min(5, fighters + 1)),
        pattern: i % 2 === 0 ? "strafe" : "seek",
      });
      t += 0.45;
    }
    t += 0.5;
    for (let i = 0; i < cruisers; i++) {
      plan.push({ t, kind: "cruiser", x: 0.3 + i * 0.2, pattern: "strafe" });
      t += 0.8;
    }
    if (n % 5 === 0) {
      plan.push({ t: t + 0.4, kind: "cruiser", x: 0.5, pattern: "seek" });
    }
    this.spawnPlan = plan;
    this.spawned = 0;
    this.waveTime = 0;
    this.waveClearT = 0;
    this.announcing = 1.2;
  }

  private stepWave(dt: number) {
    this.waveTime += dt;
    if (this.announcing > 0) this.announcing -= dt;
    while (this.spawned < this.spawnPlan.length && this.waveTime >= this.spawnPlan[this.spawned]!.t) {
      const s = this.spawnPlan[this.spawned]!;
      this.spawnEnemy(s.kind, s.x * this.worldW, -30, s.pattern);
      this.spawned += 1;
    }
    if (this.spawned >= this.spawnPlan.length && !this.enemies.some((e) => e.alive)) {
      this.waveClearT += dt;
      if (this.waveClearT > 1.35) {
        this.wave += 1;
        this.buildWave(this.wave);
        this.audio.wave();
        this.float(this.worldW / 2, 120, `WAVE ${this.wave}`, COLORS.primary);
      }
    }
  }

  private spawnEnemy(kind: EnemyKind, x: number, y: number, pattern: Pattern) {
    const e = grab(this.enemies);
    if (!e) return;
    const stats =
      kind === "drone"
        ? { hp: 1 + Math.floor((this.wave - 1) / 6), r: 14, speed: 95 + this.wave * 6, score: SCORE.drone, drop: 0.12, fire: 999 }
        : kind === "fighter"
          ? { hp: 3 + Math.floor(this.wave / 4), r: 18, speed: 80 + this.wave * 4, score: SCORE.fighter, drop: 0.28, fire: 1.35 }
          : { hp: 10 + this.wave * 2, r: 26, speed: 55 + this.wave * 2, score: SCORE.cruiser, drop: 0.55, fire: 1.7 };
    e.alive = true;
    e.kind = kind;
    e.x = x;
    e.y = y;
    e.vx = 0;
    e.vy = stats.speed;
    e.radius = stats.r;
    e.hp = stats.hp;
    e.maxHp = stats.hp;
    e.fireCd = 0.4 + Math.random() * 0.6;
    e.age = 0;
    e.phase = Math.random() * Math.PI * 2;
    e.pattern = pattern;
    e.holdY = 140 + Math.random() * 80;
    e.baseSpeed = stats.speed;
    e.flash = 0;
    e.score = stats.score;
    e.drop = stats.drop;
  }

  private stepEnemies(dt: number) {
    const p = this.player;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      e.age += dt;
      if (e.flash > 0) e.flash -= dt;
      switch (e.pattern) {
        case "dive":
          e.vy = e.baseSpeed;
          e.vx = Math.sin(e.age * 1.5 + e.phase) * 36;
          break;
        case "sine":
          e.vy = e.baseSpeed * 0.72;
          e.vx = Math.sin(e.age * 2.3 + e.phase) * 120;
          break;
        case "weave":
          e.vy = e.baseSpeed * 0.8;
          e.vx = Math.sin(e.age * 4.2 + e.phase) * 170;
          break;
        case "strafe":
          if (e.y < e.holdY) {
            e.vy = e.baseSpeed;
            e.vx = 0;
          } else {
            e.vy = 16;
            e.vx = Math.sin(e.age * 1.5 + e.phase) * 150;
          }
          break;
        case "seek": {
          const dx = p.x - e.x;
          const dy = p.y - e.y;
          const len = Math.hypot(dx, dy) || 1;
          const sp = e.baseSpeed * 0.85;
          e.vx += (dx / len * sp - e.vx) * 1.8 * dt;
          e.vy += (dy / len * sp - e.vy) * 1.8 * dt;
          break;
        }
      }
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      if (e.x < 22) {
        e.x = 22;
        e.vx = Math.abs(e.vx);
      }
      if (e.x > this.worldW - 22) {
        e.x = this.worldW - 22;
        e.vx = -Math.abs(e.vx);
      }
      if (e.y > this.worldH + 50) e.alive = false;

      if (e.kind !== "drone" || this.wave >= 5) {
        e.fireCd -= dt;
        if (e.fireCd <= 0 && e.y > 40 && e.y < p.y - 40) {
          e.fireCd = e.kind === "cruiser" ? 1.55 : e.kind === "fighter" ? 1.25 : 2.2;
          const ang = Math.atan2(p.y - e.y, p.x - e.x);
          if (e.kind === "cruiser") {
            this.spawnEnemyBullet(e.x - 12, e.y + 16, ang);
            this.spawnEnemyBullet(e.x + 12, e.y + 16, ang);
          } else if (e.kind === "fighter") {
            this.spawnEnemyBullet(e.x, e.y + 14, ang);
          } else {
            this.spawnEnemyBullet(e.x, e.y + 10, Math.PI / 2, ENEMY_BULLET_SPEED * 0.85);
          }
        }
      }
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const a = this.enemies[i]!;
      if (!a.alive) continue;
      for (let j = i + 1; j < this.enemies.length; j++) {
        const b = this.enemies[j]!;
        if (!b.alive) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const min = a.radius + b.radius - 4;
        const d2 = dx * dx + dy * dy;
        if (d2 > 0 && d2 < min * min) {
          const d = Math.sqrt(d2) || 0.001;
          const push = ((min - d) / d) * 0.5;
          a.x -= dx * push * 0.5;
          a.y -= dy * push * 0.5;
          b.x += dx * push * 0.5;
          b.y += dy * push * 0.5;
        }
      }
    }
  }

  private stepBullets(dt: number) {
    for (const b of this.playerBullets) {
      if (!b.alive) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.ttl -= dt;
      b.frame += dt * 12;
      if (b.ttl <= 0 || b.y < -20 || b.x < -20 || b.x > this.worldW + 20) b.alive = false;
    }
    for (const b of this.enemyBullets) {
      if (!b.alive) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.ttl -= dt;
      b.frame += dt * 10;
      if (b.ttl <= 0 || b.y > this.worldH + 30 || b.y < -30) b.alive = false;
    }
  }

  private stepPickups(dt: number) {
    for (const p of this.pickups) {
      if (!p.alive) continue;
      p.age += dt;
      p.y += p.vy * dt;
      p.x += Math.sin(p.age * 3) * 18 * dt;
      if (p.y > this.worldH + 30) p.alive = false;
    }
  }

  private stepFx(dt: number) {
    for (const p of this.particles) if (p.alive) this.stepParticle(p, dt);
    for (const f of this.flashes) {
      if (!f.alive) continue;
      f.age += dt;
      if (f.age >= f.max) f.alive = false;
    }
    for (const b of this.blasts) {
      if (!b.alive) continue;
      b.age += dt;
      if (b.age >= b.max) b.alive = false;
    }
    for (const f of this.floats) {
      if (!f.alive) continue;
      f.age += dt;
      f.y += f.vy * dt;
      if (f.age >= f.max) f.alive = false;
    }
  }

  private stepParticle(p: Particle, dt: number) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 40 * dt;
    p.life -= dt;
    if (p.life <= 0) p.alive = false;
  }

  private collide() {
    const p = this.player;
    for (const b of this.playerBullets) {
      if (!b.alive) continue;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        if (circ(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
          b.alive = false;
          this.hurtEnemy(e, 1);
          break;
        }
      }
    }
    if (p.invuln <= 0) {
      for (const b of this.enemyBullets) {
        if (!b.alive) continue;
        if (circ(b.x, b.y, b.radius, p.x, p.y, p.radius)) {
          b.alive = false;
          this.hurtPlayer();
          if (p.invuln > 0) break;
        }
      }
      if (p.invuln <= 0) {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          if (circ(e.x, e.y, e.radius * 0.8, p.x, p.y, p.radius)) {
            this.hurtEnemy(e, 99);
            this.hurtPlayer();
            break;
          }
        }
      }
    }
    for (const u of this.pickups) {
      if (!u.alive) continue;
      if (circ(u.x, u.y, 16, p.x, p.y, p.radius + 6)) {
        u.alive = false;
        this.collect(u.kind);
      }
    }
  }

  private hurtEnemy(e: Enemy, dmg: number) {
    e.hp -= dmg;
    e.flash = 0.08;
    this.burst(e.x, e.y, 5, COLORS.primary, 80);
    if (e.hp <= 0) {
      e.alive = false;
      this.combo += 1;
      this.comboT = 1.25;
      const mul = 1 + Math.min(8, this.combo) * 0.15;
      const gained = Math.round(e.score * mul);
      this.score += gained;
      this.float(e.x, e.y, `+${gained}`, COLORS.fg);
      this.explode(e.x, e.y, e.kind === "cruiser" ? 88 : 64);
      this.audio.explosion(e.kind === "cruiser");
      this.addTrauma(e.kind === "cruiser" ? 0.45 : 0.22);
      this.freeze = e.kind === "cruiser" ? 0.05 : 0.02;
      if (Math.random() < e.drop) this.dropPickup(e.x, e.y);
    }
  }

  private hurtPlayer() {
    const p = this.player;
    if (p.invuln > 0) return;
    if (p.shield > 0) {
      p.shield -= 1;
      p.invuln = 0.6;
      p.flash = 0.2;
      this.audio.hit();
      this.addTrauma(0.3);
      this.burst(p.x, p.y, 14, COLORS.primary, 140);
      return;
    }
    p.lives -= 1;
    p.invuln = PLAYER_INVULN;
    p.flash = 0.3;
    p.multi = Math.max(0, p.multi - 1);
    p.speedT = 0;
    this.audio.lifeLost();
    this.explode(p.x, p.y, 70);
    this.addTrauma(0.7);
    this.freeze = 0.08;
    this.flashScreen = 0.35;
    if (p.lives <= 0) {
      p.lives = 0;
      this.gameOver();
    }
  }

  private gameOver() {
    this.lastScore = this.score;
    this.isHigh = qualifies(this.save.scores, this.score);
    this.initials = "AAA";
    this.setMode("over");
    this.audio.explosion(true);
  }

  private collect(kind: PickupKind) {
    const p = this.player;
    this.audio.pickup();
    this.addTrauma(0.12);
    if (kind === "multi") p.multi = Math.min(3, p.multi + 1);
    if (kind === "shield") p.shield = Math.min(3, p.shield + 1);
    if (kind === "speed") p.speedT = Math.min(14, p.speedT + 8);
    if (kind === "life") p.lives = Math.min(6, p.lives + 1);
    const label = kind === "multi" ? "MULTI" : kind === "shield" ? "SHIELD" : kind === "speed" ? "SPEED" : "LIFE";
    this.float(p.x, p.y - 28, label, COLORS.primary);
    this.burst(p.x, p.y, 10, COLORS.primary, 90);
    this.emitHud();
  }

  private dropPickup(x: number, y: number) {
    const u = grab(this.pickups);
    if (!u) return;
    const r = Math.random();
    const kind: PickupKind = r < 0.1 ? "life" : r < 0.4 ? "multi" : r < 0.7 ? "shield" : "speed";
    u.alive = true;
    u.kind = kind;
    u.x = x;
    u.y = y;
    u.vy = 70;
    u.age = 0;
  }

  private explode(x: number, y: number, size: number) {
    const b = grab(this.blasts);
    if (b) {
      b.alive = true;
      b.x = x;
      b.y = y;
      b.age = 0;
      b.max = 0.42;
      b.size = size;
    }
    this.burst(x, y, 16, COLORS.danger, 180);
    this.burst(x, y, 8, COLORS.fg, 120);
  }

  private burst(x: number, y: number, n: number, color: string, speed: number) {
    for (let i = 0; i < n; i++) {
      const p = grab(this.particles);
      if (!p) return;
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random());
      p.alive = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s;
      p.life = 0.25 + Math.random() * 0.35;
      p.max = p.life;
      p.size = 1.5 + Math.random() * 2.5;
      p.color = color;
    }
  }

  private float(x: number, y: number, text: string, color: string) {
    const f = grab(this.floats);
    if (!f) return;
    f.alive = true;
    f.x = x;
    f.y = y;
    f.vy = -46;
    f.age = 0;
    f.max = 0.85;
    f.text = text;
    f.color = color;
  }

  private addTrauma(v: number) {
    if (!this.shakeOn || this.reduced) return;
    this.trauma = Math.min(1, this.trauma + v);
  }

  private draw() {
    const ctx = this.ctx;
    const { scale, ox, oy, cssW, cssH } = this.view;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, cssW, cssH);

    const shake = this.trauma * this.trauma;
    const sx = this.shakeOn && !this.reduced ? (Math.random() * 2 - 1) * 10 * shake : 0;
    const sy = this.shakeOn && !this.reduced ? (Math.random() * 2 - 1) * 10 * shake : 0;

    ctx.save();
    ctx.translate(ox + sx, oy + sy);
    ctx.scale(scale, scale);

    this.stars.draw(ctx, 0, 0);
    this.drawVignette(ctx);

    if (this.sprites) this.drawWorld(ctx);
    else this.drawFallback(ctx);

    ctx.restore();

    if (this.flashScreen > 0) {
      ctx.fillStyle = `rgba(255,92,122,${this.flashScreen * 0.25})`;
      ctx.fillRect(0, 0, cssW, cssH);
    }
  }

  private drawVignette(ctx: CanvasRenderingContext2D) {
    const g = ctx.createRadialGradient(
      this.worldW / 2,
      this.worldH / 2,
      this.worldH * 0.2,
      this.worldW / 2,
      this.worldH / 2,
      this.worldH * 0.72,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(7,9,16,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.worldW, this.worldH);
  }

  private drawWorld(ctx: CanvasRenderingContext2D) {
    const sp = this.sprites!;
    const t = this.time;

    for (const u of this.pickups) {
      if (!u.alive) continue;
      const bob = Math.sin(u.age * 6) * 3;
      drawSheet(ctx, sp.powerups, pickupFrame(u.kind), u.x, u.y + bob, 40);
    }

    for (const e of this.enemies) {
      if (!e.alive) continue;
      const sheet = e.kind === "drone" ? sp.drone : e.kind === "fighter" ? sp.fighter : sp.cruiser;
      const size = e.kind === "drone" ? 42 : e.kind === "fighter" ? 56 : 76;
      const alpha = e.flash > 0 ? 0.55 : 1;
      drawSheet(ctx, sheet, Math.floor(t * 7 + e.phase) % 4, e.x, e.y, size, alpha);
      if (e.flash > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(230,235,244,0.35)";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (const b of this.enemyBullets) {
      if (!b.alive) continue;
      drawSheet(ctx, sp.orb, Math.floor(b.frame) % 4, b.x, b.y, 22);
    }
    for (const b of this.playerBullets) {
      if (!b.alive) continue;
      drawSheet(ctx, sp.bolt, Math.floor(b.frame) % 4, b.x, b.y, 26);
    }

    for (const f of this.flashes) {
      if (!f.alive) continue;
      const fr = Math.min(3, Math.floor((f.age / f.max) * 4));
      drawSheet(ctx, sp.muzzle, fr, f.x, f.y, 40, 1 - f.age / f.max);
    }

    const p = this.player;
    if (this.mode === "playing" || this.mode === "paused" || this.mode === "title") {
      const blink = p.invuln > 0 && Math.floor(this.time * 16) % 2 === 0;
      if (!blink || this.mode === "title") {
        if (p.shield > 0) {
          ctx.save();
          ctx.strokeStyle = COLORS.primary;
          ctx.globalAlpha = 0.45 + Math.sin(t * 6) * 0.15;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 28 + p.shield * 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);
        drawSheet(ctx, sp.player, Math.floor(t * 8) % 4, 0, 0, 58, p.flash > 0 ? 0.7 : 1);
        ctx.restore();
      }
    }

    for (const b of this.blasts) {
      if (!b.alive) continue;
      const fr = Math.min(3, Math.floor((b.age / b.max) * 4));
      drawSheet(ctx, sp.explosion, fr, b.x, b.y, b.size, 1 - b.age / b.max * 0.2);
    }

    for (const q of this.particles) {
      if (!q.alive) continue;
      ctx.globalAlpha = q.life / q.max;
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y, q.size, q.size);
    }
    ctx.globalAlpha = 1;

    ctx.font = "600 12px Oxanium, sans-serif";
    ctx.textAlign = "center";
    for (const f of this.floats) {
      if (!f.alive) continue;
      ctx.globalAlpha = 1 - f.age / f.max;
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;

    if (this.mode === "playing" && this.announcing > 0) {
      ctx.globalAlpha = Math.min(1, this.announcing);
      ctx.fillStyle = COLORS.fg;
      ctx.font = "600 28px Oxanium, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`WAVE ${this.wave}`, this.worldW / 2, this.worldH * 0.28);
      ctx.globalAlpha = 1;
    }
  }

  private drawFallback(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLORS.primary;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}
