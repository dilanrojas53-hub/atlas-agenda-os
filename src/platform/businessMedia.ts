import { useMemo, useState } from 'react';

export type BusinessImageRole = 'hero' | 'gallery' | 'service' | 'aftercare' | 'product';
export type BusinessImage = { id: string; tenantSlug: string; role: BusinessImageRole; title: string; caption: string; url: string; source: 'upload'; createdAt: string };

const STORAGE_KEY = 'atlas-business-media-v1';

function readAll(): BusinessImage[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as BusinessImage[]; } catch { return []; }
}

function writeAll(items: BusinessImage[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useBusinessMedia(tenantSlug: string) {
  const [uploads, setUploads] = useState<BusinessImage[]>(readAll);
  const images = useMemo(() => uploads.filter((image) => image.tenantSlug === tenantSlug), [uploads, tenantSlug]);
  const heroImage = images.find((image) => image.role === 'hero');
  const galleryImages = images.filter((image) => image.role !== 'hero').slice(0, 8);

  function addImageFromFile(file: File, role: BusinessImageRole = 'gallery') {
    return new Promise<BusinessImage>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      reader.onload = () => {
        const image: BusinessImage = {
          id: `img-${Date.now()}`,
          tenantSlug,
          role,
          title: file.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Imagen del negocio',
          caption: role === 'hero' ? 'Imagen principal del negocio' : 'Imagen agregada a la galería',
          url: String(reader.result),
          source: 'upload',
          createdAt: new Date().toLocaleString('es-CR'),
        };
        const next = [image, ...uploads];
        setUploads(next);
        writeAll(next);
        resolve(image);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(imageId: string) {
    const next = uploads.filter((image) => image.id !== imageId);
    setUploads(next);
    writeAll(next);
  }

  return { images, heroImage, galleryImages, addImageFromFile, removeImage };
}
