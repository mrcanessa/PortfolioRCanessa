'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---
type EngineType = 'resident-evil' | 'doom' | 'classic';

const NOTES: Record<string, number> = {
  'E1': 41.20, 'A1': 55.00, 'D2': 73.42, 'G2': 98.00, 'B2': 123.47, 'E2': 164.81,
  'A2': 110.00, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61,
  'G3': 196.00, 'A3': 220.00, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63,
  'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'C5': 523.25, 'E5': 659.25,
};

// --- Engines Data ---

// 1. Resident Evil
const RE_CHORDS = [
  ['A2', 'E3', 'A3', 'C4', 'E4'], ['D3', 'A3', 'D4', 'F4'],
  ['E3', 'G3', 'E4', 'G4'], ['A2', 'C3', 'E3', 'A3', 'C4']
];
const RE_MELODY = [['E5', 'C5', 'A4', 'G4'], ['F4', 'E4', 'D4', 'C4']];

// 2. Doom (Industrial Metal - High Energy)
const DOOM_BASS = ['E1', 'E1', 'F1', 'E1', 'G1', 'E1', 'F1', 'E1']; // Syncopated chugs

// 3. Classic (Metallica - Gallop)
const CLASSIC_RIFF = ['E2', 'E2', 'E2', 'G2', 'A2', 'E2', 'E2', 'E2', 'D2', 'C2'];

// --- Utility: Distortion Curve (WaveShaper) ---
function makeDistortionCurve(amount: number) {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export default function AmbientMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEngine, setActiveEngine] = useState<EngineType>('resident-evil');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Audio Context & Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  
  // Active Sound References
  const activeOscRef = useRef<OscillatorNode[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const engineStateRef = useRef({ index: 0, subIndex: 0 });

  // --- Audio Setup ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.15, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Reverb (Resident Evil)
      const reverb = ctx.createConvolver();
      const length = ctx.sampleRate * 3.5;
      const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = impulse.getChannelData(c);
        for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
      reverb.buffer = impulse;
      const revGain = ctx.createGain();
      revGain.gain.value = 0.5;
      reverb.connect(revGain);
      revGain.connect(master);
      reverbRef.current = reverb;

      // Distortion (Doom/Classic)
      const dist = ctx.createWaveShaper();
      dist.curve = makeDistortionCurve(400);
      dist.oversample = '4x';
      const distGain = ctx.createGain();
      distGain.gain.value = 0.3;
      dist.connect(distGain);
      distGain.connect(master);
      distortionRef.current = dist;
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const cleanup = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
    activeOscRef.current.forEach(o => { try { o.stop(); } catch {} });
    activeOscRef.current = [];
    engineStateRef.current = { index: 0, subIndex: 0 };
  }, []);

  // --- Synthesis Helpers ---

  const playNote = useCallback((freq: number, duration: number, vol: number, type: OscillatorType, attack: number, release: number, useDist: boolean = false) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterGainRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
    gain.gain.setValueAtTime(vol, ctx.currentTime + duration - release);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    if (useDist && distortionRef.current) {
      osc.connect(gain);
      gain.connect(distortionRef.current);
    } else if (reverbRef.current) {
      osc.connect(gain);
      gain.connect(reverbRef.current);
      gain.connect(masterGainRef.current);
    }

    osc.start();
    osc.stop(ctx.currentTime + duration);
    activeOscRef.current.push(osc);
    osc.onended = () => activeOscRef.current = activeOscRef.current.filter(x => x !== osc);
  }, []);

  // --- Engines Implementation ---

  const startResidentEvil = useCallback(() => {
    const interval = setInterval(() => {
      const chord = RE_CHORDS[engineStateRef.current.index % RE_CHORDS.length];
      chord.forEach((n, i) => playNote(NOTES[n] || 220, 6, 0.04, 'sine', 1.5, 2, false));
      
      if (Math.random() > 0.5) {
        const mel = RE_MELODY[Math.floor(Math.random() * RE_MELODY.length)];
        mel.forEach((n, i) => playNote(NOTES[n] || 440, 2, 0.02, 'triangle', 0.2, 0.5, false));
      }
      engineStateRef.current.index++;
    }, 7000);
    intervalsRef.current.push(interval);
  }, [playNote]);

  const startDoom = useCallback(() => {
    // Aggressive industrial bass
    const interval = setInterval(() => {
      const note = DOOM_BASS[engineStateRef.current.index % DOOM_BASS.length];
      const freq = NOTES[note] || 40;
      // Double oscillators for fat tone
      playNote(freq, 0.2, 0.6, 'sawtooth', 0.01, 0.1, true);
      playNote(freq * 1.01, 0.2, 0.4, 'square', 0.01, 0.1, true);
      
      // Industrial noise/snare hint
      if (engineStateRef.current.index % 4 === 2) {
        playNote(100, 0.1, 0.2, 'square', 0.01, 0.05, true);
      }
      engineStateRef.current.index++;
    }, 200); // Fast tempo
    intervalsRef.current.push(interval);
  }, [playNote]);

  const startClassic = useCallback(() => {
    // Metallica-style galloping riff
    const interval = setInterval(() => {
      const note = CLASSIC_RIFF[engineStateRef.current.index % CLASSIC_RIFF.length];
      const freq = NOTES[note] || 82;
      
      // Determine rhythm: Gallop (1-2-3, 1-2-3)
      const isGallop = engineStateRef.current.index % 10 < 6;
      const speed = isGallop ? 150 : 300;
      
      // Power chord (Root + Fifth)
      playNote(freq, 0.15, 0.5, 'sawtooth', 0.005, 0.05, true);
      playNote(freq * 1.5, 0.15, 0.3, 'sawtooth', 0.005, 0.05, true);
      
      engineStateRef.current.index++;
    }, 180);
    intervalsRef.current.push(interval);
  }, [playNote]);

  // --- Control Logic ---

  const startMusic = useCallback((type: EngineType) => {
    cleanup();
    initAudio();
    setActiveEngine(type);
    
    if (type === 'resident-evil') startResidentEvil();
    else if (type === 'doom') startDoom();
    else if (type === 'classic') startClassic();

    setIsPlaying(true);
    setIsInitialized(true);
    try { localStorage.setItem('music-pref', type); } catch {}
  }, [cleanup, initAudio, startResidentEvil, startDoom, startClassic]);

  const stopMusic = useCallback(() => {
    cleanup();
    if (audioCtxRef.current) audioCtxRef.current.suspend();
    setIsPlaying(false);
    try { localStorage.setItem('music-pref', 'off'); } catch {}
  }, [cleanup]);

  const handleToggle = useCallback(() => {
    if (!isPlaying) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('music-pref') : null;
      startMusic(saved && saved !== 'off' ? (saved as EngineType) : activeEngine);
    } else {
      setMenuOpen(!menuOpen);
    }
  }, [isPlaying, activeEngine, startMusic, menuOpen]);

  // Pre-load preference
  useEffect(() => {
    const saved = localStorage.getItem('music-pref');
    if (saved && saved !== 'off') setActiveEngine(saved as EngineType);
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        
        {/* Menu de Selección */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                padding: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                marginBottom: '0.5rem'
              }}
            >
              <MenuButton 
                active={activeEngine === 'resident-evil' && isPlaying} 
                onClick={() => { startMusic('resident-evil'); setMenuOpen(false); }}
                icon="🧟" label="Resident Evil" 
              />
              <MenuButton 
                active={activeEngine === 'doom' && isPlaying} 
                onClick={() => { startMusic('doom'); setMenuOpen(false); }}
                icon="🔥" label="Doom Eternal" 
              />
              <MenuButton 
                active={activeEngine === 'classic' && isPlaying} 
                onClick={() => { startMusic('classic'); setMenuOpen(false); }}
                icon="🤘" label="Metallica Style" 
              />
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.2rem 0' }} />
              <MenuButton 
                active={false} 
                onClick={() => { stopMusic(); setMenuOpen(false); }}
                icon="🚫" label="Apagar Música" red
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón Principal Toggle */}
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={handleToggle}
            className="music-toggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: isPlaying 
                ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)'
                : 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)',
              border: isPlaying ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(59,130,246,0.3)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)',
              boxShadow: isPlaying ? '0 0 20px rgba(34,197,94,0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '20px' }}>
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={isPlaying ? {
                    height: activeEngine === 'doom' ? ['8px', '22px', '6px', '20px', '8px'] : 
                            activeEngine === 'classic' ? ['6px', '16px', '6px', '16px', '6px'] :
                            ['6px', '18px', '10px', '16px', '6px'],
                  } : { height: '6px' }}
                  transition={isPlaying ? {
                    duration: activeEngine === 'doom' ? 0.4 + i*0.1 : 0.8 + i*0.15,
                    repeat: Infinity,
                    delay: i * 0.1,
                  } : {}}
                  style={{
                    width: '3px',
                    height: '6px',
                    borderRadius: '2px',
                    background: 'white',
                  }}
                />
              ))}
            </div>
          </motion.button>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                style={{ position: 'absolute', right: '70px', top: '15px', background: 'rgba(15,23,42,0.9)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: 'white', whiteSpace: 'nowrap', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                🎵 Click para música
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function MenuButton({ icon, label, onClick, active, red }: { icon: string, label: string, onClick: () => void, active: boolean, red?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 5, background: 'rgba(255,255,255,0.08)' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.6rem 1rem',
        width: '100%',
        borderRadius: '10px',
        color: red ? '#f87171' : active ? 'var(--accent-green)' : 'rgba(255,255,255,0.8)',
        fontSize: '0.9rem',
        fontWeight: active ? 700 : 500,
        background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      {label}
      {active && <motion.div layoutId="active-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-green)', marginLeft: 'auto' }} />}
    </motion.button>
  );
}
