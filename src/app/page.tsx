'use client';

import { useState } from 'react';
import ParallaxSection from '@/components/ParallaxSection';
import PaymentQR from '@/components/PaymentQR';
import { motion } from 'framer-motion';
import { Server, Cloud, ShieldCheck, Mail, Database, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';

const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  Cloud: Cloud,
  Lock: Lock
};

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflowX: 'hidden' }}>
        <div className="container">
          <ParallaxSection offset={80}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', borderRadius: '999px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.85rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}
            >
              <ShieldCheck size={16} style={{ marginRight: '0.5rem' }} /> Su aliado estratégico B2B
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ marginBottom: '1.5rem', maxWidth: '850px' }}
            >
              Ingeniería y Consultoría Tecnológica <br className="hidden-mobile" /><span className="text-gradient">para su Tranquilidad.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: '650px' }}
            >
              Estructuramos, securizamos y escalamos su infraestructura. Desde migraciones a la nube (AWS/GCP) hasta integraciones masivas de red y espacios de trabajo corporativos.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <a href="#contacto" className="btn btn-primary">
                Agendar Consultoría <ArrowRight size={18} />
              </a>
              <a href="#proyectos" className="btn btn-outline">
                Ver Proyectos
              </a>
            </motion.div>
          </ParallaxSection>
        </div>
      </section>

      {/* Proyectos y Casos de Exito */}
      <section id="proyectos" style={{ padding: '6rem 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
             <h2 style={{ marginBottom: '1rem' }}>Experiencia y Proyectos Destacados</h2>
             <p style={{ maxWidth: '600px', margin: '0 auto' }}>Implementaciones corporativas reales enfocadas en rendimiento, seguridad y ahorro de costos.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {projects.map((project, index) => {
              const IconComponent = iconMap[project.icon] || Mail;

              // Animaciones distintas según el orden del proyecto
              let initialAnim = {};
              let whileAnim = {};

              if (index === 0) {
                initialAnim = { opacity: 0, x: -50 };
                whileAnim = { opacity: 1, x: 0 };
              } else if (index === 1) {
                initialAnim = { opacity: 0, scale: 0.8 };
                whileAnim = { opacity: 1, scale: 1 };
              } else {
                initialAnim = { opacity: 0, x: 50 };
                whileAnim = { opacity: 1, x: 0 };
              }

              return (
                <Link href={`/proyectos/${project.slug}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <motion.div 
                    className="card hover-glow" 
                    initial={initialAnim} 
                    whileInView={whileAnim} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ height: '100%', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      {project.tags.slice(0, 2).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <IconComponent size={36} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.8rem', lineHeight: 1.2 }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{project.shortDescription}</p>
                    <div style={{ marginTop: '1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       Explorar Caso <ArrowRight size={14} color="var(--accent)" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Servicios Especializados */}
      <section id="servicios" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ flex: '1 1 400px' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Especialización Técnica Transversal</h2>
              <p style={{ marginBottom: '2rem' }}>Entendemos que la informática de hoy no son máquinas aisladas. Es un ecosistema global. Proveemos asesoramiento abarcando todas las áreas para solidificar sus cimientos digitales.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Server color="var(--accent)" /> Administración de Servidores Linux/Windows</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Database color="var(--accent)" /> SQL y Bases de Datos (Optimización)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><ShieldCheck color="var(--accent)" /> Cumplimiento y Políticas ISO (Continuidad)</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
               <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(15,23,42,0.8) 100%)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 60%)', animation: 'spin 10s linear infinite' }} />
                 <Server size={64} color="var(--accent)" style={{ opacity: 0.5 }} />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contacto & Pagos */}
      <section id="contacto" style={{ padding: '8rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          
          <motion.form initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hablemos de su proyecto</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Envíeme sus requerimientos para coordinar una reunión inicial.</p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Empresa / Nombre completo</label>
              <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Corporación Acme" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Correo electrónico corporativo</label>
              <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contacto@empresa.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Detalles del requerimiento</label>
              <textarea required className="input-field" rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Requerimos migración a la nube para 50 usuarios..." />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === 'loading'}
              style={{ marginTop: '1rem', opacity: status === 'loading' ? 0.7 : 1, width: '100%' }}
            >
              {status === 'loading' ? 'Procesando...' : 'Solicitar Propuesta Comercial'}
            </button>
            {status === 'success' && <p style={{ color: '#4ade80', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>Mensaje recibido. Nos contactaremos a la brevedad.</p>}
            {status === 'error' && <p style={{ color: '#f87171', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>Error de conexión con la base de datos local. Intente nuevamente.</p>}
          </motion.form>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Gestión Administrativa</h3>
            <p style={{ marginBottom: '2rem' }}>Pague facturas o anticipos de manera electrónica para mantener su contabilidad ágil. Escanee el código desde su aplicación bancaria o billetera virtual preferida.</p>
            
            <PaymentQR amount={500.00} concept="Consultoría Arquitectura Cloud (Por Defecto)" />
          </motion.div>

        </div>
      </section>
    </>
  );
}
