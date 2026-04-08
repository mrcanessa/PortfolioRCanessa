'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---
type EngineType = 'resident-evil' | 'doom' | 'classic' | 'jamiroquai';

const NOTES: Record<string, number> = {
  'E1': 41.20, 'F1': 43.65, 'G1': 49.00, 'A1': 55.00, 'B1': 61.74, 
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'C5': 523.25, 'E5': 659.25,
};

// --- Engines Data ---

// 1. Slow Thinking (Resident Evil Style)
const RE_CHORDS = [
  ['A2', 'E3', 'A3', 'C4', 'E4'], ['D3', 'A3', 'D4', 'F4'],
  ['E3', 'G3', 'E4', 'G4'], ['A2', 'C3', 'E3', 'A3', 'C4']
];

// 2. Rock (Doom Style)
const DOOM_BASS = ['E1', 'E1', 'F1', 'E1', 'G1', 'E1', 'F1', 'E1'];

// 3. Metal (Metallica Style)
const CLASSIC_RIFF = ['E2', 'E2', 'E2', 'G2', 'A2', 'E2', 'E2', 'E2', 'D2', 'C2'];

// 4. Deep Core (Jamiroquai Style)
const JAMIROQUAI_RIFF = ['C#2', 'C#2', 'C#2', 'E2', 'C#2', 'C#2', 'B1', 'C#2'];

// --- Utility: Distortion Curve ---
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

  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const activeOscRef = useRef<OscillatorNode[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const engineStateRef = useRef({ index: 0, subIndex: 0 });

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.15, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      const reverb = ctx.createConvolver();
      const length = ctx.sampleRate * 2.5;
      const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = impulse.getChannelData(c);
        for (let i = 0; i < length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
      reverb.buffer = impulse;
      const revGain = ctx.createGain(); revGain.gain.value = 0.4;
      reverb.connect(revGain); revGain.connect(master);
      reverbRef.current = reverb;

      const dist = ctx.createWaveShaper(); dist.curve = makeDistortionCurve(400);
      const distGain = ctx.createGain(); distGain.gain.value = 0.3;
      dist.connect(distGain); distGain.connect(master);
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

  const playNote = useCallback((freq: number, duration: number, vol: number, type: OscillatorType, attack: number, release: number, useDist: boolean = false, useReverb: boolean = false) => {
    const ctx = audioCtxRef.current;
    if (!ctx || !masterGainRef.current) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    if (useDist) {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 4, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + duration);
        filter.Q.value = 3;
    }

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
    gain.gain.setValueAtTime(vol, ctx.currentTime + duration - release);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    if (useDist && distortionRef.current) {
      osc.connect(filter); filter.connect(gain); gain.connect(distortionRef.current);
    } else if (useReverb && reverbRef.current) {
      osc.connect(gain); gain.connect(reverbRef.current); gain.connect(masterGainRef.current);
    } else {
      osc.connect(gain); gain.connect(masterGainRef.current);
    }

    osc.start();
    osc.stop(ctx.currentTime + duration);
    activeOscRef.current.push(osc);
    osc.onended = () => activeOscRef.current = activeOscRef.current.filter(x => x !== osc);
  }, []);

  const startResidentEvil = useCallback(() => {
    intervalsRef.current.push(setInterval(() => {
      const chord = RE_CHORDS[engineStateRef.current.index % RE_CHORDS.length];
      chord.forEach(n => playNote(NOTES[n] || 220, 6, 0.05, 'sine', 1.5, 2, false, true));
      engineStateRef.current.index++;
    }, 7000));
  }, [playNote]);

  const startDoom = useCallback(() => {
    intervalsRef.current.push(setInterval(() => {
      const n = DOOM_BASS[engineStateRef.current.index % DOOM_BASS.length];
      playNote(NOTES[n]||40, 0.2, 0.5, 'sawtooth', 0.01, 0.1, true);
      engineStateRef.current.index++;
    }, 200));
  }, [playNote]);

  const startClassic = useCallback(() => {
    intervalsRef.current.push(setInterval(() => {
      const freq = NOTES[CLASSIC_RIFF[engineStateRef.current.index % CLASSIC_RIFF.length]] || 82;
      playNote(freq, 0.15, 0.4, 'sawtooth', 0.005, 0.05, true);
      playNote(freq * 1.5, 0.15, 0.2, 'sawtooth', 0.005, 0.05, true);
      engineStateRef.current.index++;
    }, 180));
  }, [playNote]);

  const startJamiroquai = useCallback(() => {
    const beat = 577;
    intervalsRef.current.push(setInterval(() => {
      const freq = NOTES[JAMIROQUAI_RIFF[engineStateRef.current.index % JAMIROQUAI_RIFF.length]] || 69.3;
      playNote(freq, 0.25, 0.6, 'sawtooth', 0.01, 0.1, true);
      if (engineStateRef.current.index % 4 === 2) {
        playNote(40, 0.05, 0.3, 'square', 0.01, 0.02, true);
      }
      engineStateRef.current.index++;
    }, beat / 2));
  }, [playNote]);

  const startMusic = useCallback((type: EngineType) => {
    cleanup(); initAudio(); setActiveEngine(type);
    if (type === 'resident-evil') startResidentEvil();
    else if (type === 'doom') startDoom();
    else if (type === 'classic') startClassic();
    else if (type === 'jamiroquai') startJamiroquai();
    setIsPlaying(true); setIsInitialized(true);
    try { localStorage.setItem('music-pref', type); } catch {}
  }, [cleanup, initAudio, startResidentEvil, startDoom, startClassic, startJamiroquai]);

  const stopMusic = useCallback(() => {
    cleanup(); if (audioCtxRef.current) audioCtxRef.current.suspend();
    setIsPlaying(false); try { localStorage.setItem('music-pref', 'off'); } catch {}
  }, [cleanup]);

  const handleToggle = useCallback(() => {
    if (!isPlaying) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('music-pref') : null;
      startMusic(saved && saved !== 'off' ? (saved as EngineType) : activeEngine);
    } else setMenuOpen(!menuOpen);
  }, [isPlaying, activeEngine, startMusic, menuOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('music-pref');
    if (saved && saved !== 'off' && saved !== 'magnetic') setActiveEngine(saved as EngineType);
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }}
              style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', marginBottom: '0.5rem' }}
            >
              <MenuButton active={activeEngine==='resident-evil'&&isPlaying} onClick={()=>{startMusic('resident-evil');setMenuOpen(false);}} icon="🧟" label="Slow Thinking" />
              <MenuButton active={activeEngine==='doom'&&isPlaying} onClick={()=>{startMusic('doom');setMenuOpen(false);}} icon="🔥" label="Rock" />
              <MenuButton active={activeEngine==='classic'&&isPlaying} onClick={()=>{startMusic('classic');setMenuOpen(false);}} icon="🤘" label="Metal" />
              <MenuButton active={activeEngine==='jamiroquai'&&isPlaying} onClick={()=>{startMusic('jamiroquai');setMenuOpen(false);}} icon="🕶️" label="Deep Core" />
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.2rem 0' }} />
              <MenuButton active={false} onClick={()=>{stopMusic();setMenuOpen(false);}} icon="🚫" label="Apagar Música" red />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ position: 'relative' }}>
          <motion.button
            onClick={handleToggle} className="music-toggle" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            style={{ width: '56px', height: '56px', borderRadius: '50%', background: isPlaying ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)' : 'linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)', border: isPlaying ? '2px solid rgba(255,255,255,0.4)': '2px solid rgba(59,130,246,0.3)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', boxShadow: isPlaying ? '0 0 20px rgba(34,197,94,0.3)' : 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '20px' }}>
              {[0, 1, 2, 3].map(i => (
                <motion.div key={i} animate={isPlaying ? { height: activeEngine==='jamiroquai' ? ['10px','24px','14px','22px','10px'] : activeEngine==='doom' ? ['8px','22px','6px','20px','8px'] : ['6px','18px','10px','16px','6px'] } : { height: '6px' }}
                  transition={isPlaying ? { duration: activeEngine==='jamiroquai'?0.55:activeEngine==='doom'?0.3:0.8, repeat: Infinity, delay: i*0.1 } : {}}
                  style={{ width: '3px', height: '6px', borderRadius: '2px', background: 'white' }}
                />
              ))}
            </div>
          </motion.button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                style={{ position: 'absolute', right: '70px', top: '15px', background: 'rgba(15,23,42,0.9)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', color: 'white', whiteSpace: 'nowrap', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              >🎵 Ambientación IT</motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, active, red }: { icon: string, label: string, onClick: () => void, active: boolean, red?: boolean }) {
  return (
    <motion.button onClick={onClick} whileHover={{ x: 5, background: 'rgba(255,255,255,0.08)' }}
      style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 1rem', width: '100%', borderRadius: '10px', color: red ? '#f87171' : active ? 'var(--accent-green)' : 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: active ? 700 : 500, background: active ? 'rgba(34,197,94,0.1)' : 'transparent', textAlign: 'left', whiteSpace: 'nowrap' }}
    >
      <span style={{ fontSize: '1rem' }}>{icon}</span> {label}
      {active && <motion.div layoutId="active-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-green)', marginLeft: 'auto' }} />}
    </motion.button>
  );
}
