import type { Language } from '../types';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private isSpeaking = false;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public addListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public speak(text: string, lang: Language = 'bn', rate: number = 0.95): void {
    if (!this.synth) {
      this.playChime('info');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language to BCP 47 tags
    const langMap: Record<Language, string[]> = {
      bn: ['bn-IN', 'bn-BD', 'bn'],
      hi: ['hi-IN', 'hi'],
      mr: ['mr-IN', 'mr', 'hi-IN'], // Marathi with fallback to Hindi voice if Marathi voice isn't present
      en: ['en-IN', 'en-GB', 'en-US', 'en'],
    };

    const targetLangs = langMap[lang] || ['en-IN'];
    const voices = this.synth.getVoices();
    
    // Find matching voice
    let matchedVoice: SpeechSynthesisVoice | null = null;
    for (const targetLang of targetLangs) {
      matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang.toLowerCase())) || null;
      if (matchedVoice) break;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = targetLangs[0];
    }

    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => this.notify(false);
    utterance.onerror = () => this.notify(false);

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Tactile Sound Effects via Web Audio API (Essential for low-literacy immediate acoustic feedback)
  public playChime(type: 'click' | 'camera' | 'success' | 'alert' | 'info' | 'healthy'): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'camera') {
        // Camera shutter acoustic
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.setValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success' || type === 'healthy') {
        // Harmonic uplifting chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'alert') {
        // Warning dual tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(300, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Gentle bell
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // AudioContext not allowed before user gesture
    }
  }
}

export const speechService = new SpeechService();
