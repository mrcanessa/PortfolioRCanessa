'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Resident Evil "Save Room" inspired polyphonic synthesizer
// Uses Web Audio API to generate dark, atmospheric pads with reverb

const NOTES: Record<string, number> = {
  'A2': 110.00, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61,
  'G3': 196.00, 'A3': 220.00, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63,
  'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'C5': 523.25, 'E5': 659.25,
};

// Dark minor chord progressions inspired by RE save room
const CHORD_PROGRESSION = [
  ['A2', 'E3', 'A3', 'C4', 'E4'],       // Am
  ['D3', 'A3', 'D4', 'F4'],              // Dm
  ['E3', 'G3', 'E4', 'G4'],              // Em (dark)
  ['A2', 'C3', 'E3', 'A3', 'C4'],        // Am (open voicing)
  ['F3', 'A3', 'C4', 'F4'],              // F major (bittersweet)
  ['D3', 'F3', 'A3', 'D4'],              // Dm
  ['E3', 'G3', 'A3', 'E4'],              // Am/E
  ['A2', 'E3', 'A3', 'C4', 'E4', 'A4'], // Am (full)
];

// Melody fragments (single notes, played softly over the pads)
const MELODY_FRAGMENTS = [
  ['E5', 'C5', 'A4', 'G4'],
  ['F4', 'E4', 'D4', 'C4'],
  ['A4', 'G4', 'E4', 'D4'],
  ['C5', 'A4', 'F4', 'E4'],
];

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const activeOscRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const melodyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chordIndexRef = useRef(0);
  const melodyIndexRef = useRef(0);

  // Create a synthetic impulse response for reverb
  const createReverb = useCallback((ctx: AudioContext): ConvolverNode => {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const length = rate * 3.5; // 3.5 second reverb tail
    const impulse = ctx.createBuffer(2, length, rate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Exponential decay with random noise for natural reverb
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = impulse;
    return convolver;
  }, []);

  // Play a single pad note with slow attack/release
  const playPadNote = useCallback((freq: number, duration: number, volume: number, delayTime: number = 0) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    const reverb = convolverRef.current;
    if (!ctx || !master || !reverb) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm pad sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delayTime);

    // Add slight detune for richness
    osc.detune.setValueAtTime((Math.random() - 0.5) * 12, ctx.currentTime);

    // Low-pass filter for warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);

    // Slow attack, sustain, slow release (pad envelope)
    const attackTime = 1.8 + Math.random() * 0.8;
    const releaseTime = 2.0 + Math.random() * 1.0;
    const startTime = ctx.currentTime + delayTime;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + attackTime);
    gain.gain.setValueAtTime(volume, startTime + duration - releaseTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    // Route: osc -> filter -> gain -> reverb -> master
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(reverb);
    // Also send dry signal
    gain.connect(master);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    activeOscRef.current.push(osc);
    osc.onended = () => {
      activeOscRef.current = activeOscRef.current.filter(o => o !== osc);
    };
  }, []);

  // Play a melody note (brighter, shorter)
  const playMelodyNote = useCallback((freq: number, duration: number, volume: number, delayTime: number = 0) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    const reverb = convolverRef.current;
    if (!ctx || !master || !reverb) return;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator(); // Second oscillator for shimmer
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc2.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delayTime);
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime + delayTime); // Octave up, very soft
    osc2.detune.setValueAtTime(5, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const startTime = ctx.currentTime + delayTime;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.3);
    gain.gain.setValueAtTime(volume * 0.7, startTime + duration * 0.6);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(reverb);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
    osc2.start(startTime);
    osc2.stop(startTime + duration + 0.1);

    activeOscRef.current.push(osc, osc2);
    const cleanup = (o: OscillatorNode) => {
      activeOscRef.current = activeOscRef.current.filter(x => x !== o);
    };
    osc.onended = () => cleanup(osc);
    osc2.onended = () => cleanup(osc2);
  }, []);

  // Play the next chord in the progression
  const playNextChord = useCallback(() => {
    const chord = CHORD_PROGRESSION[chordIndexRef.current % CHORD_PROGRESSION.length];
    const chordDuration = 6.5 + Math.random() * 2; // 6.5-8.5 seconds per chord

    chord.forEach((note, i) => {
      const freq = NOTES[note];
      if (freq) {
        const vol = i === 0 ? 0.06 : 0.035 + Math.random() * 0.015;
        playPadNote(freq, chordDuration, vol, i * 0.15);
      }
    });

    chordIndexRef.current++;
  }, [playPadNote]);

  // Play melody fragments occasionally
  const playMelodyFragment = useCallback(() => {
    if (Math.random() > 0.6) return; // Only play 40% of the time for subtlety

    const fragment = MELODY_FRAGMENTS[melodyIndexRef.current % MELODY_FRAGMENTS.length];
    fragment.forEach((note, i) => {
      const freq = NOTES[note];
      if (freq) {
        playMelodyNote(freq, 1.8 + Math.random() * 0.5, 0.02 + Math.random() * 0.01, i * 1.5);
      }
    });
    melodyIndexRef.current++;
  }, [playMelodyNote]);

  const startMusic = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Master gain (overall volume control)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Create reverb and connect to master
      const reverb = createReverb(ctx);
      const reverbGain = ctx.createGain();
      reverbGain.gain.setValueAtTime(0.6, ctx.currentTime);
      reverb.connect(reverbGain);
      reverbGain.connect(masterGain);
      convolverRef.current = reverb;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    // Play first chord immediately
    playNextChord();

    // Schedule chord changes  
    intervalRef.current = setInterval(() => {
      playNextChord();
    }, 7000);

    // Schedule melody fragments
    melodyIntervalRef.current = setInterval(() => {
      playMelodyFragment();
    }, 12000);

    setIsPlaying(true);
    setIsInitialized(true);
    setShowTooltip(false);
    
    try {
      localStorage.setItem('portfolio-music-pref', 'on');
    } catch {}
  }, [createReverb, playNextChord, playMelodyFragment]);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (melodyIntervalRef.current) clearInterval(melodyIntervalRef.current);

    // Gracefully stop all oscillators
    activeOscRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    activeOscRef.current = [];

    if (audioCtxRef.current) {
      audioCtxRef.current.suspend();
    }

    setIsPlaying(false);
    try {
      localStorage.setItem('portfolio-music-pref', 'off');
    } catch {}
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (melodyIntervalRef.current) clearInterval(melodyIntervalRef.current);
      activeOscRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <>
      {/* Music Toggle Button */}
      <motion.button
        id="music-toggle"
        onClick={toggleMusic}
        onMouseEnter={() => !isInitialized && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="music-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isPlaying ? { boxShadow: ['0 0 15px rgba(34,197,94,0.3)', '0 0 30px rgba(34,197,94,0.5)', '0 0 15px rgba(34,197,94,0.3)'] } : {}}
        transition={isPlaying ? { duration: 2, repeat: Infinity } : {}}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isPlaying 
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
          border: isPlaying 
            ? '2px solid rgba(34,197,94,0.6)'
            : '2px solid rgba(59,130,246,0.3)',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          fontSize: '1.4rem',
        }}
      >
        {/* Sound wave bars animation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '20px' }}>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                height: ['6px', '18px', '10px', '16px', '6px'],
              } : { height: '6px' }}
              transition={isPlaying ? {
                duration: 0.8 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              } : {}}
              style={{
                width: '3px',
                height: '6px',
                borderRadius: '2px',
                background: isPlaying ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: 'fixed',
              bottom: '2.5rem',
              right: '5.5rem',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.8)',
              zIndex: 1000,
              backdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap',
            }}
          >
            🎵 Activar ambiente sonoro
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
