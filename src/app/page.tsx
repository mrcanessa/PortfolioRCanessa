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
      <section style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', padding: '6rem 0' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', zIndex: -1 }}></div>
        <div className="container">
          <ParallaxSection offset={80}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ display: 'inline-flex', padding: '0.5rem 1.2rem', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--accent)', borderRadius: '999px', marginBottom: '2rem', fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(59, 130, 246, 0.15)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              <ShieldCheck size={14} style={{ marginRight: '0.6rem' }} /> Ingeniería de Sistemas & Consultoría
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ marginBottom: '2rem', maxWidth: '900px', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              Arquitecturas Digitales <br className="hidden-mobile" /><span className="text-gradient">Robustas y Seguras.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}
            >
              Ayudamos a empresas a trascender sus límites tecnológicos mediante la implementación de infraestructuras elásticas, ciberseguridad perimetral y gestión de nube inteligente.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              <a href="#contacto" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                Agendar Consultoría <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </a>
              <a href="#proyectos" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
                Casos de Éxito
              </a>
            </motion.div>
          </ParallaxSection>
        </div>
      </section>

      {/* Trust Grid */}
      <section style={{ padding: '4rem 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
         <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem', opacity: 0.5, filter: 'grayscale(1)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cloud size={24} /> AWS</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={24} /> SQL Server</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={24} /> Fortinet</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Server size={24} /> VMware</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={24} /> ISO 27001</div>
         </div>
      </section>

      {/* Proyectos Destacados */}
      <section id="proyectos" style={{ padding: '10rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
             <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em' }}>Portafolio Seleccionado</motion.span>
             <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>Impacto en Negocios Reales</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {projects.map((project, index) => {
              const IconComponent = iconMap[project.icon] || Mail;
              let initialAnim = index % 2 === 0 ? { opacity: 0, x: -30 } : { opacity: 0, x: 30 };

              return (
                <Link href={`/proyectos/${project.slug}`} key={project.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div 
                    className="card hover-glow" 
                    initial={initialAnim} 
                    whileInView={{ opacity: 1, x: 0 }} 
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    style={{ height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                  >
                    <IconComponent size={40} color="var(--accent)" style={{ marginBottom: '2rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', flex: 1 }}>{project.shortDescription}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                      {project.tags.map(t => <span key={t} style={{ fontSize: '0.7rem', opacity: 0.6, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{t}</span>)}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Servicios Premium */}
      <section id="servicios" style={{ padding: '10rem 0', background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.02))' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '2rem' }}>
               <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Nuestra <br/><span className="text-gradient">Experticia.</span></h2>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No solo instalamos software; diseñamos ecosistemas que permiten a su empresa operar sin miedos ni límites geográficos.</p>
               <div style={{ width: '40px', height: '4px', background: 'var(--accent)' }}></div>
            </div>
            
            <GridService icon={<Cloud />} title="Cloud Transformation" desc="Migración y optimización en AWS, Azure y Google Cloud para escalabilidad infinita." />
            <GridService icon={<ShieldCheck />} title="Cyber Security" desc="Seguridad perimetral, auditorías de vulnerabilidad y respuesta ante incidentes crítica." />
            <GridService icon={<Database />} title="Data Management" desc="Estructuración de datos masivos y optimización de consultas para inteligencia de negocio." />
            <GridService icon={<Server />} title="IT Infrastructure" desc="Diseño y administración de servidores locales y virtuales bajo estándares Enterprise." />
            <GridService icon={<Lock />} title="Network Privacy" desc="Implementación de VPNs corporativas y túneles seguros para el trabajo remoto global." />
          </div>
        </div>
      </section>

      {/* Enfoque / About */}
      <section style={{ padding: '10rem 0' }}>
         <div className="container">
            <div className="card" style={{ padding: '4rem', background: 'var(--card-bg)', border: '1px solid var(--accent)', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
               <div style={{ flex: '1 1 300px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em' }}>FILOSOFÍA DE TRABAJO</span>
                  <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '2rem' }}>Tecnología Humana para Negocios de Alta Velocidad.</h2>
                  <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    Mi nombre es <strong>Marcelo</strong>, y mi misión es eliminar la fricción tecnológica de su camino. Creo en la simplicidad como la máxima sofisticación; por eso mis soluciones buscan ser potentes por dentro pero manejables y amigables por fuera.
                  </p>
               </div>
               <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                  <div style={{ width: '150px', height: '150px', margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, var(--accent) 0%, #1e40af 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: 900 }}>MC</div>
                  <h4 style={{ marginBottom: '0.2rem' }}>Marcelo R. Canessa</h4>
                  <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>Ingeniero Jefe de Consultoría</p>
               </div>
            </div>
         </div>
      </section>

      {/* Contacto & Pagos */}
      <section id="contacto" style={{ padding: '10rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem' }}>
          
          <motion.form initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Escríbame.</h2>
            <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Analizaré su caso personalmente para proponerle la arquitectura más adecuada.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>EMPRESA</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Acme Inc." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>CORREO CORPORATIVO</label>
                <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="nombre@empresa.com" />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>MENSAJE / REQUERIMIENTO</label>
              <textarea required className="input-field" rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Describa brevemente el reto técnico..." />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === 'loading'}
              style={{ marginTop: '1rem', padding: '1.2rem', fontWeight: 700 }}
            >
              {status === 'loading' ? 'Procesando...' : 'Enviar Propuesta'}
            </button>
            {status === 'success' && <p style={{ color: '#4ade80', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>¡Mensaje enviado con éxito!</p>}
            {status === 'error' && <p style={{ color: '#f87171', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>Error al enviar. Intente con Gmail PASS.</p>}
          </motion.form>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Gestión de Pagos</h3>
              <p style={{ marginBottom: '3rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Optimice su flujo administrativo permitiendo pagos digitales instantáneos para auditorías rápidas o mantenimientos preventivos.</p>
              
              <PaymentQR amount={500.00} concept="Consultoría Arquitectura Cloud (Abono)" />
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}

function GridService({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-md)', transition: 'all 0.3s ease' }}
    >
      <div style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
         <div style={{ color: 'var(--accent)' }}>{icon}</div>
         <h4 style={{ color: 'white', margin: 0, fontSize: '1.2rem' }}>{title}</h4>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
  );
}
