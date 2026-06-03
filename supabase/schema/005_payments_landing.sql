create table if not exists public.appointment_payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  amount integer not null default 0,
  method text not null default 'sinpe',
  status text not null default 'pending',
  receipt_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_landing_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade unique,
  enabled boolean not null default true,
  hero_title text,
  hero_subtitle text,
  hero_description text,
  hero_image_url text,
  portfolio_pdf_url text,
  about_title text,
  about_description text,
  google_maps_url text,
  whatsapp_message text,
  business_hours jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.appointment_payments enable row level security;
alter table public.business_landing_settings enable row level security;

create policy appointment_payments_insert_public on public.appointment_payments for insert with check (true);
create policy business_landing_public_read on public.business_landing_settings for select using (enabled = true);
