import { type ReactNode } from 'react';
import { Link } from 'wouter';

interface PublicLayoutProps {
  children: ReactNode;
  slug?: string;
  businessName?: string;
}

export function PublicLayout({ children, slug, businessName }: PublicLayoutProps) {
  return (
    <div className="public-shell">
      <header className="public-topbar">
        <Link href="/" className="public-topbar-brand">
          {businessName || 'Atlas Agenda OS'}
        </Link>
        <nav className="public-topbar-nav">
          {slug ? (
            <>
              <Link href={`/${slug}`} className="public-topbar-link">Inicio</Link>
              <Link href={`/${slug}/info`} className="public-topbar-link">Info</Link>
              <Link href="/client/login" className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
            </>
          ) : (
            <>
              <Link href="/ink-beauty-studio" className="public-topbar-link">Citas</Link>
              <Link href="/atlas-fight-academy" className="public-topbar-link">Academia</Link>
              <Link href="/client/login" className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-main">{children}</main>
    </div>
  );
}
