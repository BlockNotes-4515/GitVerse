/**
 * Procedural Web Audio API Sound Synthesizer
 * 100% code-generated audio with zero external audio assets.
 */

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  private init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambient Cosmic Drone setup
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.connect(this.masterGain);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.droneGain.connect(filter);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
      this.droneOsc1.connect(this.droneGain);
      this.droneOsc1.start();

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(82.4, this.ctx.currentTime); // E2 fifth
      this.droneOsc2.connect(this.droneGain);
      this.droneOsc2.start();

      this.isInitialized = true;
    } catch {
      // Web Audio unsupported
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const targetGain = this.isMuted ? 0 : 0.4;
    this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);

    if (!this.isMuted) {
      this.playSelectChime();
    }

    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playHoverTone(freq: number = 440) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio error fallback
    }
  }

  public playSelectChime() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.45);
      });
    } catch {
      // Audio error fallback
    }
  }

  public playWarpTransition() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.8);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch {
      // Audio error fallback
    }
  }
}

export const cosmicAudio = new CosmicAudioEngine();
