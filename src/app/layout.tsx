import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import AmbientMusic from '@/components/AmbientMusic';

const outfit = Outfit({ 
  subsets: ['latin'], 
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Consultoría e Ingeniería IT | Marcelo Canessa',
  description: 'Portafolio profesional de soluciones de ingeniería informática y consultoría IT. Arquitecturas digitales robustas, seguras y sostenibles.',
  keywords: 'consultoría, informática, TI, gestión, software, sistemas, cloud, ciberseguridad, sostenibilidad, tecnología verde',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={outfit.className}>
        <CustomCursor />
        <AmbientMusic />
        
        {/* Navigation Bar */}
        <nav style={{ 
          padding: '1rem 0', 
          position: 'fixed', 
          top: 0, 
          width: '100%', 
          zIndex: 100, // Increased z-index
          background: 'rgba(10, 15, 30, 0.85)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)' 
        }}>
          <div className="container nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-green) 100%)', 
                borderRadius: '10px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.25)' 
              }}>
                <span style={{ color: 'white', fontSize: '15px', fontWeight: 900 }}>MC</span>
              </div>
              <div>
                <span style={{ color: '#fff' }}>Marcelo</span><span style={{ color: 'var(--accent-green)' }}>Canessa</span>
              </div>
            </div>
            <ul className="nav-menu hidden-mobile" style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <li><a href="#proyectos" className="nav-link">Casos</a></li>
              <li><a href="#servicios" className="nav-link">Experticia</a></li>
              <li><a href="#testimonios" className="nav-link">Testimonios</a></li>
              <li><a href="#contacto" className="nav-link">Contacto</a></li>
            </ul>
            <a href="#contacto" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.8rem' }}>
              Agendar
            </a>
          </div>
        </nav>

        <main>{children}</main>

        {/* Premium Footer */}
        <footer style={{ borderTop: '1px solid var(--card-border)', padding: '6rem 0 3rem', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10,15,30,0.9) 100%)' }}>
          <div className="container">
            
            {/* Sustainability Badge */}
            <div className="sustainability-section" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>
                  🌿
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--accent-green)', marginBottom: '0.2rem' }}>Tecnología Sostenible</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    Promovemos infraestructuras eficientes que reducen hasta un 40% el consumo energético digital.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge-green">🌱 Cloud Eficiente</span>
                <span className="badge-green">♻️ Green IT</span>
                <span className="badge-green">⚡ Carbono Optimizado</span>
              </div>
            </div>

            {/* Footer Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'left', marginBottom: '4rem', marginTop: '4rem' }}>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ 
                     width: '24px', 
                     height: '24px', 
                     background: 'linear-gradient(135deg, var(--accent), var(--accent-green))', 
                     borderRadius: '6px' 
                   }}></div>
                   MarceloCanessa
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Soluciones de ingeniería de clase mundial para empresas que buscan escala, seguridad y sostenibilidad tecnológica.
                </p>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>Servicios</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li>Infraestructura Cloud</li>
                  <li>Ciberseguridad Proactiva</li>
                  <li>Migración de Sistemas</li>
                  <li>Consultoría IT B2B</li>
                  <li style={{ color: 'var(--accent-green)' }}>🌿 Green IT Optimization</li>
                </ul>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>Contacto</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li>M: marcelo.rcanessa@gmail.com</li>
                  <li>L: LinkedIn Profile</li>
                  <li>W: WhatsApp Business</li>
                </ul>
              </div>
            </div>

            {/* Footer Bottom */}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p>&copy; {new Date().getFullYear()} Marcelo Rodriguez Canessa — Consultoría e Ingeniería IT. Todos los derechos reservados.</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)' }}>
                🌱 Comprometidos con la reducción de la huella digital
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
