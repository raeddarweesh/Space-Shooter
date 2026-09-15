function env(ctx: AudioContext, gain: GainNode, peak: number, attack: number, decay: number) {
  const t = ctx.currentTime;
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

export class AudioBus {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  sfx: GainNode | null = null;
  muted = false;
  private noise: AudioBuffer | null = null;

  unlock() {
    if (!this.ctx) {
      const ctx = new AudioContext({ latencyHint: "interactive" });
      this.ctx = ctx;
      this.master = ctx.createGain();
      this.sfx = ctx.createGain();
      this.sfx.gain.value = 0.7;
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.sfx.connect(this.master);
      this.master.connect(ctx.destination);
      this.noise = this.makeNoise(ctx);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.9, this.ctx.currentTime, 0.02);
    }
  }

  private makeNoise(ctx: AudioContext) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private tone(freq: number, dur: number, type: OscillatorType, peak: number, detune = 0) {
    if (!this.ctx || !this.sfx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq * (1 + (Math.random() * 2 - 1) * 0.04);
    osc.detune.value = detune;
    env(this.ctx, g, peak, 0.006, dur);
    osc.connect(g);
    g.connect(this.sfx);
    osc.start();
    osc.stop(this.ctx.currentTime + dur + 0.05);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  shoot() {
    this.tone(720, 0.07, "square", 0.045);
    this.tone(1480, 0.04, "triangle", 0.02);
  }

  enemyShoot() {
    this.tone(240, 0.09, "sawtooth", 0.03);
  }

  explosion(heavy = false) {
    if (!this.ctx || !this.sfx || !this.noise) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = heavy ? 0.5 : 0.85;
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = heavy ? 480 : 900;
    env(this.ctx, g, heavy ? 0.28 : 0.16, 0.004, heavy ? 0.45 : 0.22);
    src.connect(f);
    f.connect(g);
    g.connect(this.sfx);
    src.start();
    src.stop(this.ctx.currentTime + 0.5);
  }

  hit() {
    this.tone(90, 0.18, "sine", 0.18);
    this.tone(180, 0.1, "square", 0.05);
  }

  pickup() {
    this.tone(523, 0.08, "triangle", 0.08);
    this.tone(784, 0.12, "sine", 0.07);
  }

  wave() {
    this.tone(220, 0.18, "triangle", 0.05);
    this.tone(330, 0.22, "sine", 0.04);
  }

  ui() {
    this.tone(620, 0.06, "triangle", 0.05);
  }

  lifeLost() {
    this.tone(196, 0.2, "sawtooth", 0.08);
    this.tone(130, 0.28, "sine", 0.1);
  }

  resume() {
    if (this.ctx?.state === "suspended") void this.ctx.resume();
  }
}
