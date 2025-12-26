// 音效服務：使用 Web Audio API 處理背景音樂 (BGM)、環境音效 (Ambience) 與操作音效 (SFX)。

import { WeatherType, LocationId } from '../types';

type AudioMode = 'NONE' | 'AMBIENCE' | 'MUSIC';

class SoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null; // Renamed from ambienceGain to be generic BGM channel
  
  // Ambience Nodes
  private noiseNode: AudioBufferSourceNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;

  // Music Nodes
  private musicInterval: any = null;
  private musicNodes: AudioNode[] = [];

  private isMuted: boolean = false;
  private initialized: boolean = false;
  private audioMode: AudioMode = 'AMBIENCE'; // Default
  
  // Noise generation state
  private lastOut: number = 0;

  // Volume States (0.0 - 1.0)
  public volumes = {
    master: 0.5,
    sfx: 0.5,
    bgm: 0.5 
  };

  private currentLocation: LocationId = 'pond';
  private currentWeather: WeatherType = 'Sunny';

  constructor() {}

  public init() {
    if (this.initialized) return;
    
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      this.ctx = new AudioContextClass();
      
      // 1. Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volumes.master;
      this.masterGain.connect(this.ctx.destination);
      
      // 2. BGM Channel (Used for both Ambience and Music)
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.volumes.bgm;
      this.bgmGain.connect(this.masterGain);

      // 3. SFX Channel
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.volumes.sfx;
      this.sfxGain.connect(this.masterGain);
      
      this.initialized = true;
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.applyAudioMode();
    } catch (e) {
      console.error("Audio init failed", e);
    }
  }

  public setAudioMode(mode: AudioMode) {
      this.audioMode = mode;
      this.applyAudioMode();
  }

  public getAudioMode() {
      return this.audioMode;
  }

  private applyAudioMode() {
      if (!this.initialized) return;
      
      // Stop everything first
      this.stopAmbience();
      this.stopMusic();

      if (this.audioMode === 'AMBIENCE') {
          this.startAmbience();
          this.updateAmbience(this.currentLocation, this.currentWeather);
      } else if (this.audioMode === 'MUSIC') {
          this.startMusic();
      }
  }

  public setVolume(type: 'master' | 'sfx' | 'bgm', value: number) {
    this.volumes[type] = Math.max(0, Math.min(1, value));
    
    if (!this.ctx || !this.masterGain || !this.sfxGain || !this.bgmGain) return;
    const t = this.ctx.currentTime;

    if (type === 'master') {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.master, t, 0.1);
    } else if (type === 'sfx') {
      this.sfxGain.gain.setTargetAtTime(this.volumes.sfx, t, 0.1);
    } else if (type === 'bgm') {
      this.bgmGain.gain.setTargetAtTime(this.volumes.bgm, t, 0.1);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volumes.master, t, 0.1);
    }
    return this.isMuted;
  }

  // --- HAPTICS ---
  public vibrate(pattern: number | number[]) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
              navigator.vibrate(pattern);
          } catch (e) {
              // Ignore errors (some browsers/devices restrict this)
          }
      }
  }

  // --- AMBIENCE GENERATOR (White Noise) ---
  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (this.lastOut + (0.02 * white)) / 1.02; 
      this.lastOut = output[i];
      output[i] *= 3.5; 
    }
    return buffer;
  }

  private startAmbience() {
    if (!this.ctx || !this.bgmGain) return;
    
    const buffer = this.createNoiseBuffer();
    if (!buffer) return;

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    this.ambienceFilter = this.ctx.createBiquadFilter();
    
    this.noiseNode.connect(this.ambienceFilter);
    this.ambienceFilter.connect(this.bgmGain);

    this.noiseNode.start();
  }

  private stopAmbience() {
      if (this.noiseNode) { try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch(e){} this.noiseNode = null; }
      if (this.ambienceFilter) { this.ambienceFilter.disconnect(); this.ambienceFilter = null; }
      this.stopOceanLFO();
  }

  public updateAmbience(location: LocationId, weather: WeatherType) {
    this.currentLocation = location;
    this.currentWeather = weather;

    if (this.audioMode !== 'AMBIENCE') return;
    if (!this.ctx || !this.ambienceFilter) return;

    const t = this.ctx.currentTime;
    let cutoff = 200;
    let type: BiquadFilterType = 'lowpass';
    
    if (weather === 'Storm') {
      cutoff = 1000;
      this.stopOceanLFO();
    } else if (weather === 'Rain') {
      cutoff = 600;
      this.stopOceanLFO();
    } else if (location === 'ocean') {
      cutoff = 300;
      this.startOceanLFO();
    } else if (location === 'river') {
      type = 'bandpass';
      cutoff = 400;
      this.stopOceanLFO();
    } else {
      cutoff = 150; // Pond quiet
      this.stopOceanLFO();
    }

    this.ambienceFilter.type = type;
    if (location !== 'ocean') {
        this.ambienceFilter.frequency.setTargetAtTime(cutoff, t, 2);
    }
  }

  private startOceanLFO() {
    if (!this.ctx || !this.ambienceFilter) return;
    if (this.lfo) return; 

    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.15; 

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 400; 

    this.lfo.connect(lfoGain);
    lfoGain.connect(this.ambienceFilter.frequency);
    
    this.ambienceFilter.frequency.value = 300; 
    this.lfo.start();
  }

  private stopOceanLFO() {
    if (this.lfo) {
      try { this.lfo.stop(); } catch(e){}
      this.lfo.disconnect();
      this.lfo = null;
    }
  }

  // --- PROCEDURAL MUSIC GENERATOR (Relaxing) ---
  private startMusic() {
      if (!this.ctx || !this.bgmGain) return;
      
      // Simple generative Pentatonic Ambient
      const notes = [196.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      
      const playNote = () => {
          if (!this.ctx || this.audioMode !== 'MUSIC') return;
          
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          
          osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
          
          const note = notes[Math.floor(Math.random() * notes.length)];
          const octave = Math.random() > 0.8 ? 2 : (Math.random() > 0.8 ? 0.5 : 1);
          
          osc.frequency.value = note * octave;
          
          const t = this.ctx.currentTime;
          const attack = 0.5 + Math.random();
          const decay = 2 + Math.random() * 3;
          
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.1, t + attack);
          gain.gain.exponentialRampToValueAtTime(0.001, t + attack + decay);
          
          osc.connect(gain);
          gain.connect(this.bgmGain!);
          
          osc.start(t);
          osc.stop(t + attack + decay + 1);
          
          setTimeout(() => {
              osc.disconnect();
              gain.disconnect();
          }, (attack + decay + 1) * 1000);
      };

      playNote();
      
      this.musicInterval = setInterval(() => {
          if (Math.random() > 0.3) playNote();
      }, 2500);
  }

  private stopMusic() {
      if (this.musicInterval) {
          clearInterval(this.musicInterval);
          this.musicInterval = null;
      }
  }

  // --- JAY CHOU EASTER EGG (Nocturne Melody Simulation) ---
  public playNocturne() {
      if (!this.ctx || !this.sfxGain) return;

      // Simplified melody notes for Nocturne chorus start (approx)
      // D#4, F4, F4, F4, D#4, D#4, C4, A#3... converted to frequency
      const melody = [
          { f: 311.13, d: 0.2 }, { f: 349.23, d: 0.2 }, { f: 349.23, d: 0.2 }, { f: 349.23, d: 0.4 }, 
          { f: 311.13, d: 0.2 }, { f: 311.13, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 233.08, d: 0.8 }
      ];

      let currentTime = this.ctx.currentTime + 0.1;

      melody.forEach(note => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          osc.type = 'triangle'; // Softer, piano-ish vibe
          osc.frequency.value = note.f;
          
          osc.connect(gain);
          gain.connect(this.sfxGain!); // Use SFX channel so it plays over BGM

          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.d);

          osc.start(currentTime);
          osc.stop(currentTime + note.d + 0.1);

          currentTime += note.d;
      });
  }

  // --- SFX ---
  public playSfx(type: 'CLICK' | 'CAST' | 'REEL' | 'CATCH' | 'SELL' | 'LEVEL_UP' | 'ERROR') {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain); 

    switch (type) {
      case 'CLICK':
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      case 'CAST':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      case 'REEL':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      case 'CATCH':
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, t); 
        osc.frequency.setValueAtTime(659.25, t + 0.1); 
        osc.frequency.setValueAtTime(783.99, t + 0.2); 
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
        break;
      case 'SELL':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      case 'LEVEL_UP':
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554, t + 0.1);
        osc.frequency.setValueAtTime(659, t + 0.2);
        osc.frequency.setValueAtTime(880, t + 0.4);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.8);
        osc.start(t);
        osc.stop(t + 0.8);
        break;
      case 'ERROR':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.2);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
    }
  }
}

export const soundManager = new SoundService();