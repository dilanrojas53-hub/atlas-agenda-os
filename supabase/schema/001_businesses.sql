create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  vertical text not null default 'services',
  description text default '',
  logo_url text,
  phone text,
  whatsapp text,
  address text,
  is_active boolean not null default true,
  is_open boolean not null default true,
  plan_tier text not null default 'starter',
  admin_email text,
  admin_id uuid,
  visit_count integer not null default 0,
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_theme_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade unique,
  primary_color text not null default '#7c3aed',
  secondary_color text not null default '#0f172a',
  accent_color text not null default '#f59e0b',
  background_color text not null default '#09090b',
  surface_color text not null default '#18181b',
  text_color text not null default '#fafafa',
  font_family text not null default 'Inter',
  hero_image_url text,
  wordmark_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.businesses enable row level security;
alter table public.business_theme_settings enable row level security;

create policy businesses_public_read on public.businesses for select using (is_active = true);
create policy theme_public_read on public.business_theme_settings for select using (true);
