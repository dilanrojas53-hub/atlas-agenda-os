create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique,
  email text,
  name text,
  avatar_url text,
  birthday date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_client_stats (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  points integer not null default 0,
  level text not null default 'bronze',
  total_spent integer not null default 0,
  total_transactions integer not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, client_id)
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  type text not null default 'percentage',
  value integer not null default 0,
  active_until timestamptz,
  is_active boolean not null default true,
  is_new_customer boolean not null default false,
  is_reactivation boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  discount_type text not null default 'percentage',
  discount_value integer not null default 0,
  max_uses integer,
  used_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, code)
);

create table if not exists public.loyalty_rewards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  points_required integer not null default 0,
  reward_value integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  trigger_type text not null,
  action_type text not null,
  action_config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.client_profiles enable row level security;
alter table public.tenant_client_stats enable row level security;
alter table public.promotions enable row level security;
alter table public.coupons enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.automation_rules enable row level security;

create policy client_profiles_insert_public on public.client_profiles for insert with check (true);
create policy tenant_client_stats_public_read on public.tenant_client_stats for select using (true);
create policy promotions_public_read on public.promotions for select using (is_active = true);
create policy coupons_public_read on public.coupons for select using (is_active = true);
create policy loyalty_rewards_public_read on public.loyalty_rewards for select using (is_active = true);
create policy automation_rules_public_read on public.automation_rules for select using (is_active = true);
