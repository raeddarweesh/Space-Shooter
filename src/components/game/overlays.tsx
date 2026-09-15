import { Pause, Play, Shield, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useState, type MutableRefObject, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { GameEngine } from "@/game/engine";
import { useHud } from "@/game/store";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = { engineRef: MutableRefObject<GameEngine | null> };

function useEngine(engineRef: Props["engineRef"]) {
  return () => engineRef.current;
}

export function Overlays({ engineRef }: Props) {
  const hud = useHud();
  const get = useEngine(engineRef);

  return (
    <div className="pointer-events-none absolute inset-0 text-fg">
      {(hud.mode === "playing" || hud.mode === "paused") && <Hud hud={hud} onPause={() => get()?.pause()} />}
      {hud.mode === "title" && (
        <Title ready={hud.ready} onPlay={() => get()?.startRun()} onScores={() => get()?.toScores()} />
      )}
      {hud.mode === "paused" && (
        <PauseMenu
          muted={hud.muted}
          shakeOn={hud.shakeOn}
          onResume={() => get()?.resume()}
          onMute={() => get()?.toggleMute()}
          onShake={() => get()?.toggleShake()}
          onScores={() => get()?.toScores()}
          onQuit={() => get()?.toTitle()}
        />
      )}
      {hud.mode === "over" && (
        <GameOver
          score={hud.lastScore}
          wave={hud.wave}
          isHigh={hud.isHigh}
          onAgain={() => get()?.startRun()}
          onMenu={() => get()?.toTitle()}
          onSubmit={(n) => get()?.submitName(n)}
        />
      )}
      {hud.mode === "scores" && (
        <Scores scores={hud.scores} onBack={() => get()?.backFromScores()} />
      )}
    </div>
  );
}

function Hud({
  hud,
  onPause,
}: {
  hud: ReturnType<typeof useHud.getState>;
  onPause: () => void;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] font-display">
        <div>
          <p className="text-xs tracking-[0.22em] text-muted">SCORE</p>
          <p className="text-xl tabular-nums tracking-wide">{hud.score.toLocaleString()}</p>
          {hud.combo > 1 && <p className="text-xs text-primary">×{hud.combo} COMBO</p>}
        </div>
        <div className="text-center">
          <p className="text-xs tracking-[0.22em] text-muted">WAVE</p>
          <p className="text-xl tabular-nums">{hud.wave}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-right">
            <p className="text-xs tracking-[0.22em] text-muted">LIVES</p>
            <p className="text-xl tabular-nums text-danger">{Math.max(0, hud.lives)}</p>
          </div>
          <button
            type="button"
            aria-label="Pause"
            onClick={onPause}
            className="pointer-events-auto flex size-11 items-center justify-center rounded-md border border-border bg-surface/80 text-fg"
          >
            <Pause className="size-4" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 flex justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {hud.multi > 0 && <Chip icon={<Zap className="size-3.5" />} label={`MULTI ${hud.multi}`} />}
        {hud.shield > 0 && <Chip icon={<Shield className="size-3.5" />} label={`SHIELD ${hud.shield}`} />}
        {hud.speedLeft > 0 && <Chip icon={<Zap className="size-3.5" />} label="SPEED" />}
      </div>
    </>
  );
}

function Chip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface/80 px-2.5 py-1 font-display text-xs tracking-wider text-primary">
      {icon}
      {label}
    </span>
  );
}

function Title({ ready, onPlay, onScores }: { ready: boolean; onPlay: () => void; onScores: () => void }) {
  return (
    <div className="pointer-events-auto flex h-full flex-col items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface/80 px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="mb-3 font-display text-xs tracking-[0.38em] text-muted">FAR-EDGE RUN</p>
        <h1 className="font-display text-5xl font-semibold tracking-[0.18em] text-fg sm:text-6xl">APHELION</h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted">
          Break the incoming waves. Grab multi-shot, shields, and speed. Hold the line at the far edge.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button size="lg" className="w-full rounded-lg" disabled={!ready} onClick={onPlay}>
            Engage
          </Button>
          <Button variant="outline" className="w-full rounded-md" onClick={onScores}>
            Hall of Drift
          </Button>
        </div>
        <dl className="mt-8 grid gap-2 text-left text-sm text-muted">
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Move</dt>
            <dd className="text-fg">WASD / arrows / drag</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Fire</dt>
            <dd className="text-fg">Automatic</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-subtle">Pause</dt>
            <dd className="text-fg">Esc / P</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function PauseMenu({
  muted,
  shakeOn,
  onResume,
  onMute,
  onShake,
  onScores,
  onQuit,
}: {
  muted: boolean;
  shakeOn: boolean;
  onResume: () => void;
  onMute: () => void;
  onShake: () => void;
  onScores: () => void;
  onQuit: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <h2 className="font-display text-2xl tracking-[0.2em]">PAUSED</h2>
        <p className="mt-1 text-sm text-muted">Systems holding.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Button size="lg" className="w-full rounded-lg" onClick={onResume}>
            <Play className="size-4" />
            Resume
          </Button>
          <Button variant="outline" className="w-full justify-between rounded-md" onClick={onMute}>
            <span className="inline-flex items-center gap-2">
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              Audio
            </span>
            <span className="text-muted">{muted ? "Off" : "On"}</span>
          </Button>
          <Button variant="outline" className="w-full justify-between rounded-md" onClick={onShake}>
            Shake
            <span className="text-muted">{shakeOn ? "On" : "Off"}</span>
          </Button>
          <Button variant="ghost" className="w-full rounded-md" onClick={onScores}>
            Hall of Drift
          </Button>
          <Button variant="ghost" className="w-full rounded-md text-muted" onClick={onQuit}>
            Abandon run
          </Button>
        </div>
      </div>
    </div>
  );
}

function GameOver({
  score,
  wave,
  isHigh,
  onAgain,
  onMenu,
  onSubmit,
}: {
  score: number;
  wave: number;
  isHigh: boolean;
  onAgain: () => void;
  onMenu: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(["A", "A", "A"]);
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    if (!isHigh) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit(name.join(""));
        return;
      }
      if (e.key === "Backspace") {
        setSlot((s) => Math.max(0, s - 1));
        return;
      }
      if (e.key === "ArrowLeft") setSlot((s) => (s + 2) % 3);
      if (e.key === "ArrowRight") setSlot((s) => (s + 1) % 3);
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        setName((n) => {
          const next = [...n];
          const i = LETTERS.indexOf(next[slot] ?? "A");
          const dir = e.key === "ArrowUp" ? 1 : -1;
          next[slot] = LETTERS[(i + dir + 26) % 26]!;
          return next;
        });
      }
      const ch = e.key.toUpperCase();
      if (ch.length === 1 && ch >= "A" && ch <= "Z") {
        setName((n) => {
          const next = [...n];
          next[slot] = ch;
          return next;
        });
        setSlot((s) => Math.min(2, s + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isHigh, name, onSubmit, slot]);

  const cycle = (i: number) => {
    setSlot(i);
    setName((n) => {
      const next = [...n];
      const idx = LETTERS.indexOf(next[i] ?? "A");
      next[i] = LETTERS[(idx + 1) % 26]!;
      return next;
    });
  };

  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface px-6 py-7 text-center">
        <p className="font-display text-xs tracking-[0.3em] text-muted">SIGNAL LOST</p>
        <h2 className="mt-2 font-display text-3xl tracking-wide">Run complete</h2>
        <p className="mt-4 font-display text-4xl tabular-nums">{score.toLocaleString()}</p>
        <p className="mt-1 text-sm text-muted">Wave {wave}</p>
        {isHigh && (
          <div className="mt-6">
            <p className="text-sm text-primary">Hall of Drift entry</p>
            <div className="mt-3 flex justify-center gap-2">
              {name.map((ch, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => cycle(i)}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-md border font-display text-2xl",
                    i === slot ? "border-primary text-fg" : "border-border text-muted",
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
            <Button className="mt-4 w-full rounded-lg" onClick={() => onSubmit(name.join(""))}>
              Record
            </Button>
          </div>
        )}
        {!isHigh && (
          <div className="mt-6 flex flex-col gap-3">
            <Button size="lg" className="w-full rounded-lg" onClick={onAgain}>
              Again
            </Button>
            <Button variant="outline" className="w-full rounded-md" onClick={onMenu}>
              Menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Scores({
  scores,
  onBack,
}: {
  scores: Array<{ name: string; score: number; wave: number }>;
  onBack: () => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface px-6 py-7">
        <h2 className="font-display text-2xl tracking-[0.18em]">HALL OF DRIFT</h2>
        <p className="mt-1 text-sm text-muted">Local best runs on this device.</p>
        <ol className="mt-5 divide-y divide-border">
          {scores.map((row, i) => (
            <li key={`${row.name}-${row.score}-${i}`} className="flex items-baseline gap-3 py-2.5 font-display">
              <span className="w-6 text-sm text-subtle">{i + 1}</span>
              <span className="w-14 tracking-[0.2em]">{row.name}</span>
              <span className="flex-1 text-right tabular-nums">{row.score.toLocaleString()}</span>
              <span className="w-16 text-right text-sm text-muted">W{row.wave}</span>
            </li>
          ))}
        </ol>
        <Button className="mt-6 w-full rounded-lg" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
