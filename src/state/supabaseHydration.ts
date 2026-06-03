import { isSupabaseConfigured, supabase } from '../lib/supabase';

export async function loadSupabaseSnapshot() {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id,slug,name,vertical,plan_tier,description,whatsapp,address')
    .eq('is_active', true);

  if (error || !businesses?.length) return null;

  const tenants = Object.fromEntries(businesses.map((row: any) => [row.slug, {
    slug: row.slug,
    name: row.name,
    vertical: row.vertical,
    label: row.vertical === 'membership' ? 'Gym y academia' : 'Citas y servicios',
    description: row.description || '',
    whatsapp: row.whatsapp || '',
    address: row.address || 'Costa Rica',
    modules: row.vertical === 'membership'
      ? ['Membresías', 'Comprobantes', 'Eventos', 'Productos', 'Promos', 'Clientes']
      : ['Agenda', 'Servicios', 'Profesionales', 'Depósitos', 'Clientes', 'Promos'],
    plan: row.plan_tier || 'starter',
    sinpeNumber: '0000-0000',
    sinpeOwner: row.name,
    primaryColor: '#f59e0b',
    heroTitle: row.name,
    ctaLabel: row.vertical === 'membership' ? 'Entrar a mi cuenta' : 'Reservar ahora',
  }]));

  const businessById = Object.fromEntries(businesses.map((row: any) => [row.id, row]));
  const { data: catalog } = await supabase
    .from('catalog_items')
    .select('id,business_id,kind,name,category,price,duration_minutes,deposit_amount')
    .eq('is_active', true);

  const services = (catalog || []).filter((item: any) => item.kind === 'service').map((item: any) => ({
    id: item.id,
    tenantSlug: businessById[item.business_id]?.slug || 'ink-beauty-studio',
    category: item.category || 'General',
    name: item.name,
    price: item.price || 0,
    duration: item.duration_minutes || 45,
    deposit: item.deposit_amount || 0,
  }));

  const products = (catalog || []).filter((item: any) => item.kind === 'product').map((item: any) => ({
    id: item.id,
    tenantSlug: businessById[item.business_id]?.slug || 'atlas-fight-academy',
    category: item.category || 'Producto',
    name: item.name,
    price: item.price || 0,
  }));

  const events = (catalog || []).filter((item: any) => item.kind === 'event').map((item: any) => ({
    id: item.id,
    tenantSlug: businessById[item.business_id]?.slug || 'atlas-fight-academy',
    title: item.name,
    date: 'Próximamente',
    price: item.price || 0,
  }));

  return { tenants, services, products, events };
}
