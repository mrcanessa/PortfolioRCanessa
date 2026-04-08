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
        <nav style={{ padding: '1.25rem 0', position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '14px' }}>⌘</span>
              </div>
              Sys<span style={{ color: 'var(--text-muted)' }}>Admin</span>
            </div>
            <ul className="nav-menu" style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', fontWeight: 500, fontSize: '0.95rem' }}>
              <li><a href="#proyectos">Proyectos</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
        </nav>
        <main style={{ paddingTop: '80px' }}>{children}</main>
        <footer style={{ borderTop: '1px solid var(--card-border)', padding: '4rem 0', marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Consultoría e Ingeniería de Sistemas B2B.<br/>Diseñado para la robustez y escalabilidad corporativa.</p>
        </footer>
      </body>
    </html>
  );
}
