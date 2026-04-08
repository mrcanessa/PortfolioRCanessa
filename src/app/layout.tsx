import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Consultoría en Gestión Informática',
  description: 'Portafolio profesional de soluciones y gestión informática. Transformamos problemas en soluciones digitales.',
  keywords: 'consultoría, informática, TI, gestión, software, sistemas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CustomCursor />
        <nav style={{ padding: '1rem 0', position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(10, 15, 28, 0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent) 0%, #1e40af 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                <span style={{ color: 'white', fontSize: '16px' }}>MC</span>
              </div>
              <div>
                <span style={{ color: '#fff' }}>Marcelo</span><span style={{ color: 'var(--accent)' }}>Canessa</span>
              </div>
            </div>
            <ul className="nav-menu hidden-mobile" style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <li><a href="#proyectos" className="nav-link">Casos</a></li>
              <li><a href="#servicios" className="nav-link">Experticia</a></li>
              <li><a href="#contacto" className="nav-link">Contacto</a></li>
            </ul>
            <a href="#contacto" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>Agendar</a>
          </div>
        </nav>
        <main style={{ paddingTop: '80px' }}>{children}</main>
        <footer style={{ borderTop: '1px solid var(--card-border)', padding: '6rem 0 3rem', background: 'rgba(0,0,0,0.2)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'left', marginBottom: '4rem' }}>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '5px' }}></div>
                   MarceloCanessa
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Soluciones de ingeniería de clase mundial para empresas que buscan escala y seguridad absoluta.</p>
              </div>
              <div>
                <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>Servicios</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <li>Infraestructura Cloud</li>
                  <li>Ciberseguridad Proactiva</li>
                  <li>Migración de Sistemas</li>
                  <li>Consultoría IT B2B</li>
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
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <p>&copy; {new Date().getFullYear()} Marcelo Rodriguez Canessa. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
