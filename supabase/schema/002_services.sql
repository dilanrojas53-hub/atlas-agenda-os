create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category_id uuid references public.service_categories(id) on delete set null,
  name text not null,
  description text default '',
  price_from integer not null default 0,
  duration_minutes integer not null default 30,
  image_url text,
  is_active boolean not null default true,
  requires_deposit boolean not null default false,
  deposit_amount integer not null default 0,
  requires_consultation boolean not null default false,
  badge text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_categories enable row level security;
alter table public.services enable row level security;

create policy service_categories_public_read on public.service_categories for select using (is_active = true);
create policy services_public_read on public.services for select using (is_active = true);
