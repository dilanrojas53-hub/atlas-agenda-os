import { type ReactNode } from 'react';
import { Link } from 'wouter';
import { Image as ImageIcon } from 'lucide-react';
import { useBusinessMedia } from '../platform/businessMedia';

interface PublicLayoutProps {
  children: ReactNode;
  slug?: string;
  businessName?: string;
  businessType?: 'appointments' | 'membership';
}

function PublicBusinessMedia({ slug, businessName }: { slug: string; businessName?: string }) {
  const media = useBusinessMedia(slug);
  if (!media.heroImage && media.galleryImages.length === 0) return null;
  const previewImages = [media.heroImage, ...media.galleryImages].filter(Boolean).slice(0, 4);

  return (
    <section className="public-business-media card">
      {media.heroImage ? (
        <div className="public-business-hero-image">
          <img src={media.heroImage.url} alt={media.heroImage.title || businessName || 'Imagen del negocio'} />
          <div>
            <span>Imagen principal</span>
            <strong>{businessName}</strong>
          </div>
        </div>
      ) : (
        <div className="public-business-media-empty"><ImageIcon /><span>Galería del negocio</span></div>
      )}
      {previewImages.length > 1 ? (
        <div className="public-business-gallery-mini">
          {previewImages.slice(1).map((image) => image ? <img key={image.id} src={image.url} alt={image.title} /> : null)}
        </div>
      ) : null}
    </section>
  );
}

export function PublicLayout({ children, slug, businessName, businessType }: PublicLayoutProps) {
  const isBusinessPage = Boolean(slug);
  const isMembership = businessType === 'membership';

  return (
    <div className="public-shell">
      <header className="public-topbar">
        <Link href={isBusinessPage ? `/${slug}` : '/'} className="public-topbar-brand">
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
                <Link href={`/app/${slug}/login`} className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
              </>
            ) : (
              <>
                <Link href={`/${slug}`} className="public-topbar-link">Inicio</Link>
                <a href="#services" className="public-topbar-link">Servicios</a>
                <a href="#professionals" className="public-topbar-link">Profesionales</a>
                <a href="#location" className="public-topbar-link">Ubicación</a>
                <Link href={`/app/${slug}/login`} className="public-topbar-link btn btn-sm btn-secondary">Mi cuenta</Link>
              </>
            )
          ) : (
            <>
              <a href="#features" className="public-topbar-link">Producto</a>
              <a href="#trusted-businesses" className="public-topbar-link">Negocios</a>
              <a href="#operating-model" className="public-topbar-link">Cómo funciona</a>
              <Link href="/ink-beauty-studio" className="public-topbar-link btn btn-sm btn-secondary">Ver ejemplo público</Link>
            </>
          )}
        </nav>
      </header>
      <main className="public-main">
        {isBusinessPage && slug ? <PublicBusinessMedia slug={slug} businessName={businessName} /> : null}
        {children}
      </main>
    </div>
  );
}
