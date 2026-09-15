const GAME_CODES = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "Space",
  "Escape",
  "KeyP",
  "KeyM",
  "Enter",
]);

export class Input {
  keys = new Set<string>();
  injected = new Set<string>();
  steerOverride: number | null = null;
  pointer = { x: 0, y: 0, active: false, moved: false };
  pausePressed = false;
  mutePressed = false;
  private pauseWas = false;
  private muteWas = false;
  private canvas: HTMLCanvasElement;
  private toWorld: (cx: number, cy: number) => { x: number; y: number };
  private unsubs: Array<() => void> = [];

  constructor(canvas: HTMLCanvasElement, toWorld: (cx: number, cy: number) => { x: number; y: number }) {
    this.canvas = canvas;
    this.toWorld = toWorld;
    this.bind();
  }

  private bind() {
    const onKeyDown = (e: KeyboardEvent) => {
      if (GAME_CODES.has(e.code)) e.preventDefault();
      this.keys.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    };
    const clear = () => {
      this.keys.clear();
      this.pointer.active = false;
    };
    const onPointer = (e: PointerEvent) => {
      const w = this.toWorld(e.clientX, e.clientY);
      this.pointer.x = w.x;
      this.pointer.y = w.y;
      if (e.type === "pointerdown") {
        this.pointer.active = true;
        this.pointer.moved = true;
        try {
          this.canvas.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      if (e.type === "pointermove" && e.pointerType === "mouse") {
        this.pointer.moved = true;
      }
      if (e.type === "pointerup" || e.type === "pointercancel") {
        this.pointer.active = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clear();
    });
    this.canvas.addEventListener("pointerdown", onPointer);
    this.canvas.addEventListener("pointermove", onPointer);
    this.canvas.addEventListener("pointerup", onPointer);
    this.canvas.addEventListener("pointercancel", onPointer);

    this.unsubs.push(() => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clear);
      this.canvas.removeEventListener("pointerdown", onPointer);
      this.canvas.removeEventListener("pointermove", onPointer);
      this.canvas.removeEventListener("pointerup", onPointer);
      this.canvas.removeEventListener("pointercancel", onPointer);
    });
  }

  setInjected(codes: string[]) {
    this.injected = new Set(codes);
  }

  setSteer(v: number) {
    this.steerOverride = v;
  }

  has(code: string) {
    return this.keys.has(code) || this.injected.has(code);
  }

  sample() {
    const pauseHeld = this.has("Escape") || this.has("KeyP");
    this.pausePressed = pauseHeld && !this.pauseWas;
    this.pauseWas = pauseHeld;
    const muteHeld = this.has("KeyM");
    this.mutePressed = muteHeld && !this.muteWas;
    this.muteWas = muteHeld;
  }

  moveAxis() {
    let x = 0;
    let y = 0;
    if (this.has("KeyA") || this.has("ArrowLeft")) x -= 1;
    if (this.has("KeyD") || this.has("ArrowRight")) x += 1;
    if (this.has("KeyW") || this.has("ArrowUp")) y -= 1;
    if (this.has("KeyS") || this.has("ArrowDown")) y += 1;
    if (this.steerOverride != null) {
      x -= this.steerOverride;
    }
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    return { x, y };
  }

  destroy() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }
}
