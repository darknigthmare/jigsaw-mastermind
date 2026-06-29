// Web Audio API Synthesizer for Jigsaw Mastermind Console
// Synthesizes retro sounds natively in the browser without loading heavy audio assets.

let audioCtx: AudioContext | null = null;
let tapeHumNode: OscillatorNode | null = null;
let tapeHumGain: GainNode | null = null;
let tapeNoiseNode: AudioWorkletNode | ScriptProcessorNode | null = null; // raw white noise source
let soundEnabled = true;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (!enabled) {
    stopTapeHum();
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Play a vintage typewriter key click sound
 */
export function playClick(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    // Add minor pitch drop for click mechanicality
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

    // Highpass filter to isolate click snap
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    console.error('Audio click synthesis failed', e);
  }
}

/**
 * Play standard terminal interface beep
 */
export function playBeep(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.error('Audio beep synthesis failed', e);
  }
}

/**
 * Play successful puzzle solution chime
 */
export function playChime(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    
    // Play two notes in arpeggio (C5 then G5)
    const playNote = (freq: number, delay: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.35);
    };

    playNote(523.25, 0, 0.04);      // C5
    playNote(783.99, 0.12, 0.03);   // G5
  } catch (e) {
    console.error('Audio chime synthesis failed', e);
  }
}

/**
 * Play failure alert/wrong answer alarm buzz
 */
export function playAlarm(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // low buzz
    // Warble frequency
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  } catch (e) {
    console.error('Audio alarm synthesis failed', e);
  }
}

/**
 * Play Nixie low time ticking sound
 */
export function playTick(isCritical: boolean = false): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCritical ? 1500 : 900, ctx.currentTime);

    gain.gain.setValueAtTime(isCritical ? 0.03 : 0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    console.error('Audio tick synthesis failed', e);
  }
}

/**
 * Start a continuous low mechanical tape deck hum
 */
export function startTapeHum(): void {
  if (!soundEnabled) return;
  if (tapeHumNode) return; // already hummin'

  try {
    const ctx = getAudioContext();
    
    // 1. Low frequency motor hum (55Hz - G1 note + 110Hz harmonic)
    tapeHumNode = ctx.createOscillator();
    tapeHumGain = ctx.createGain();
    
    tapeHumNode.type = 'sine';
    tapeHumNode.frequency.setValueAtTime(55, ctx.currentTime);
    
    tapeHumGain.gain.setValueAtTime(0, ctx.currentTime);
    // Smooth fade-in
    tapeHumGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 1.0);
    
    tapeHumNode.connect(tapeHumGain);
    tapeHumGain.connect(ctx.destination);
    
    // 2. Add high frequency tape hiss/noise simulation
    // Using a ScriptProcessorNode to generate standard white noise
    if (ctx.createScriptProcessor) {
      const bufferSize = 4096;
      tapeNoiseNode = ctx.createScriptProcessor(bufferSize, 1, 1);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 1.0); // very soft
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(8000, ctx.currentTime);
      filter.Q.setValueAtTime(1.0, ctx.currentTime);

      tapeNoiseNode.onaudioprocess = (e) => {
        const outputBuffer = e.outputBuffer;
        const channelData = outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          channelData[i] = Math.random() * 2 - 1;
        }
      };

      tapeNoiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
    }
    
    tapeHumNode.start();
  } catch (e) {
    console.error('Failed starting tape hum synthesis', e);
  }
}

/**
 * Stop the mechanical tape deck hum
 */
export function stopTapeHum(): void {
  try {
    const ctx = audioCtx;
    if (ctx && tapeHumNode && tapeHumGain) {
      tapeHumGain.gain.setValueAtTime(tapeHumGain.gain.value, ctx.currentTime);
      tapeHumGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      const nodeToStop = tapeHumNode;
      setTimeout(() => {
        try {
          nodeToStop.stop();
          nodeToStop.disconnect();
        } catch (e) {}
      }, 350);
    }

    if (tapeNoiseNode) {
      tapeNoiseNode.disconnect();
    }
  } catch (e) {
    console.error('Failed stopping tape hum', e);
  } finally {
    tapeHumNode = null;
    tapeHumGain = null;
    tapeNoiseNode = null;
  }
}
