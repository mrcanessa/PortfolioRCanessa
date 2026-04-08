import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Mail, Cloud, Lock, ArrowLeft, Star, Quote } from 'lucide-react';
import { Metadata } from 'next';

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return { title: 'Proyecto No Encontrado' };
  return { title: `${project.title} | Casos de Éxito Corporate` };
}

// Mapa para renderizar iconos dinámicamente desde el string guardado
const iconMap: Record<string, React.ElementType> = {
  Mail: Mail,
  Cloud: Cloud,
  Lock: Lock
};

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();

  const IconComponent = iconMap[project.icon] || Mail;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }} className="hover-white">
          <ArrowLeft size={16} /> Volver al Portafolio
        </Link>

        {/* Hero de Proyecto */}
        <div style={{ marginBottom: '4rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.8s ease-out' }}>
           <div style={{ width: '85px', height: '85px', borderRadius: '1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <IconComponent size={42} color="var(--accent)" />
           </div>
           <div style={{ flex: 1, minWidth: '300px' }}>
             <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
               {project.tags.map(tag => (
                 <span key={tag} className="tag">{tag}</span>
               ))}
             </div>
             <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1.2 }}>{project.title}</h1>
           </div>
        </div>

        {/* Sección de Contenido Principal (Grid Responsive) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Detalles Técnicos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ background: 'rgba(15,23,42,0.6)', animation: 'fadeInUp 0.8s ease-out 0.2s', animationFillMode: 'both' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Resumen del Proyecto</h2>
              <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-muted)' }}>{project.fullDescription}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="card" style={{ borderTop: '4px solid #f87171', animation: 'fadeInUp 0.8s ease-out 0.3s', animationFillMode: 'both' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fca5a5' }}>Desafíos Iniciales</h3>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {project.challenges.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div className="card" style={{ borderTop: '4px solid #4ade80', animation: 'fadeInUp 0.8s ease-out 0.4s', animationFillMode: 'both' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#86efac' }}>Soluciones Logradas</h3>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {project.solutions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Lateral de Testimonios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInUp 0.8s ease-out 0.5s', animationFillMode: 'both' }}>
            <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Quote size={20} color="var(--accent)" /> Experiencias del Cliente
            </h3>
            {project.testimonials.map((t, index) => (
              <div key={index} className="card hover-glow" style={{ background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.8rem' }}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem', color: '#e2e8f0', lineHeight: 1.6 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   {/* Avatar Minimalista Abstracto */}
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, rgba(15,23,42,1) 100%)', flexShrink: 0 }} />
                   <div>
                     <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.1rem' }}>{t.name}</p>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.role}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
