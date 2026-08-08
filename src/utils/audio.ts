class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private soundGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private isAmbientRunning: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.soundGain = this.ctx.createGain();
      this.soundGain.gain.value = 0.8;
      this.soundGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.5;
      this.musicGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.3;
      this.ambientGain.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSound(type: 'click' | 'step' | 'roar' | 'capture' | 'eggCracking' | 'portal' | 'attack' | 'victory' | 'mount' | 'craft') {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 0.08);
        break;
      }

      case 'step': {
        const bufferSize = this.ctx.sampleRate * 0.06;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400 + Math.random() * 200, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.soundGain!);
        whiteNoise.start(t);
        break;
      }

      case 'roar': {
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc2.type = 'square';

        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.8);
        osc2.frequency.setValueAtTime(160, t);
        osc2.frequency.exponentialRampToValueAtTime(80, t + 0.8);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.soundGain!);

        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.9);
        osc2.stop(t + 0.9);
        break;
      }

      case 'capture': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.5);

        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 0.5);
        break;
      }

      case 'eggCracking': {
        for (let i = 0; i < 3; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = t + i * 0.15;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1500 + i * 300, startTime);
          osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.1);
          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.linearRampToValueAtTime(0.01, startTime + 0.1);

          osc.connect(gain);
          gain.connect(this.soundGain!);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        }
        break;
      }

      case 'portal': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 1.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.6, t + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 1.5);
        break;
      }

      case 'attack': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.2);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      }

      case 'victory': {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const startTime = t + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.4, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

          osc.connect(gain);
          gain.connect(this.soundGain!);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
        break;
      }

      case 'mount': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, t);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.25);

        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 0.25);
        break;
      }

      case 'craft': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.15);

        osc.connect(gain);
        gain.connect(this.soundGain!);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
      }
    }
  }

  public startJungleAmbiance() {
    this.initContext();
    if (!this.ctx || this.isAmbientRunning) return;
    this.isAmbientRunning = true;

    // Gentle bird chirp interval
    const scheduleBird = () => {
      if (!this.isAmbientRunning || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 2000 + Math.random() * 1500;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.16);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.2);

      osc.connect(gain);
      gain.connect(this.ambientGain!);
      osc.start(t);
      osc.stop(t + 0.2);

      setTimeout(scheduleBird, 2000 + Math.random() * 5000);
    };

    scheduleBird();
  }

  public setVolume(volume: number) {
    this.masterVolume = volume;
    if (this.soundGain && this.ctx) {
      this.soundGain.gain.setValueAtTime(volume * 0.8, this.ctx.currentTime);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.soundGain && this.ctx) {
      this.soundGain.gain.value = muted ? 0 : this.masterVolume * 0.8;
    }
  }
}

export const sound = new SoundEngine();
