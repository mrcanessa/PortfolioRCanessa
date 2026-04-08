'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Cloud, Lock, ArrowLeft, Star, Quote, ChevronLeft } from 'lucide-react';
import type { Project } from '@/data/projects';

const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  Cloud: Cloud,
  Lock: Lock
};

export default function InteractiveProjectView({ project }: { project: Project }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoverAreaActive, setHoverAreaActive] = useState(false);
  
  // Estados para detectar el gesto Swipe "atrás" en celulares
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const IconComponent = iconMap[project.icon] || Mail;

  // The sidebar opens when hoverAreaActive is true OR sidebarOpen is explicitly clicked
  const isVisible = sidebarOpen || hoverAreaActive;

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchEnd - touchStart;
    
    // Gesto de Swipe hacia la derecha (de izquierda a derecha > 100px)
    if (distance > 100) {
      if (!isVisible) {
        // Si el panel de experiencias no está viendo, retrocedemos a Inicio
        router.push('/');
      }
    }
    
    // Limpiar estados táctiles del gesto
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div 
      style={{ paddingTop: '100px', paddingBottom: '120px', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Contenedor Principal Expandido */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', transition: 'padding 0.4s ease' }}>
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', color: 'var(--accent)', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600, padding: '0.6rem 1.2rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '99px' }} className="hover-glow">
          <ArrowLeft size={18} /> Volver al Portafolio
        </Link>

        {/* Hero de Proyecto - Más Amigable (Tamaños ampliados) */}
        <div style={{ marginBottom: '5rem', display: 'flex', gap: '3.5rem', alignItems: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease-out' }}>
           <div style={{ width: '130px', height: '130px', borderRadius: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
             <IconComponent size={64} color="var(--accent)" />
           </div>
           <div style={{ flex: 1, minWidth: '300px' }}>
             <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
               {project.tags.map(tag => (
                 <span key={tag} className="tag" style={{ fontSize: '0.95rem', padding: '0.4rem 1.2rem' }}>{tag}</span>
               ))}
             </div>
             <h1 style={{ fontSize: '3.8rem', marginBottom: '1.2rem', lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: '0 10px 30px rgba(59,130,246,0.1)' }}>{project.title}</h1>
             <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: 1.6 }}>{project.shortDescription}</p>
           </div>
        </div>

        {/* Contenido Ampliado (Bloques Gigantes y Espaciosos) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingRight: isVisible ? '50px' : '0', transition: 'padding 0.4s ease' }}>
          
          <div className="card hover-glow" style={{ background: 'rgba(15,23,42,0.5)', padding: '3.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeInUp 0.8s ease-out 0.2s', animationFillMode: 'both' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', display: 'inline-block', borderBottom: '3px solid var(--accent)', paddingBottom: '0.5rem' }}>El Contexto</h2>
            <p style={{ lineHeight: 2, fontSize: '1.25rem', color: 'var(--text-muted)' }}>{project.fullDescription}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3.5rem' }}>
            <div className="card hover-glow" style={{ padding: '3rem', borderRadius: '1.5rem', borderTop: '6px solid #f87171', background: 'linear-gradient(180deg, rgba(248,113,113,0.03) 0%, rgba(15,23,42,0.3) 100%)', animation: 'fadeInUp 0.8s ease-out 0.3s', animationFillMode: 'both' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#fca5a5' }}>Principales Desafíos</h3>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.15rem' }}>
                {project.challenges.map((c, i) => <li key={i} style={{ lineHeight: 1.7 }}>{c}</li>)}
              </ul>
            </div>
            
            <div className="card hover-glow" style={{ padding: '3rem', borderRadius: '1.5rem', borderTop: '6px solid #4ade80', background: 'linear-gradient(180deg, rgba(74,222,128,0.03) 0%, rgba(15,23,42,0.3) 100%)', animation: 'fadeInUp 0.8s ease-out 0.4s', animationFillMode: 'both' }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: '#86efac' }}>Soluciones Integradas</h3>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.15rem' }}>
                {project.solutions.map((c, i) => <li key={i} style={{ lineHeight: 1.7 }}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Sensor de interacciones lateral invisible SOLO PARA ESCRITORIO */}
      <div 
         className="hidden-mobile"
         style={{ position: 'fixed', right: 0, top: 0, width: '80px', height: '100vh', zIndex: 80 }}
         onMouseEnter={() => setHoverAreaActive(true)}
      />

      {/* Sidebar de Testimonios Desplegable */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isVisible ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={(e, { offset, velocity }) => {
          // Si el usuario desliza con el pulgar hacia la derecha (más de 80px o rápido)
          if (offset.x > 80 || velocity.x > 300) {
            setSidebarOpen(false);
            setHoverAreaActive(false);
          }
        }}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '450px',
          maxWidth: '90vw',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-15px 0 50px rgba(0,0,0,0.6)',
          zIndex: 100,
          padding: '3rem 2.5rem',
          overflowY: 'auto',
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        onMouseLeave={() => { 
          // En escritorio sirve para ocultar. En móvil esto no suele dispararse.
          setHoverAreaActive(false); 
          setSidebarOpen(false); 
        }}
      >
        {/* Cabecera del Sidebar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'white', letterSpacing: '-0.02em' }}>
            <Quote size={32} color="var(--accent)" /> Experiencias
          </h3>
          <button 
             onClick={() => { setSidebarOpen(false); setHoverAreaActive(false); }}
             onTouchEnd={() => { setSidebarOpen(false); setHoverAreaActive(false); }}
             style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             className="close-sidebar-btn hidden-desktop"
          >
             ×
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {project.testimonials.map((t, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: isVisible ? 0.15 + (index * 0.1) : 0 }}
              className="card" 
              style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.2rem' }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{ fontSize: '1.15rem', fontStyle: 'italic', marginBottom: '2rem', color: '#e2e8f0', lineHeight: 1.7 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                 <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, rgba(15,23,42,1) 100%)', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }} />
                 <div>
                   <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{t.name}</p>
                   <p style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500 }}>{t.role}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pestaña disparadora visible permanentemente */}
      <motion.div
        animate={{ x: isVisible ? 100 : 0, opacity: isVisible ? 0 : 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          background: 'linear-gradient(135deg, var(--accent) 0%, #1e3a8a 100%)',
          color: 'white',
          padding: '1.8rem 0.6rem',
          borderTopLeftRadius: '0.8rem',
          borderBottomLeftRadius: '0.8rem',
          cursor: 'pointer',
          zIndex: 85,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '-4px 0 20px rgba(59, 130, 246, 0.4)'
        }}
        onMouseEnter={() => setHoverAreaActive(true)}
        onClick={() => setSidebarOpen(true)}
      >
        <ChevronLeft size={24} />
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.1em' }}>
          VER EXPERIENCIAS
        </span>
      </motion.div>

    </div>
  );
}
