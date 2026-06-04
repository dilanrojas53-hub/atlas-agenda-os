import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AppointmentInput = {
  tenantSlug: string;
  client: string;
  clientPhone: string;
  service: string;
  time: string;
  date: string;
  notes: string;
};

type ServiceInput = {
  tenantSlug: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  deposit: number;
};

type BusinessInput = {
  slug: string;
  name: string;
  vertical: 'appointments' | 'membership';
  description: string;
  plan?: 'starter' | 'operations' | 'growth';
};

type BusinessPatch = {
  name?: string;
  description?: string;
  whatsapp?: string;
  address?: string;
  plan?: 'starter' | 'operations' | 'growth';
  heroTitle?: string;
  ctaLabel?: string;
};

async function getBusinessId(slug: string) {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from('businesses').select('id').eq('slug', slug).maybeSingle();
  if (error || !data?.id) return null;
  return data.id as string;
}

async function getOrCreateClient(input: { name: string; phone?: string }) {
  if (!isSupabaseConfigured || !supabase) return null;
  const phone = input.phone?.trim() || `demo-${Date.now()}`;
  const { data: existing } = await supabase.from('client_profiles').select('id').eq('phone', phone).maybeSingle();
  if (existing?.id) return existing.id as string;

  const { data, error } = await supabase
    .from('client_profiles')
    .insert({ name: input.name, phone })
    .select('id')
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id as string;
}

export async function createBusinessRemote(input: BusinessInput) {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      slug: input.slug,
      name: input.name,
      vertical: input.vertical,
      plan_tier: input.plan || 'starter',
      description: input.description,
      is_active: true,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.warn('[Atlas Supabase] createBusiness failed', error.message);
    return null;
  }
  return data?.id as string | undefined;
}

export async function updateBusinessRemote(slug: string, patch: BusinessPatch) {
  if (!isSupabaseConfigured || !supabase) return false;
  const payload: Record<string, string | undefined> = {
    name: patch.name,
    description: patch.description,
    whatsapp: patch.whatsapp,
    address: patch.address,
    plan_tier: patch.plan,
    updated_at: new Date().toISOString(),
  };
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
  const { error } = await supabase.from('businesses').update(payload).eq('slug', slug);
  if (error) {
    console.warn('[Atlas Supabase] updateBusiness failed', error.message);
    return false;
  }
  return true;
}

export async function createAppointmentRemote(input: AppointmentInput) {
  if (!isSupabaseConfigured || !supabase) return null;
  const businessId = await getBusinessId(input.tenantSlug);
  if (!businessId) return null;
  const clientId = await getOrCreateClient({ name: input.client, phone: input.clientPhone });

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      business_id: businessId,
      client_id: clientId,
      professional_name: null,
      starts_at: null,
      status: 'requested',
      deposit_status: 'pending',
      client_notes: `${input.service} · ${input.date} · ${input.time} · ${input.notes}`,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.warn('[Atlas Supabase] createAppointment failed', error.message);
    return null;
  }
  return data?.id as string | undefined;
}

export async function addServiceRemote(input: ServiceInput) {
  if (!isSupabaseConfigured || !supabase) return null;
  const businessId = await getBusinessId(input.tenantSlug);
  if (!businessId) return null;

  const { data, error } = await supabase
    .from('catalog_items')
    .insert({
      business_id: businessId,
      kind: 'service',
      name: input.name,
      category: input.category,
      price: input.price,
      duration_minutes: input.duration,
      requires_deposit: input.deposit > 0,
      deposit_amount: input.deposit,
      is_active: true,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.warn('[Atlas Supabase] addService failed', error.message);
    return null;
  }
  return data?.id as string | undefined;
}

export async function addCatalogItemRemote(input: { tenantSlug: string; kind: 'product' | 'event'; name: string; price: number }) {
  if (!isSupabaseConfigured || !supabase) return null;
  const businessId = await getBusinessId(input.tenantSlug);
  if (!businessId) return null;

  const { data, error } = await supabase
    .from('catalog_items')
    .insert({ business_id: businessId, kind: input.kind, name: input.name, category: input.kind, price: input.price, is_active: true })
    .select('id')
    .maybeSingle();

  if (error) {
    console.warn('[Atlas Supabase] addCatalogItem failed', error.message);
    return null;
  }
  return data?.id as string | undefined;
}

export async function updateMembershipStatusRemote(membershipId: string, status: string) {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await supabase.from('memberships').update({ status, updated_at: new Date().toISOString() }).eq('id', membershipId);
  if (error) {
    console.warn('[Atlas Supabase] updateMembershipStatus failed', error.message);
    return false;
  }
  return true;
}
