import { type ReactNode } from 'react';
import { Link } from 'wouter';

interface PublicLayoutProps {
  children: ReactNode;
  slug?: string;
  businessName?: string;
  businessType?: 'appointments' | 'membership';
}

export function PublicLayout({ children, slug, businessName, businessType }: PublicLayoutProps) {
  const isBusinessPage = Boolean(slug);
  const isMembership = businessType === 'membership';

  return (
    <div className="public-shell">
      <header className="public-topbar">
        <Link href="/" className="public-topbar-brand">
          {businessName || 'Atlas Agenda OS'}
        </Link>
        <nav className="public-topbar-nav">
          {isBusinessPage ? (
            isMembership ? (
              <>
                <Link href={`/${slug}`} className="public-topbar-link">Inicio</Link>
                <a href="#plans" className="public-topbar-link">Planes</a>
                <a href="#classes" className="public-topbar-link">Clases</a>
                <a href="#events" className="public-topbar-link">Eventos</a>
                <Link href={`/client/${slug}`} className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
              </>
            ) : (
              <>
                <Link href={`/${slug}`} className="public-topbar-link">Inicio</Link>
                <a href="#services" className="public-topbar-link">Servicios</a>
                <a href="#professionals" className="public-topbar-link">Profesionales</a>
                <a href="#location" className="public-topbar-link">Ubicación</a>
                <Link href={`/client/${slug}`} className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
              </>
            )
          ) : (
            <>
              <a href="#features" className="public-topbar-link">Producto</a>
              <a href="#examples" className="public-topbar-link">Ejemplos</a>
              <Link href="/super-admin" className="public-topbar-link">Acceso interno</Link>
              <Link href="/client/atlas-fight-academy" className="public-topbar-link btn btn-sm btn-secondary">Ver ejemplo</Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-main">{children}</main>
    </div>
  );
}
