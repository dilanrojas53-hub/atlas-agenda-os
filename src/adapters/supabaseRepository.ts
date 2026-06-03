import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AtlasRepository, CatalogRecord, ClientRecord, TenantRecord, TransactionRecord } from '../domain/repositoryContract';

export const supabaseRepository: AtlasRepository = {
  async listTenants(): Promise<TenantRecord[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('businesses')
      .select('slug,name,vertical,plan_tier,description,whatsapp,address')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('[Atlas Supabase] listTenants failed', error.message);
      return [];
    }
    return (data || []).map(row => ({
      slug: row.slug,
      name: row.name,
      vertical: row.vertical,
      plan: row.plan_tier,
      description: row.description || '',
      whatsapp: row.whatsapp || '',
      address: row.address || '',
    }));
  },

  async getTenant(slug: string): Promise<TenantRecord | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('businesses')
      .select('slug,name,vertical,plan_tier,description,whatsapp,address')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    if (error || !data) return null;
    return {
      slug: data.slug,
      name: data.name,
      vertical: data.vertical,
      plan: data.plan_tier,
      description: data.description || '',
      whatsapp: data.whatsapp || '',
      address: data.address || '',
    };
  },

  async listClients(_tenantSlug: string): Promise<ClientRecord[]> {
    return [];
  },

  async listCatalog(tenantSlug: string): Promise<CatalogRecord[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data: tenant } = await supabase
      .from('businesses')
      .select('id')
      .eq('slug', tenantSlug)
      .maybeSingle();
    if (!tenant?.id) return [];

    const { data, error } = await supabase
      .from('catalog_items')
      .select('id,kind,name,price')
      .eq('business_id', tenant.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) {
      console.warn('[Atlas Supabase] listCatalog failed', error.message);
      return [];
    }
    return (data || []).map(row => ({
      id: row.id,
      tenantSlug,
      kind: row.kind,
      name: row.name,
      price: row.price,
    }));
  },

  async listTransactions(_tenantSlug: string): Promise<TransactionRecord[]> {
    return [];
  },
};
