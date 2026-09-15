import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Shield, n as VolumeX, o as Play, r as Volume2, s as Pause, t as Zap } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BcNbyJPt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-display font-medium tracking-wide transition-opacity duration-150 ease-[var(--ease-smooth-out)] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:opacity-90",
			ghost: "bg-transparent text-fg hover:bg-surface-2",
			outline: "border border-border-strong bg-surface text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 min-w-11 rounded-md px-5 text-sm",
			lg: "h-12 min-w-12 rounded-lg px-6 text-base",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(function Button({ className, variant, size, type = "button", ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
var initial = {
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
	scores: []
};
var useHud = create(() => initial);
var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function useEngine(engineRef) {
	return () => engineRef.current;
}
function Overlays({ engineRef }) {
	const hud = useHud();
	const get = useEngine(engineRef);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 text-fg",
		children: [
			(hud.mode === "playing" || hud.mode === "paused") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
				hud,
				onPause: () => get()?.pause()
			}),
			hud.mode === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
				ready: hud.ready,
				onPlay: () => get()?.startRun(),
				onScores: () => get()?.toScores()
			}),
			hud.mode === "paused" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
				muted: hud.muted,
				shakeOn: hud.shakeOn,
				onResume: () => get()?.resume(),
				onMute: () => get()?.toggleMute(),
				onShake: () => get()?.toggleShake(),
				onScores: () => get()?.toScores(),
				onQuit: () => get()?.toTitle()
			}),
			hud.mode === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameOver, {
				score: hud.lastScore,
				wave: hud.wave,
				isHigh: hud.isHigh,
				onAgain: () => get()?.startRun(),
				onMenu: () => get()?.toTitle(),
				onSubmit: (n) => get()?.submitName(n)
			}),
			hud.mode === "scores" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scores, {
				scores: hud.scores,
				onBack: () => get()?.backFromScores()
			})
		]
	});
}
function Hud({ hud, onPause }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] font-display",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted",
					children: "SCORE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl tabular-nums tracking-wide",
					children: hud.score.toLocaleString()
				}),
				hud.combo > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-primary",
					children: [
						"×",
						hud.combo,
						" COMBO"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted",
					children: "WAVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xl tabular-nums",
					children: hud.wave
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.22em] text-muted",
						children: "LIVES"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xl tabular-nums text-danger",
						children: Math.max(0, hud.lives)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Pause",
					onClick: onPause,
					className: "pointer-events-auto flex size-11 items-center justify-center rounded-md border border-border bg-surface/80 text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-0 inset-x-0 flex justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
		children: [
			hud.multi > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
				label: `MULTI ${hud.multi}`
			}),
			hud.shield > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3.5" }),
				label: `SHIELD ${hud.shield}`
			}),
			hud.speedLeft > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
				label: "SPEED"
			})
		]
	})] });
}
function Chip({ icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface/80 px-2.5 py-1 font-display text-xs tracking-wider text-primary",
		children: [icon, label]
	});
}
function Title({ ready, onPlay, onScores }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto flex h-full flex-col items-center justify-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-surface/80 px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 font-display text-xs tracking-[0.38em] text-muted",
					children: "FAR-EDGE RUN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-5xl font-semibold tracking-[0.18em] text-fg sm:text-6xl",
					children: "APHELION"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted",
					children: "Break the incoming waves. Grab multi-shot, shields, and speed. Hold the line at the far edge."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full rounded-lg",
						disabled: !ready,
						onClick: onPlay,
						children: "Engage"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full rounded-md",
						onClick: onScores,
						children: "Hall of Drift"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid gap-2 text-left text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Move"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: "WASD / arrows / drag"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Fire"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: "Automatic"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: "Pause"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-fg",
								children: "Esc / P"
							})]
						})
					]
				})
			]
		})
	});
}
function PauseMenu({ muted, shakeOn, onResume, onMute, onShake, onScores, onQuit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[0.2em]",
					children: "PAUSED"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Systems holding."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "w-full rounded-lg",
							onClick: onResume,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Resume"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full justify-between rounded-md",
							onClick: onMute,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2",
								children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), "Audio"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: muted ? "Off" : "On"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "w-full justify-between rounded-md",
							onClick: onShake,
							children: ["Shake", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: shakeOn ? "On" : "Off"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full rounded-md",
							onClick: onScores,
							children: "Hall of Drift"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full rounded-md text-muted",
							onClick: onQuit,
							children: "Abandon run"
						})
					]
				})
			]
		})
	});
}
function GameOver({ score, wave, isHigh, onAgain, onMenu, onSubmit }) {
	const [name, setName] = (0, import_react.useState)([
		"A",
		"A",
		"A"
	]);
	const [slot, setSlot] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!isHigh) return;
		const onKey = (e) => {
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
			if (e.key === "ArrowUp" || e.key === "ArrowDown") setName((n) => {
				const next = [...n];
				const i = LETTERS.indexOf(next[slot] ?? "A");
				const dir = e.key === "ArrowUp" ? 1 : -1;
				next[slot] = LETTERS[(i + dir + 26) % 26];
				return next;
			});
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
	}, [
		isHigh,
		name,
		onSubmit,
		slot
	]);
	const cycle = (i) => {
		setSlot(i);
		setName((n) => {
			const next = [...n];
			next[i] = LETTERS[(LETTERS.indexOf(next[i] ?? "A") + 1) % 26];
			return next;
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-xl border border-border bg-surface px-6 py-7 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs tracking-[0.3em] text-muted",
					children: "SIGNAL LOST"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl tracking-wide",
					children: "Run complete"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-4xl tabular-nums",
					children: score.toLocaleString()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: ["Wave ", wave]
				}),
				isHigh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-primary",
							children: "Hall of Drift entry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex justify-center gap-2",
							children: name.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => cycle(i),
								className: cn("flex size-12 items-center justify-center rounded-md border font-display text-2xl", i === slot ? "border-primary text-fg" : "border-border text-muted"),
								children: ch
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full rounded-lg",
							onClick: () => onSubmit(name.join("")),
							children: "Record"
						})
					]
				}),
				!isHigh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full rounded-lg",
						onClick: onAgain,
						children: "Again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full rounded-md",
						onClick: onMenu,
						children: "Menu"
					})]
				})
			]
		})
	});
}
function Scores({ scores, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 flex items-center justify-center bg-bg/70 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-surface px-6 py-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-[0.18em]",
					children: "HALL OF DRIFT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Local best runs on this device."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-5 divide-y divide-border",
					children: scores.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline gap-3 py-2.5 font-display",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 text-sm text-subtle",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-14 tracking-[0.2em]",
								children: row.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-right tabular-nums",
								children: row.score.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-16 text-right text-sm text-muted",
								children: ["W", row.wave]
							})
						]
					}, `${row.name}-${row.score}-${i}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full rounded-lg",
					onClick: onBack,
					children: "Back"
				})
			]
		})
	});
}
var STEP = 1 / 60;
var DT_CAP = .1;
var PLAYER_SPEED_BOOST = 1.42;
var PLAYER_FIRE = .13;
var PLAYER_INVULN = 1.8;
var POOL = {
	playerBullets: 96,
	enemyBullets: 128,
	enemies: 48,
	pickups: 10,
	particles: 220,
	flashes: 18,
	blasts: 16,
	floats: 24
};
var SCORE = {
	drone: 120,
	fighter: 280,
	cruiser: 900
};
var COLORS = {
	bg: "#070910",
	fg: "#e6ebf4",
	muted: "#8a92a6",
	primary: "#4de2c8",
	danger: "#ff5c7a",
	starFar: "#6a7388",
	starMid: "#b7c0d4",
	starNear: "#e6ebf4"
};
function env(ctx, gain, peak, attack, decay) {
	const t = ctx.currentTime;
	gain.gain.cancelScheduledValues(t);
	gain.gain.setValueAtTime(1e-4, t);
	gain.gain.exponentialRampToValueAtTime(Math.max(2e-4, peak), t + attack);
	gain.gain.exponentialRampToValueAtTime(1e-4, t + attack + decay);
}
var AudioBus = class {
	ctx = null;
	master = null;
	sfx = null;
	muted = false;
	noise = null;
	unlock() {
		if (!this.ctx) {
			const ctx = new AudioContext({ latencyHint: "interactive" });
			this.ctx = ctx;
			this.master = ctx.createGain();
			this.sfx = ctx.createGain();
			this.sfx.gain.value = .7;
			this.master.gain.value = this.muted ? 0 : .9;
			this.sfx.connect(this.master);
			this.master.connect(ctx.destination);
			this.noise = this.makeNoise(ctx);
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setMuted(muted) {
		this.muted = muted;
		if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : .9, this.ctx.currentTime, .02);
	}
	makeNoise(ctx) {
		const buf = ctx.createBuffer(1, ctx.sampleRate * .4, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		return buf;
	}
	tone(freq, dur, type, peak, detune = 0) {
		if (!this.ctx || !this.sfx) return;
		const osc = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		osc.type = type;
		osc.frequency.value = freq * (1 + (Math.random() * 2 - 1) * .04);
		osc.detune.value = detune;
		env(this.ctx, g, peak, .006, dur);
		osc.connect(g);
		g.connect(this.sfx);
		osc.start();
		osc.stop(this.ctx.currentTime + dur + .05);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
		};
	}
	shoot() {
		this.tone(720, .07, "square", .045);
		this.tone(1480, .04, "triangle", .02);
	}
	enemyShoot() {
		this.tone(240, .09, "sawtooth", .03);
	}
	explosion(heavy = false) {
		if (!this.ctx || !this.sfx || !this.noise) return;
		const src = this.ctx.createBufferSource();
		src.buffer = this.noise;
		src.playbackRate.value = heavy ? .5 : .85;
		const g = this.ctx.createGain();
		const f = this.ctx.createBiquadFilter();
		f.type = "lowpass";
		f.frequency.value = heavy ? 480 : 900;
		env(this.ctx, g, heavy ? .28 : .16, .004, heavy ? .45 : .22);
		src.connect(f);
		f.connect(g);
		g.connect(this.sfx);
		src.start();
		src.stop(this.ctx.currentTime + .5);
	}
	hit() {
		this.tone(90, .18, "sine", .18);
		this.tone(180, .1, "square", .05);
	}
	pickup() {
		this.tone(523, .08, "triangle", .08);
		this.tone(784, .12, "sine", .07);
	}
	wave() {
		this.tone(220, .18, "triangle", .05);
		this.tone(330, .22, "sine", .04);
	}
	ui() {
		this.tone(620, .06, "triangle", .05);
	}
	lifeLost() {
		this.tone(196, .2, "sawtooth", .08);
		this.tone(130, .28, "sine", .1);
	}
	resume() {
		if (this.ctx?.state === "suspended") this.ctx.resume();
	}
};
var GAME_CODES = /* @__PURE__ */ new Set([
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
	"Enter"
]);
var Input = class {
	keys = /* @__PURE__ */ new Set();
	injected = /* @__PURE__ */ new Set();
	steerOverride = null;
	pointer = {
		x: 0,
		y: 0,
		active: false,
		moved: false
	};
	pausePressed = false;
	mutePressed = false;
	pauseWas = false;
	muteWas = false;
	canvas;
	toWorld;
	unsubs = [];
	constructor(canvas, toWorld) {
		this.canvas = canvas;
		this.toWorld = toWorld;
		this.bind();
	}
	bind() {
		const onKeyDown = (e) => {
			if (GAME_CODES.has(e.code)) e.preventDefault();
			this.keys.add(e.code);
		};
		const onKeyUp = (e) => {
			this.keys.delete(e.code);
		};
		const clear = () => {
			this.keys.clear();
			this.pointer.active = false;
		};
		const onPointer = (e) => {
			const w = this.toWorld(e.clientX, e.clientY);
			this.pointer.x = w.x;
			this.pointer.y = w.y;
			if (e.type === "pointerdown") {
				this.pointer.active = true;
				this.pointer.moved = true;
				try {
					this.canvas.setPointerCapture(e.pointerId);
				} catch {}
			}
			if (e.type === "pointermove" && e.pointerType === "mouse") this.pointer.moved = true;
			if (e.type === "pointerup" || e.type === "pointercancel") this.pointer.active = false;
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
	setInjected(codes) {
		this.injected = new Set(codes);
	}
	setSteer(v) {
		this.steerOverride = v;
	}
	has(code) {
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
		if (this.steerOverride != null) x -= this.steerOverride;
		const len = Math.hypot(x, y);
		if (len > 1) {
			x /= len;
			y /= len;
		}
		return {
			x,
			y
		};
	}
	destroy() {
		for (const u of this.unsubs) u();
		this.unsubs = [];
	}
};
var KEY = "aphelion-save";
var VERSION = 1;
var DEFAULT_SCORES = [
	{
		name: "NOVA",
		score: 48600,
		wave: 11
	},
	{
		name: "RAIL",
		score: 32100,
		wave: 8
	},
	{
		name: "LYNX",
		score: 24400,
		wave: 7
	},
	{
		name: "ORIN",
		score: 16800,
		wave: 5
	},
	{
		name: "VEX",
		score: 9200,
		wave: 4
	}
];
var DEFAULT_SAVE = {
	version: VERSION,
	scores: DEFAULT_SCORES,
	muted: false,
	shakeOn: true
};
function migrate(raw) {
	const next = {
		...DEFAULT_SAVE,
		...raw,
		scores: Array.isArray(raw.scores) && raw.scores.length ? raw.scores : DEFAULT_SCORES,
		muted: Boolean(raw.muted),
		shakeOn: raw.shakeOn !== false,
		version: VERSION
	};
	next.scores = next.scores.filter((s) => s && typeof s.name === "string" && typeof s.score === "number").slice(0, 8);
	return next;
}
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			...DEFAULT_SAVE,
			scores: [...DEFAULT_SCORES]
		};
		return migrate(JSON.parse(raw));
	} catch {
		return {
			...DEFAULT_SAVE,
			scores: [...DEFAULT_SCORES]
		};
	}
}
function writeSave(data) {
	try {
		localStorage.setItem(KEY, JSON.stringify({
			...data,
			version: VERSION
		}));
	} catch {}
}
function qualifies(scores, score) {
	if (scores.length < 8) return score > 0;
	return score > (scores[scores.length - 1]?.score ?? 0);
}
function insertScore(scores, row) {
	return [...scores, row].sort((a, b) => b.score - a.score).slice(0, 8);
}
var Starfield = class {
	layers = [];
	w = 480;
	h = 800;
	t = 0;
	constructor() {
		this.rebuild(480, 800);
	}
	rebuild(w, h) {
		this.w = w;
		this.h = h;
		this.layers = [
			this.make(40, .6, 1),
			this.make(55, 1.1, 1.4),
			this.make(28, 1.8, 2.2)
		];
	}
	make(n, minS, maxS) {
		const stars = [];
		for (let i = 0; i < n; i++) stars.push({
			x: Math.random() * this.w,
			y: Math.random() * this.h,
			z: minS + Math.random() * (maxS - minS),
			s: minS + Math.random() * (maxS - minS)
		});
		return stars;
	}
	step(dt, speed) {
		this.t += dt;
		const rates = [
			22,
			58,
			130
		];
		for (let i = 0; i < this.layers.length; i++) {
			const v = rates[i] * speed;
			for (const star of this.layers[i]) {
				star.y += v * dt * star.z;
				if (star.y > this.h + 4) {
					star.y = -4;
					star.x = Math.random() * this.w;
				}
			}
		}
	}
	draw(ctx, ox, oy) {
		const palettes = [
			COLORS.starFar,
			COLORS.starMid,
			COLORS.starNear
		];
		for (let i = 0; i < this.layers.length; i++) {
			ctx.fillStyle = palettes[i];
			for (const star of this.layers[i]) {
				ctx.globalAlpha = .55 + Math.sin(this.t * (1.2 + star.s) + star.x) * .35;
				ctx.fillRect(ox + star.x, oy + star.y, star.s, star.s);
			}
		}
		ctx.globalAlpha = 1;
	}
};
var SRC = {
	player: "/sprites/player.png",
	drone: "/sprites/enemy-drone.png",
	fighter: "/sprites/enemy-fighter.png",
	cruiser: "/sprites/enemy-cruiser.png",
	bolt: "/sprites/player-bolt.png",
	orb: "/sprites/enemy-orb.png",
	muzzle: "/sprites/muzzle.png",
	explosion: "/sprites/explosion.png",
	powerups: "/sprites/powerups.png"
};
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load ${src}`));
		img.src = src;
	});
}
async function loadSprites() {
	const entries = await Promise.all(Object.keys(SRC).map(async (key) => {
		return [key, {
			img: await loadImage(SRC[key]),
			cols: 2,
			rows: 2
		}];
	}));
	return Object.fromEntries(entries);
}
function drawSheet(ctx, sheet, frame, x, y, size, alpha = 1) {
	const fw = sheet.img.width / sheet.cols;
	const fh = sheet.img.height / sheet.rows;
	const i = (frame % (sheet.cols * sheet.rows) + sheet.cols * sheet.rows) % (sheet.cols * sheet.rows);
	const col = i % sheet.cols;
	const row = Math.floor(i / sheet.cols);
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.drawImage(sheet.img, col * fw, row * fh, fw, fh, x - size / 2, y - size / 2, size, size);
	ctx.restore();
}
function pool(n, make) {
	return Array.from({ length: n }, make);
}
function grab(arr) {
	for (const it of arr) if (!it.alive) return it;
	return null;
}
function circ(ax, ay, ar, bx, by, br) {
	const dx = ax - bx;
	const dy = ay - by;
	const r = ar + br;
	return dx * dx + dy * dy < r * r;
}
function pickupFrame(kind) {
	if (kind === "multi") return 0;
	if (kind === "shield") return 1;
	if (kind === "speed") return 2;
	return 3;
}
var GameEngine = class {
	canvas;
	ctx;
	input;
	audio = new AudioBus();
	stars = new Starfield();
	sprites = null;
	save;
	onHud;
	mode = "title";
	ready = false;
	worldW = 480;
	worldH = 800;
	view = {
		scale: 1,
		ox: 0,
		oy: 0,
		cssW: 1,
		cssH: 1
	};
	acc = 0;
	time = 0;
	raf = 0;
	last = 0;
	reduced = false;
	shakeOn = true;
	trauma = 0;
	freeze = 0;
	flashScreen = 0;
	player = this.freshPlayer();
	score = 0;
	wave = 1;
	combo = 0;
	comboT = 0;
	lastScore = 0;
	isHigh = false;
	initials = "AAA";
	waveTime = 0;
	spawned = 0;
	spawnPlan = [];
	waveClearT = 0;
	announcing = 0;
	returnMode = "title";
	playerBullets = pool(POOL.playerBullets, () => this.emptyBullet(true));
	enemyBullets = pool(POOL.enemyBullets, () => this.emptyBullet(false));
	enemies = pool(POOL.enemies, () => this.emptyEnemy());
	pickups = pool(POOL.pickups, () => ({
		alive: false,
		kind: "multi",
		x: 0,
		y: 0,
		vy: 70,
		age: 0
	}));
	particles = pool(POOL.particles, () => ({
		alive: false,
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		life: 0,
		max: 1,
		size: 2,
		color: COLORS.fg
	}));
	flashes = pool(POOL.flashes, () => ({
		alive: false,
		x: 0,
		y: 0,
		age: 0,
		max: .08
	}));
	blasts = pool(POOL.blasts, () => ({
		alive: false,
		x: 0,
		y: 0,
		age: 0,
		max: .4,
		size: 64
	}));
	floats = pool(POOL.floats, () => ({
		alive: false,
		x: 0,
		y: 0,
		vy: -40,
		age: 0,
		max: .8,
		text: "",
		color: COLORS.fg
	}));
	lastHud = "";
	running = false;
	unsubResize;
	unsubVis;
	constructor(canvas, onHud) {
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
	onResize = () => this.layout();
	onVis = () => {
		if (document.hidden) {
			if (this.mode === "playing") this.setMode("paused");
		} else this.audio.resume();
	};
	freshPlayer() {
		return {
			x: 240,
			y: 680,
			vx: 0,
			vy: 0,
			radius: 16,
			fireCd: 0,
			invuln: 0,
			flash: 0,
			lives: 3,
			multi: 0,
			shield: 0,
			speedT: 0,
			tilt: 0
		};
	}
	emptyBullet(fromPlayer) {
		return {
			alive: false,
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			radius: fromPlayer ? 5 : 6,
			ttl: 0,
			frame: 0,
			fromPlayer
		};
	}
	emptyEnemy() {
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
			drop: .1
		};
	}
	async boot() {
		const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 4e3));
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
		const loop = (now) => {
			this.raf = requestAnimationFrame(loop);
			let dt = (now - this.last) / 1e3;
			this.last = now;
			if (dt > .1) dt = DT_CAP;
			this.acc += dt;
			let steps = 0;
			while (this.acc >= .016666666666666666 && steps < 5) {
				this.tick(STEP);
				this.acc -= STEP;
				steps += 1;
			}
			this.draw();
		};
		this.raf = requestAnimationFrame(loop);
		this.boot();
	}
	destroy() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.input.destroy();
		this.unsubResize?.();
		this.unsubVis?.();
		if (window.__controlsTest) delete window.__controlsTest;
	}
	snapshot() {
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
			scores: this.save.scores
		};
	}
	emitHud() {
		const snap = this.snapshot();
		const key = JSON.stringify(snap);
		if (key === this.lastHud) return;
		this.lastHud = key;
		this.onHud(snap);
	}
	setMode(mode) {
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
	submitName(name) {
		const clean = (name || "AAA").replace(/[^A-Z]/gi, "").toUpperCase().padEnd(3, "A").slice(0, 3);
		this.save.scores = insertScore(this.save.scores, {
			name: clean,
			score: this.lastScore,
			wave: this.wave
		});
		writeSave(this.save);
		this.isHigh = false;
		this.audio.pickup();
		this.setMode("scores");
	}
	resetRun() {
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
	clearEntities() {
		for (const a of [
			this.playerBullets,
			this.enemyBullets,
			this.enemies,
			this.pickups,
			this.particles,
			this.flashes,
			this.blasts,
			this.floats
		]) for (const it of a) it.alive = false;
	}
	layout() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const cssW = Math.max(1, window.innerWidth);
		const cssH = Math.max(1, window.innerHeight);
		this.canvas.width = Math.floor(cssW * dpr);
		this.canvas.height = Math.floor(cssH * dpr);
		this.canvas.style.width = `${cssW}px`;
		this.canvas.style.height = `${cssH}px`;
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.worldW = 480;
		if (cssW >= cssH) {
			this.worldH = 800;
			const scale = Math.min(cssW / this.worldW, cssH / this.worldH);
			this.view = {
				scale,
				ox: (cssW - this.worldW * scale) / 2,
				oy: (cssH - this.worldH * scale) / 2,
				cssW,
				cssH
			};
		} else {
			this.worldH = Math.round(Math.min(920, Math.max(720, 480 * (cssH / cssW))));
			const scale = cssW / this.worldW;
			this.view = {
				scale,
				ox: 0,
				oy: (cssH - this.worldH * scale) / 2,
				cssW,
				cssH
			};
		}
		this.stars.rebuild(this.worldW, this.worldH);
		if (this.mode !== "playing") {
			this.player.x = this.worldW / 2;
			this.player.y = this.worldH - 90;
		}
	}
	clientToWorld(clientX, clientY) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: (clientX - rect.left - this.view.ox) / this.view.scale,
			y: (clientY - rect.top - this.view.oy) / this.view.scale
		};
	}
	installProbe() {
		window.__controlsTest = {
			getYaw: () => 0,
			getX: () => this.player.x,
			getY: () => this.player.y,
			getSpeed: () => Math.hypot(this.player.vx, this.player.vy),
			setKeys: (codes) => this.input.setInjected(codes),
			setSteer: (v) => this.input.setSteer(v)
		};
	}
	tick(dt) {
		this.input.sample();
		if (this.input.mutePressed) this.toggleMute();
		if (this.input.pausePressed) {
			if (this.mode === "playing") this.pause();
			else if (this.mode === "paused") this.resume();
		}
		const starSpeed = this.mode === "playing" ? 1 : this.mode === "paused" ? .15 : .45;
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
	animIdle(dt) {
		for (const p of this.particles) if (p.alive) this.stepParticle(p, dt);
		for (const b of this.blasts) if (b.alive) {
			b.age += dt;
			if (b.age >= b.max) b.alive = false;
		}
	}
	stepPlayer(dt) {
		const p = this.player;
		const axis = this.input.moveAxis();
		const speed = 320 * (p.speedT > 0 ? PLAYER_SPEED_BOOST : 1);
		let tx = axis.x * speed;
		let ty = axis.y * speed;
		const pointerDrive = !(this.input.injected.size > 0 || this.input.steerOverride != null) && (this.input.pointer.active || this.input.pointer.moved);
		if (pointerDrive) {
			const k = 1 - Math.exp(-12 * dt);
			p.x += (this.input.pointer.x - p.x) * k;
			p.y += (this.input.pointer.y - p.y) * k;
			tx += axis.x * speed * .35;
			ty += axis.y * speed * .35;
		}
		const damp = 1 - Math.exp(-14 * dt);
		p.vx += (tx - p.vx) * damp;
		p.vy += (ty - p.vy) * damp;
		if (!pointerDrive || axis.x || axis.y) {
			p.x += p.vx * dt;
			p.y += p.vy * dt;
		} else {
			p.vx = (this.input.pointer.x - p.x) / Math.max(dt, .001) * .15;
			p.vy = (this.input.pointer.y - p.y) / Math.max(dt, .001) * .15;
		}
		const m = 28;
		p.x = Math.max(m, Math.min(this.worldW - m, p.x));
		p.y = Math.max(68, Math.min(this.worldH - m, p.y));
		p.tilt += (p.vx / speed * .28 - p.tilt) * (1 - Math.exp(-10 * dt));
		if (p.fireCd > 0) p.fireCd -= dt;
		if (p.invuln > 0) p.invuln -= dt;
		if (p.flash > 0) p.flash -= dt;
		if (p.speedT > 0) p.speedT -= dt;
		this.autoFire();
	}
	autoFire() {
		const p = this.player;
		if (p.fireCd > 0) return;
		p.fireCd = PLAYER_FIRE * (p.speedT > 0 ? .85 : 1);
		const shots = this.shotPattern(p.multi);
		for (const s of shots) this.spawnPlayerBullet(p.x + s.x, p.y - 20, s.a);
		const fl = grab(this.flashes);
		if (fl) {
			fl.alive = true;
			fl.x = p.x;
			fl.y = p.y - 26;
			fl.age = 0;
			fl.max = .09;
		}
		this.audio.shoot();
	}
	shotPattern(multi) {
		if (multi <= 0) return [{
			x: 0,
			a: -Math.PI / 2
		}];
		if (multi === 1) return [{
			x: -10,
			a: -Math.PI / 2
		}, {
			x: 10,
			a: -Math.PI / 2
		}];
		if (multi === 2) return [
			{
				x: 0,
				a: -Math.PI / 2
			},
			{
				x: -12,
				a: -Math.PI / 2 - .16
			},
			{
				x: 12,
				a: -Math.PI / 2 + .16
			}
		];
		return [
			{
				x: 0,
				a: -Math.PI / 2
			},
			{
				x: -11,
				a: -Math.PI / 2 - .14
			},
			{
				x: 11,
				a: -Math.PI / 2 + .14
			},
			{
				x: -18,
				a: -Math.PI / 2 - .3
			},
			{
				x: 18,
				a: -Math.PI / 2 + .3
			}
		];
	}
	spawnPlayerBullet(x, y, angle) {
		const b = grab(this.playerBullets);
		if (!b) return;
		b.alive = true;
		b.x = x;
		b.y = y;
		b.vx = Math.cos(angle) * 560;
		b.vy = Math.sin(angle) * 560;
		b.ttl = 1.4;
		b.frame = 0;
		b.fromPlayer = true;
	}
	spawnEnemyBullet(x, y, angle, speed = 210) {
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
	buildWave(n) {
		const plan = [];
		const drones = Math.min(14, 5 + n);
		const fighters = Math.min(8, Math.floor(n / 2));
		const cruisers = Math.min(3, Math.floor((n - 1) / 4));
		let t = .2;
		const col = (i, count) => .14 + i % count * (.72 / Math.max(1, count - 1));
		for (let i = 0; i < drones; i++) {
			const pattern = n % 3 === 0 ? "weave" : n % 2 === 0 ? "sine" : "dive";
			plan.push({
				t,
				kind: "drone",
				x: col(i, Math.min(6, drones)),
				pattern
			});
			t += .18;
		}
		t += .4;
		for (let i = 0; i < fighters; i++) {
			plan.push({
				t,
				kind: "fighter",
				x: col(i + 1, Math.min(5, fighters + 1)),
				pattern: i % 2 === 0 ? "strafe" : "seek"
			});
			t += .45;
		}
		t += .5;
		for (let i = 0; i < cruisers; i++) {
			plan.push({
				t,
				kind: "cruiser",
				x: .3 + i * .2,
				pattern: "strafe"
			});
			t += .8;
		}
		if (n % 5 === 0) plan.push({
			t: t + .4,
			kind: "cruiser",
			x: .5,
			pattern: "seek"
		});
		this.spawnPlan = plan;
		this.spawned = 0;
		this.waveTime = 0;
		this.waveClearT = 0;
		this.announcing = 1.2;
	}
	stepWave(dt) {
		this.waveTime += dt;
		if (this.announcing > 0) this.announcing -= dt;
		while (this.spawned < this.spawnPlan.length && this.waveTime >= this.spawnPlan[this.spawned].t) {
			const s = this.spawnPlan[this.spawned];
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
	spawnEnemy(kind, x, y, pattern) {
		const e = grab(this.enemies);
		if (!e) return;
		const stats = kind === "drone" ? {
			hp: 1 + Math.floor((this.wave - 1) / 6),
			r: 14,
			speed: 95 + this.wave * 6,
			score: SCORE.drone,
			drop: .12,
			fire: 999
		} : kind === "fighter" ? {
			hp: 3 + Math.floor(this.wave / 4),
			r: 18,
			speed: 80 + this.wave * 4,
			score: SCORE.fighter,
			drop: .28,
			fire: 1.35
		} : {
			hp: 10 + this.wave * 2,
			r: 26,
			speed: 55 + this.wave * 2,
			score: SCORE.cruiser,
			drop: .55,
			fire: 1.7
		};
		e.alive = true;
		e.kind = kind;
		e.x = x;
		e.y = y;
		e.vx = 0;
		e.vy = stats.speed;
		e.radius = stats.r;
		e.hp = stats.hp;
		e.maxHp = stats.hp;
		e.fireCd = .4 + Math.random() * .6;
		e.age = 0;
		e.phase = Math.random() * Math.PI * 2;
		e.pattern = pattern;
		e.holdY = 140 + Math.random() * 80;
		e.baseSpeed = stats.speed;
		e.flash = 0;
		e.score = stats.score;
		e.drop = stats.drop;
	}
	stepEnemies(dt) {
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
					e.vy = e.baseSpeed * .72;
					e.vx = Math.sin(e.age * 2.3 + e.phase) * 120;
					break;
				case "weave":
					e.vy = e.baseSpeed * .8;
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
					const sp = e.baseSpeed * .85;
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
					} else if (e.kind === "fighter") this.spawnEnemyBullet(e.x, e.y + 14, ang);
					else this.spawnEnemyBullet(e.x, e.y + 10, Math.PI / 2, 178.5);
				}
			}
		}
		for (let i = 0; i < this.enemies.length; i++) {
			const a = this.enemies[i];
			if (!a.alive) continue;
			for (let j = i + 1; j < this.enemies.length; j++) {
				const b = this.enemies[j];
				if (!b.alive) continue;
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const min = a.radius + b.radius - 4;
				const d2 = dx * dx + dy * dy;
				if (d2 > 0 && d2 < min * min) {
					const d = Math.sqrt(d2) || .001;
					const push = (min - d) / d * .5;
					a.x -= dx * push * .5;
					a.y -= dy * push * .5;
					b.x += dx * push * .5;
					b.y += dy * push * .5;
				}
			}
		}
	}
	stepBullets(dt) {
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
	stepPickups(dt) {
		for (const p of this.pickups) {
			if (!p.alive) continue;
			p.age += dt;
			p.y += p.vy * dt;
			p.x += Math.sin(p.age * 3) * 18 * dt;
			if (p.y > this.worldH + 30) p.alive = false;
		}
	}
	stepFx(dt) {
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
	stepParticle(p, dt) {
		p.x += p.vx * dt;
		p.y += p.vy * dt;
		p.vy += 40 * dt;
		p.life -= dt;
		if (p.life <= 0) p.alive = false;
	}
	collide() {
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
			if (p.invuln <= 0) for (const e of this.enemies) {
				if (!e.alive) continue;
				if (circ(e.x, e.y, e.radius * .8, p.x, p.y, p.radius)) {
					this.hurtEnemy(e, 99);
					this.hurtPlayer();
					break;
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
	hurtEnemy(e, dmg) {
		e.hp -= dmg;
		e.flash = .08;
		this.burst(e.x, e.y, 5, COLORS.primary, 80);
		if (e.hp <= 0) {
			e.alive = false;
			this.combo += 1;
			this.comboT = 1.25;
			const mul = 1 + Math.min(8, this.combo) * .15;
			const gained = Math.round(e.score * mul);
			this.score += gained;
			this.float(e.x, e.y, `+${gained}`, COLORS.fg);
			this.explode(e.x, e.y, e.kind === "cruiser" ? 88 : 64);
			this.audio.explosion(e.kind === "cruiser");
			this.addTrauma(e.kind === "cruiser" ? .45 : .22);
			this.freeze = e.kind === "cruiser" ? .05 : .02;
			if (Math.random() < e.drop) this.dropPickup(e.x, e.y);
		}
	}
	hurtPlayer() {
		const p = this.player;
		if (p.invuln > 0) return;
		if (p.shield > 0) {
			p.shield -= 1;
			p.invuln = .6;
			p.flash = .2;
			this.audio.hit();
			this.addTrauma(.3);
			this.burst(p.x, p.y, 14, COLORS.primary, 140);
			return;
		}
		p.lives -= 1;
		p.invuln = PLAYER_INVULN;
		p.flash = .3;
		p.multi = Math.max(0, p.multi - 1);
		p.speedT = 0;
		this.audio.lifeLost();
		this.explode(p.x, p.y, 70);
		this.addTrauma(.7);
		this.freeze = .08;
		this.flashScreen = .35;
		if (p.lives <= 0) {
			p.lives = 0;
			this.gameOver();
		}
	}
	gameOver() {
		this.lastScore = this.score;
		this.isHigh = qualifies(this.save.scores, this.score);
		this.initials = "AAA";
		this.setMode("over");
		this.audio.explosion(true);
	}
	collect(kind) {
		const p = this.player;
		this.audio.pickup();
		this.addTrauma(.12);
		if (kind === "multi") p.multi = Math.min(3, p.multi + 1);
		if (kind === "shield") p.shield = Math.min(3, p.shield + 1);
		if (kind === "speed") p.speedT = Math.min(14, p.speedT + 8);
		if (kind === "life") p.lives = Math.min(6, p.lives + 1);
		const label = kind === "multi" ? "MULTI" : kind === "shield" ? "SHIELD" : kind === "speed" ? "SPEED" : "LIFE";
		this.float(p.x, p.y - 28, label, COLORS.primary);
		this.burst(p.x, p.y, 10, COLORS.primary, 90);
		this.emitHud();
	}
	dropPickup(x, y) {
		const u = grab(this.pickups);
		if (!u) return;
		const r = Math.random();
		const kind = r < .1 ? "life" : r < .4 ? "multi" : r < .7 ? "shield" : "speed";
		u.alive = true;
		u.kind = kind;
		u.x = x;
		u.y = y;
		u.vy = 70;
		u.age = 0;
	}
	explode(x, y, size) {
		const b = grab(this.blasts);
		if (b) {
			b.alive = true;
			b.x = x;
			b.y = y;
			b.age = 0;
			b.max = .42;
			b.size = size;
		}
		this.burst(x, y, 16, COLORS.danger, 180);
		this.burst(x, y, 8, COLORS.fg, 120);
	}
	burst(x, y, n, color, speed) {
		for (let i = 0; i < n; i++) {
			const p = grab(this.particles);
			if (!p) return;
			const a = Math.random() * Math.PI * 2;
			const s = speed * (.3 + Math.random());
			p.alive = true;
			p.x = x;
			p.y = y;
			p.vx = Math.cos(a) * s;
			p.vy = Math.sin(a) * s;
			p.life = .25 + Math.random() * .35;
			p.max = p.life;
			p.size = 1.5 + Math.random() * 2.5;
			p.color = color;
		}
	}
	float(x, y, text, color) {
		const f = grab(this.floats);
		if (!f) return;
		f.alive = true;
		f.x = x;
		f.y = y;
		f.vy = -46;
		f.age = 0;
		f.max = .85;
		f.text = text;
		f.color = color;
	}
	addTrauma(v) {
		if (!this.shakeOn || this.reduced) return;
		this.trauma = Math.min(1, this.trauma + v);
	}
	draw() {
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
			ctx.fillStyle = `rgba(255,92,122,${this.flashScreen * .25})`;
			ctx.fillRect(0, 0, cssW, cssH);
		}
	}
	drawVignette(ctx) {
		const g = ctx.createRadialGradient(this.worldW / 2, this.worldH / 2, this.worldH * .2, this.worldW / 2, this.worldH / 2, this.worldH * .72);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, "rgba(7,9,16,0.55)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, this.worldW, this.worldH);
	}
	drawWorld(ctx) {
		const sp = this.sprites;
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
			const alpha = e.flash > 0 ? .55 : 1;
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
			const fr = Math.min(3, Math.floor(f.age / f.max * 4));
			drawSheet(ctx, sp.muzzle, fr, f.x, f.y, 40, 1 - f.age / f.max);
		}
		const p = this.player;
		if (this.mode === "playing" || this.mode === "paused" || this.mode === "title") {
			if (!(p.invuln > 0 && Math.floor(this.time * 16) % 2 === 0) || this.mode === "title") {
				if (p.shield > 0) {
					ctx.save();
					ctx.strokeStyle = COLORS.primary;
					ctx.globalAlpha = .45 + Math.sin(t * 6) * .15;
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.arc(p.x, p.y, 28 + p.shield * 2, 0, Math.PI * 2);
					ctx.stroke();
					ctx.restore();
				}
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.tilt);
				drawSheet(ctx, sp.player, Math.floor(t * 8) % 4, 0, 0, 58, p.flash > 0 ? .7 : 1);
				ctx.restore();
			}
		}
		for (const b of this.blasts) {
			if (!b.alive) continue;
			const fr = Math.min(3, Math.floor(b.age / b.max * 4));
			drawSheet(ctx, sp.explosion, fr, b.x, b.y, b.size, 1 - b.age / b.max * .2);
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
			ctx.fillText(`WAVE ${this.wave}`, this.worldW / 2, this.worldH * .28);
			ctx.globalAlpha = 1;
		}
	}
	drawFallback(ctx) {
		ctx.fillStyle = COLORS.primary;
		ctx.beginPath();
		ctx.arc(this.player.x, this.player.y, 12, 0, Math.PI * 2);
		ctx.fill();
	}
};
function AphelionGame() {
	const canvasRef = (0, import_react.useRef)(null);
	const engineRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full touch-none select-none",
			style: { touchAction: "none" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlays, { engineRef })]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AphelionGame, {});
}
//#endregion
export { Home as component };
