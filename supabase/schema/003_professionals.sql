create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  role text not null default 'Professional',
  bio text default '',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (professional_id, service_id)
);

create table if not exists public.professional_availability (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  professional_id uuid not null references public.professionals(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true
);

alter table public.professionals enable row level security;
alter table public.professional_services enable row level security;
alter table public.professional_availability enable row level security;

create policy professionals_public_read on public.professionals for select using (is_active = true);
create policy professional_services_public_read on public.professional_services for select using (true);
create policy availability_public_read on public.professional_availability for select using (is_active = true);
