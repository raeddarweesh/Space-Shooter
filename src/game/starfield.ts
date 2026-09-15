import { COLORS } from "./constants";

type Star = { x: number; y: number; z: number; s: number };

export class Starfield {
  layers: Star[][] = [];
  w = 480;
  h = 800;
  t = 0;

  constructor() {
    this.rebuild(480, 800);
  }

  rebuild(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.layers = [
      this.make(40, 0.6, 1),
      this.make(55, 1.1, 1.4),
      this.make(28, 1.8, 2.2),
    ];
  }

  private make(n: number, minS: number, maxS: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        z: minS + Math.random() * (maxS - minS),
        s: minS + Math.random() * (maxS - minS),
      });
    }
    return stars;
  }

  step(dt: number, speed: number) {
    this.t += dt;
    const rates = [22, 58, 130];
    for (let i = 0; i < this.layers.length; i++) {
      const v = rates[i]! * speed;
      for (const star of this.layers[i]!) {
        star.y += v * dt * star.z;
        if (star.y > this.h + 4) {
          star.y = -4;
          star.x = Math.random() * this.w;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    const palettes = [COLORS.starFar, COLORS.starMid, COLORS.starNear];
    for (let i = 0; i < this.layers.length; i++) {
      ctx.fillStyle = palettes[i]!;
      for (const star of this.layers[i]!) {
        const twinkle = 0.55 + Math.sin(this.t * (1.2 + star.s) + star.x) * 0.35;
        ctx.globalAlpha = twinkle;
        ctx.fillRect(ox + star.x, oy + star.y, star.s, star.s);
      }
    }
    ctx.globalAlpha = 1;
  }
}
