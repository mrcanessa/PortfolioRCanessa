'use client';

import { useState } from 'react';
import Image from 'next/image';
import ParallaxSection from '@/components/ParallaxSection';
import ParticleBackground from '@/components/ParticleBackground';
import StatsCounter from '@/components/StatsCounter';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import PaymentQR from '@/components/PaymentQR';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Server, Cloud, ShieldCheck, Mail, Database, ArrowRight, Lock, Leaf, Zap } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';

const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  Cloud: Cloud,
  Lock: Lock
};

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    industry: '',
    scale: '',
    timeline: '',
    procedures: '',
    message: '',
    notes: ''
  });
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
      setFormData({ 
        name: '', email: '', industry: '', scale: '', 
        timeline: '', procedures: '', message: '', notes: '' 
      });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section style={{ minHeight: '96vh', display: 'flex', alignItems: 'center', position: 'relative', padding: '6rem 0', overflow: 'hidden', background: '#050a14' }}>
        
        {/* Full-bleed Hero Banner Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image 
            src="/images/hero-bg.png" 
            alt="Hero Network Background" 
            fill 
            priority 
            style={{ objectFit: 'cover', opacity: 0.5, filter: 'brightness(0.7)' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #050a14)' }}></div>
        </div>

        {/* Particle Background Layer on top */}
        <ParticleBackground />

        {/* Organic gradient orbs */}
        <div style={{ position: 'absolute', top: '8%', left: '3%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '35%', height: '35%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)', zIndex: 1 }}></div>

        <div className="container" id="inicio" style={{ position: 'relative', zIndex: 10 }}>
          <ParallaxSection offset={80}>
            
            {/* Ultra-sharp Name Branding (from User's Banner) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              style={{
                marginBottom: '3rem',
                borderLeft: '4px solid var(--accent-green)',
                paddingLeft: '1.5rem',
              }}
            >
              <h2 style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.5rem)', 
                fontWeight: 800, 
                letterSpacing: '0.6em', 
                color: 'white', 
                textTransform: 'uppercase',
                margin: 0,
                opacity: 0.9,
                lineHeight: 1
              }}>
                Marcelo Rodriguez Canessa
              </h2>
              <p style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.3em', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                Engineering & IT Consulting
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ 
                display: 'inline-flex', 
                padding: '0.5rem 1.2rem', 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(34, 197, 94, 0.1))', 
                color: 'var(--accent-green)', 
                borderRadius: '4px', 
                marginBottom: '2rem', 
                fontWeight: 700, 
                fontSize: '0.8rem', 
                border: '1px solid rgba(34, 197, 94, 0.2)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                gap: '0.6rem',
                alignItems: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ShieldCheck size={14} /> Systems Engineering 
              <span style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>🌿</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ marginBottom: '2rem', maxWidth: '900px', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              <TypeAnimation
                sequence={[
                  'Digital Architectures',
                  2000,
                  'Secure Infrastructures',
                  2000,
                  'Sustainable Solutions',
                  2000,
                  'Technology for Future',
                  2000,
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                style={{ display: 'inline' }}
              />
              <br className="hidden-mobile" />
              <span className="text-gradient">Robust & Secure.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}
            >
              Helping companies transcend their technological limits through mission-critical cloud scaling, perimeter cybersecurity, and energy-efficient digital ecosystems.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <a href="/#contacto" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                Schedule Consulting <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </a>
              <a href="/#proyectos" className="btn btn-outline" style={{ padding: '1rem 2rem' }}>
                Case Studies
              </a>
              <span className="badge-green" style={{ fontSize: '0.75rem' }}>
                <Leaf size={13} /> Eco-Conscious Enterprise
              </span>
            </motion.div>
          </ParallaxSection>
        </div>
      </section>

      {/* ==================== TRUST GRID ==================== */}
      <section style={{ padding: '4rem 0', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
         <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3rem', opacity: 0.5, filter: 'grayscale(0.8)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cloud size={22} /> AWS</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={22} /> SQL Server</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={22} /> Fortinet</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Server size={22} /> VMware</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={22} /> ISO 27001</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-green)', opacity: 1 }}><Leaf size={22} /> Green IT</div>
         </div>
      </section>

      {/* ==================== STATS COUNTER ==================== */}
      <StatsCounter />

      {/* ==================== PROYECTOS DESTACADOS ==================== */}
      <section id="proyectos" style={{ padding: '8rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
             <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ color: 'var(--accent-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.2em' }}>Selected Portfolio</motion.span>
             <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>Real-World <span className="text-gradient">Business Impact.</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {projects.map((project, index) => {
              const IconComponent = iconMap[project.icon] || Mail;
              const initialAnim = index % 2 === 0 ? { opacity: 0, x: -30 } : { opacity: 0, x: 30 };

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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(34,197,94,0.05))',
                        border: '1px solid rgba(59,130,246,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <IconComponent size={26} color="var(--accent)" />
                      </div>
                      <ArrowRight size={18} color="var(--text-muted)" style={{ opacity: 0.4 }} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1, lineHeight: 1.6 }}>{project.shortDescription}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                      {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== SERVICIOS PREMIUM ==================== */}
      <section id="servicios" style={{ padding: '8rem 0', background: 'linear-gradient(to bottom, transparent, rgba(34,197,94,0.015))' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '2rem' }}>
               <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Core <br/><span className="text-gradient">Expertise.</span></h2>
               <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We don't just deploy software; we engineer ecosystems that allow your business to scale globally without borders or security fears.</p>
               <div style={{ width: '40px', height: '4px', background: 'linear-gradient(90deg, var(--accent), var(--accent-green))', borderRadius: '2px' }}></div>
            </div>
            
            <GridService icon={<Cloud />} title="Cloud Transformation" desc="Seamless migration and optimization across AWS and Azure for elastic scalability." />
            <GridService icon={<ShieldCheck />} title="Cyber Security" desc="Perimeter defense, vulnerability audits, and critical incident response protocols." />
            <GridService icon={<Database />} title="Data Management" desc="Massive data structuring and query optimization for actionable business intelligence." />
            <GridService icon={<Server />} title="IT Infrastructure" desc="Enterprise-grade server design and administration for local and virtualized environments." />
            <GridService icon={<Lock />} title="Network Privacy" desc="Global VPN implementation and secure tunneling for high-performance remote operations." />
            <GridService icon={<Leaf />} title="Green IT Optimization" desc="Energy consumption reduction and eco-efficient resource management." isGreen />
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIOS CAROUSEL ==================== */}
      <TestimonialCarousel />

      {/* ==================== ABOUT SECTION ==================== */}
      <section style={{ padding: '8rem 0' }}>
         <div className="container">
            <motion.div 
              className="card" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ 
                padding: '4rem', 
                background: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(34,197,94,0.03) 100%)', 
                border: '1px solid rgba(34,197,94,0.2)', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '4rem', 
                alignItems: 'center' 
              }}
            >
               <div style={{ flex: '1 1 300px' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em' }}>LEADERSHIP PHILOSOPHY</span>
                  <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '2rem' }}>Human Technology for <span className="text-gradient">High-Velocity Business.</span></h2>
                  <p style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    I am <strong>Marcelo</strong>, and my mission is to remove technological friction from your path. I believe in simplicity as the ultimate sophistication—engineering solutions that are powerful internally but intuitive externally.
                  </p>
                  <p style={{ lineHeight: 1.8, fontSize: '1rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    🌿 Operating under <strong style={{ color: 'var(--accent-green)' }}>Sustainability Principles</strong>: delivering high-performance architectures while optimizing for the lowest possible digital footprint.
                  </p>
               </div>
               <div style={{ flex: '1 1 200px', textAlign: 'center' }}>
                  <div style={{ 
                    width: '150px', 
                    height: '150px', 
                    margin: '0 auto 1.5rem', 
                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '3rem', 
                    color: 'white', 
                    fontWeight: 900,
                    boxShadow: '0 20px 50px rgba(34,197,94,0.2)',
                    animation: 'floatSlow 6s ease-in-out infinite',
                  }}>MC</div>
                  <h4 style={{ marginBottom: '0.2rem' }}>Marcelo R. Canessa</h4>
                  <p style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.9rem' }}>Chief Engineering Consultant</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <span className="badge-green"><Leaf size={12} /> Eco-IT</span>
                    <span className="badge-green"><Zap size={12} /> Efficiency</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* ==================== CONTACT FORM ==================== */}
      <section id="contacto" style={{ padding: '8rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '4rem' }}>
          
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            onSubmit={handleSubmit} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              padding: '3rem',
              borderImage: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(34,197,94,0.3)) 1',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderImageSlice: 1,
              borderRadius: '0',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Start a Case.</h2>
            <p style={{ fontSize: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>I personally analyze every inquiry to propose the most robust architecture for your needs.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>ENTITY / NAME</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Acme Corp" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>CORPORATE EMAIL</label>
                <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="name@company.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>INDUSTRY</label>
                <select required className="input-field" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                  <option value="">Select Sector...</option>
                  <option value="Retail / Distribution">Retail / Distribution</option>
                  <option value="Finance / Fintech">Finance / Fintech</option>
                  <option value="Logistics / Supply Chain">Logistics / Supply Chain</option>
                  <option value="Tech / SaaS">Tech / SaaS</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>SCALE (USERS/NODES)</label>
                <input required type="text" className="input-field" value={formData.scale} onChange={e => setFormData({...formData, scale: e.target.value})} placeholder="e.g. 50 nodes, 2 sites" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === 'loading'}
              style={{ marginTop: '1rem', padding: '1.2rem', fontWeight: 700, fontSize: '1rem' }}
            >
              {status === 'loading' ? 'Processing...' : '🌿 Send Strategic Proposal'}
            </button>
            {status === 'success' && <p style={{ color: '#4ade80', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>Inquiry sent successfully.</p>}
          </motion.form>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Management <span className="text-gradient">& Payments</span></h3>
              <p style={{ marginBottom: '3rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Optimized administrative flows through secure digital payments for auditing and maintenance retainer services.</p>
              
              <PaymentQR amount={500.00} concept="Architecture Consulting (Deposit)" />
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}

function GridService({ icon, title, desc, isGreen }: { icon: React.ReactNode, title: string, desc: string, isGreen?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      style={{ 
        padding: '2rem', 
        background: isGreen 
          ? 'linear-gradient(135deg, rgba(34,197,94,0.04), rgba(255,255,255,0.01))' 
          : 'rgba(255,255,255,0.02)', 
        border: `1px solid ${isGreen ? 'rgba(34,197,94,0.15)' : 'var(--card-border)'}`, 
        borderRadius: 'var(--radius-md)', 
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ color: isGreen ? 'var(--accent-green)' : 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
         <div style={{ 
            color: isGreen ? 'var(--accent-green)' : 'var(--accent)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isGreen ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
         }}>{icon}</div>
         <h4 style={{ color: 'white', margin: 0, fontSize: '1.15rem' }}>{title}</h4>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
      {isGreen && (
        <span className="badge-green" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          🌱 Sustainable
        </span>
      )}
    </motion.div>
  );
}
