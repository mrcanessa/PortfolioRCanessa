'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Cloud, Lock, ArrowLeft, Star, Quote, ChevronLeft, Leaf, Zap } from 'lucide-react';
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
      {/* Background accent orbs */}
      <div style={{ position: 'fixed', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Contenedor Principal Expandido */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', transition: 'padding 0.4s ease', position: 'relative', zIndex: 1 }}>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            marginBottom: '3rem', 
            color: 'var(--accent-green)', 
            textDecoration: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            padding: '0.6rem 1.2rem', 
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.05))', 
            borderRadius: '99px',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            transition: 'all 0.3s ease',
          }} className="hover-glow">
            <ArrowLeft size={18} /> Volver al Portafolio
          </Link>
        </motion.div>

        {/* Hero de Proyecto — Premium */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '5rem', display: 'flex', gap: '3.5rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
           <div style={{ 
             width: '130px', 
             height: '130px', 
             borderRadius: '1.5rem', 
             background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%)', 
             border: '1px solid rgba(59, 130, 246, 0.3)', 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center', 
             boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.08)',
             animation: 'floatSlow 6s ease-in-out infinite',
           }}>
             <IconComponent size={64} color="var(--accent)" />
           </div>
           <div style={{ flex: 1, minWidth: '300px' }}>
             <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
               {project.tags.map(tag => (
                 <span key={tag} className="tag" style={{ fontSize: '0.9rem', padding: '0.35rem 1rem' }}>{tag}</span>
               ))}
               <span className="badge-green"><Leaf size={12} /> Eco-Optimizado</span>
             </div>
             <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginBottom: '1.2rem', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{project.title}</h1>
             <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: 1.6 }}>{project.shortDescription}</p>
           </div>
        </motion.div>

        {/* Contenido Ampliado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingRight: isVisible ? '50px' : '0', transition: 'padding 0.4s ease' }}>
          
          <motion.div 
            className="card hover-glow" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              background: 'rgba(15,23,42,0.5)', 
              padding: '3.5rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', display: 'inline-block' }}>
              El <span className="text-gradient">Contexto</span>
            </h2>
            <p style={{ lineHeight: 2, fontSize: '1.2rem', color: 'var(--text-muted)' }}>{project.fullDescription}</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            <motion.div 
              className="card hover-glow" 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ 
                padding: '3rem', 
                borderRadius: 'var(--radius-lg)', 
                borderTop: '4px solid #f87171', 
                background: 'linear-gradient(180deg, rgba(248,113,113,0.03) 0%, rgba(15,23,42,0.3) 100%)',
              }}
            >
              <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: '#fca5a5' }}>Principales Desafíos</h3>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.1rem' }}>
                {project.challenges.map((c, i) => <li key={i} style={{ lineHeight: 1.7 }}>{c}</li>)}
              </ul>
            </motion.div>
            
            <motion.div 
              className="card hover-glow" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ 
                padding: '3rem', 
                borderRadius: 'var(--radius-lg)', 
                borderTop: '4px solid #22c55e', 
                background: 'linear-gradient(180deg, rgba(34,197,94,0.03) 0%, rgba(15,23,42,0.3) 100%)',
              }}
            >
              <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', color: '#86efac' }}>Soluciones <span style={{ fontSize: '0.8rem', verticalAlign: 'super' }}>🌿</span> Integradas</h3>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.1rem' }}>
                {project.solutions.map((c, i) => <li key={i} style={{ lineHeight: 1.7 }}>{c}</li>)}
              </ul>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge-green"><Zap size={11} /> Alta Eficiencia</span>
                <span className="badge-green"><Leaf size={11} /> Eco-Friendly</span>
              </div>
            </motion.div>
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
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(34,197,94,0.1)',
          boxShadow: '-15px 0 60px rgba(0,0,0,0.6)',
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
          <h3 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'white', letterSpacing: '-0.02em' }}>
            <Quote size={28} color="var(--accent-green)" /> Experiencias
          </h3>
          <button 
             onClick={() => { setSidebarOpen(false); setHoverAreaActive(false); }}
             onTouchEnd={() => { setSidebarOpen(false); setHoverAreaActive(false); }}
             style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontSize: '1.3rem', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
             className="close-sidebar-btn hidden-desktop"
          >
             ×
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={15} fill="#fbbf24" color="#fbbf24" />)}
                {[...Array(5 - t.rating)].map((_, i) => <Star key={`e-${i}`} size={15} color="rgba(255,255,255,0.12)" />)}
              </div>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.8rem', color: '#e2e8f0', lineHeight: 1.7 }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ 
                   width: '48px', 
                   height: '48px', 
                   borderRadius: '50%', 
                   background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)', 
                   flexShrink: 0, 
                   border: '2px solid rgba(255,255,255,0.1)',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   fontSize: '0.8rem',
                   fontWeight: 800,
                   color: 'white',
                 }}>
                   {t.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div>
                   <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>{t.name}</p>
                   <p style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 500 }}>{t.role}</p>
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
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)',
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
          boxShadow: '-4px 0 25px rgba(34, 197, 94, 0.3)'
        }}
        onMouseEnter={() => setHoverAreaActive(true)}
        onClick={() => setSidebarOpen(true)}
      >
        <ChevronLeft size={24} />
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
          VER EXPERIENCIAS
        </span>
      </motion.div>

    </div>
  );
}
