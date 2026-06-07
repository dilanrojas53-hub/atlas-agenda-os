import { Image } from 'lucide-react';
import { useBusinessMedia } from '../../platform/businessMedia';

export function BusinessMediaPreview({ tenantSlug }: { tenantSlug: string }) {
  const media = useBusinessMedia(tenantSlug);
  return (
    <article className="card business-media-admin">
      <span className="eyebrow">Visuales</span>
      <h3>Imágenes del negocio</h3>
      <p>Estas imágenes alimentan el hero y la galería del portal cliente.</p>
      {media.images.length ? (
        <div className="business-media-admin-grid">
          {media.images.slice(0, 6).map((item) => (
            <div className="business-media-admin-card" key={item.id}>
              <img src={item.url} alt={item.title} />
              <span>{item.role}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><strong>Sin imágenes</strong><span>Las imágenes que se suban al portal aparecerán aquí.</span></div>
      )}
      <div className="empty-state"><Image size={18} /><span>Próximo paso: conectar esta sección a Supabase Storage para que el admin cargue imágenes reales.</span></div>
    </article>
  );
}
