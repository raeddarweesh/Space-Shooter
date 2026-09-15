export type Sheet = {
  img: HTMLImageElement;
  cols: number;
  rows: number;
};

export type SpriteBank = {
  player: Sheet;
  drone: Sheet;
  fighter: Sheet;
  cruiser: Sheet;
  bolt: Sheet;
  orb: Sheet;
  muzzle: Sheet;
  explosion: Sheet;
  powerups: Sheet;
};

const SRC: Record<keyof SpriteBank, string> = {
  player: "/sprites/player.png",
  drone: "/sprites/enemy-drone.png",
  fighter: "/sprites/enemy-fighter.png",
  cruiser: "/sprites/enemy-cruiser.png",
  bolt: "/sprites/player-bolt.png",
  orb: "/sprites/enemy-orb.png",
  muzzle: "/sprites/muzzle.png",
  explosion: "/sprites/explosion.png",
  powerups: "/sprites/powerups.png",
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export async function loadSprites(): Promise<SpriteBank> {
  const entries = await Promise.all(
    (Object.keys(SRC) as Array<keyof SpriteBank>).map(async (key) => {
      const img = await loadImage(SRC[key]);
      return [key, { img, cols: 2, rows: 2 }] as const;
    }),
  );
  return Object.fromEntries(entries) as SpriteBank;
}

export function drawSheet(
  ctx: CanvasRenderingContext2D,
  sheet: Sheet,
  frame: number,
  x: number,
  y: number,
  size: number,
  alpha = 1,
) {
  const fw = sheet.img.width / sheet.cols;
  const fh = sheet.img.height / sheet.rows;
  const i = ((frame % (sheet.cols * sheet.rows)) + sheet.cols * sheet.rows) % (sheet.cols * sheet.rows);
  const col = i % sheet.cols;
  const row = Math.floor(i / sheet.cols);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(sheet.img, col * fw, row * fh, fw, fh, x - size / 2, y - size / 2, size, size);
  ctx.restore();
}
