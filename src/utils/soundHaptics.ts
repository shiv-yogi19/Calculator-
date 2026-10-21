/**
 * Audio Synthesizer & Tactile Feedback for NEXCAL
 * Uses Web Audio API oscillator for zero-latency, realistic touch sounds
 */

class SoundHapticsEngine {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play button sound
   */
  public playClick(type: 'number' | 'operator' | 'equals' | 'clear' | 'toggle', volume: number = 0.5): void {
    if (volume <= 0) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      let freq = 600;
      let duration = 0.035;

      switch (type) {
        case 'number':
          freq = 520;
          duration = 0.025;
          osc.type = 'sine';
          break;
        case 'operator':
          freq = 780;
          duration = 0.035;
          osc.type = 'triangle';
          break;
        case 'equals':
          freq = 880;
          duration = 0.065;
          osc.type = 'sine';
          break;
        case 'clear':
          freq = 380;
          duration = 0.04;
          osc.type = 'square';
          break;
        case 'toggle':
          freq = 640;
          duration = 0.03;
          osc.type = 'sine';
          break;
      }

      osc.frequency.setValueAtTime(freq, now);
      if (type === 'equals') {
        osc.frequency.exponentialRampToValueAtTime(1180, now + duration);
      }

      gain.gain.setValueAtTime(volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay or permissions prevented
    }
  }

  /**
   * Trigger device vibration
   */
  public triggerVibration(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (typeof window === 'undefined' || !navigator.vibrate) return;
    try {
      const durations = {
        light: 8,
        medium: 18,
        heavy: 35,
      };
      navigator.vibrate(durations[intensity] || 8);
    } catch {
      // Ignore vibration error
    }
  }
}

export const soundHaptics = new SoundHapticsEngine();
