import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AtlasRepository, CatalogRecord, ClientRecord, TenantRecord, TransactionRecord } from '../domain/repositoryContract';

export const supabaseRepository: AtlasRepository = {
  async listTenants(): Promise<TenantRecord[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data } = await supabase.from('businesses').select('slug,name,vertical,plan_tier,description,whatsapp,address').eq('is_active', true);
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
    const { data } = await supabase.from('businesses').select('slug,name,vertical,plan_tier,description,whatsapp,address').eq('slug', slug).maybeSingle();
    if (!data) return null;
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
    const { data } = await supabase.from('catalog_items').select('id,business_id,kind,name,price').eq('is_active', true);
    return (data || []).map(row => ({ id: row.id, tenantSlug, kind: row.kind, name: row.name, price: row.price }));
  },

  async listTransactions(_tenantSlug: string): Promise<TransactionRecord[]> {
    return [];
  },
};
