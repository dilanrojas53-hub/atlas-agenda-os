export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived';

export type TenantRecord = {
  slug: string;
  name: string;
  vertical: string;
  plan?: string;
  description: string;
  whatsapp?: string;
  address?: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
};

export type CatalogRecord = {
  id: string;
  tenantSlug: string;
  kind: 'service' | 'product' | 'event' | 'membership' | 'package';
  name: string;
  price: number;
};

export type TransactionRecord = {
  id: string;
  tenantSlug: string;
  clientId?: string;
  type: 'booking' | 'membership' | 'product' | 'event';
  status: string;
  paymentStatus: string;
  total: number;
};

export interface AtlasRepository {
  listTenants(): Promise<TenantRecord[]>;
  getTenant(slug: string): Promise<TenantRecord | null>;
  listClients(tenantSlug: string): Promise<ClientRecord[]>;
  listCatalog(tenantSlug: string): Promise<CatalogRecord[]>;
  listTransactions(tenantSlug: string): Promise<TransactionRecord[]>;
}
