import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useBusinessMedia } from '../../platform/businessMedia';

export function BusinessMediaPreview({ tenantSlug }: { tenantSlug: string }) {
  const media = useBusinessMedia(tenantSlug);

  async function add(file: File | undefined, role: 'hero' | 'gallery') {
    if (!file) return;
    await media.addImageFromFile(file, role);
    toast.success(role === 'hero' ? 'Hero del negocio actualizado' : 'Imagen agregada a la galería');
  }

  return (
    <article className="card business-media-admin">
      <div className="business-media-admin-head">
        <div>
          <span className="eyebrow">Visuales públicos</span>
          <h3>Imágenes del negocio</h3>
          <p>Estas imágenes alimentan la página pública y decoran la cuenta del cliente. Solo el admin las controla.</p>
        </div>
        <div className="media-upload-actions">
          <label className="btn btn-secondary btn-sm"><Upload size={15} /> Hero<input type="file" accept="image/*" onChange={(e) => void add(e.target.files?.[0], 'hero')} /></label>
          <label className="btn btn-primary btn-sm"><Image size={15} /> Galería<input type="file" accept="image/*" onChange={(e) => void add(e.target.files?.[0], 'gallery')} /></label>
        </div>
      </div>
      {media.images.length ? (
        <div className="business-media-admin-grid">
          {media.images.slice(0, 8).map((item) => (
            <div className={`business-media-admin-card ${item.role === 'hero' ? 'is-hero' : ''}`} key={item.id}>
              <img src={item.url} alt={item.title} />
              <span>{item.role === 'hero' ? 'Hero público' : 'Galería'}</span>
              <button onClick={() => media.removeImage(item.id)}>×</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state"><strong>Sin imágenes</strong><span>Subí un hero o una galería desde este panel privado.</span></div>
      )}
    </article>
  );
}
