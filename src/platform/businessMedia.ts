import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type BusinessImageRole = 'hero' | 'gallery' | 'service' | 'aftercare' | 'product';
export type BusinessImage = {
  id: string;
  tenantSlug: string;
  role: BusinessImageRole;
  title: string;
  caption: string;
  url: string;
  source: 'local' | 'supabase';
  createdAt: string;
  storagePath?: string;
};

type BusinessMediaRow = {
  id: string;
  tenant_slug: string;
  role: BusinessImageRole;
  title: string;
  caption: string;
  storage_path: string;
  public_url: string;
  created_at: string;
};

const STORAGE_KEY = 'atlas-business-media-v1';
const BUCKET = 'business-media';

function readLocal(): BusinessImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]') as BusinessImage[];
    return parsed.map((item) => ({ ...item, source: item.source || 'local' }));
  } catch {
    return [];
  }
}

function writeLocal(items: BusinessImage[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.filter((item) => item.source === 'local')));
}

function toImage(row: BusinessMediaRow): BusinessImage {
  return {
    id: row.id,
    tenantSlug: row.tenant_slug,
    role: row.role,
    title: row.title,
    caption: row.caption,
    url: row.public_url,
    source: 'supabase',
    createdAt: row.created_at,
    storagePath: row.storage_path,
  };
}

function safeFileName(file: File) {
  const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'image.jpg';
  return `${Date.now()}-${clean}`;
}

function localImageFromFile(file: File, tenantSlug: string, role: BusinessImageRole) {
  return new Promise<BusinessImage>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    reader.onload = () => resolve({
      id: `local-${Date.now()}`,
      tenantSlug,
      role,
      title: file.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Imagen del negocio',
      caption: role === 'hero' ? 'Imagen principal del negocio' : 'Imagen agregada a la galería',
      url: String(reader.result),
      source: 'local',
      createdAt: new Date().toLocaleString('es-CR'),
    });
    reader.readAsDataURL(file);
  });
}

export function useBusinessMedia(tenantSlug: string) {
  const [images, setImages] = useState<BusinessImage[]>(readLocal);
  const tenantImages = useMemo(() => images.filter((image) => image.tenantSlug === tenantSlug), [images, tenantSlug]);
  const heroImage = tenantImages.find((image) => image.role === 'hero');
  const galleryImages = tenantImages.filter((image) => image.role !== 'hero').slice(0, 8);

  useEffect(() => {
    let cancelled = false;
    async function loadRemote() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('business_media')
        .select('id, tenant_slug, role, title, caption, storage_path, public_url, created_at')
        .eq('tenant_slug', tenantSlug)
        .order('created_at', { ascending: false });
      if (cancelled || error || !data) return;
      const remote = (data as BusinessMediaRow[]).map(toImage);
      setImages((current) => {
        const local = current.filter((item) => item.source === 'local');
        return [...remote, ...local];
      });
    }
    void loadRemote();
    return () => { cancelled = true; };
  }, [tenantSlug]);

  async function addImageFromFile(file: File, role: BusinessImageRole = 'gallery') {
    if (supabase) {
      try {
        const storagePath = `${tenantSlug}/${safeFileName(file)}`;
        const upload = await supabase.storage.from(BUCKET).upload(storagePath, file, { cacheControl: '3600', upsert: false });
        if (upload.error) throw upload.error;
        const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
        const insert = await supabase
          .from('business_media')
          .insert({
            tenant_slug: tenantSlug,
            role,
            title: file.name.replace(/\.[^.]+$/, '').slice(0, 40) || 'Imagen del negocio',
            caption: role === 'hero' ? 'Imagen principal del negocio' : 'Imagen agregada a la galería',
            storage_path: storagePath,
            public_url: publicUrl,
          })
          .select('id, tenant_slug, role, title, caption, storage_path, public_url, created_at')
          .single();
        if (insert.error || !insert.data) throw insert.error;
        const image = toImage(insert.data as BusinessMediaRow);
        setImages((current) => [image, ...current]);
        return image;
      } catch (error) {
        console.warn('Supabase media upload failed, falling back to localStorage', error);
      }
    }

    const local = await localImageFromFile(file, tenantSlug, role);
    setImages((current) => {
      const next = [local, ...current];
      writeLocal(next);
      return next;
    });
    return local;
  }

  async function removeImage(imageId: string) {
    const target = images.find((image) => image.id === imageId);
    if (target?.source === 'supabase' && supabase) {
      await supabase.from('business_media').delete().eq('id', imageId);
      if (target.storagePath) await supabase.storage.from(BUCKET).remove([target.storagePath]);
    }
    setImages((current) => {
      const next = current.filter((image) => image.id !== imageId);
      writeLocal(next);
      return next;
    });
  }

  return { images: tenantImages, heroImage, galleryImages, addImageFromFile, removeImage };
}
