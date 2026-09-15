import { useEffect, useRef } from "react";
import { Overlays } from "@/components/game/overlays";
import { GameEngine } from "@/game/engine";
import { useHud } from "@/game/store";

export function AphelionGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new GameEngine(canvas, (snap) => useHud.setState(snap));
    engineRef.current = engine;
    engine.start();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none select-none"
        style={{ touchAction: "none" }}
      />
      <Overlays engineRef={engineRef} />
    </main>
  );
}
