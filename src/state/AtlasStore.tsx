import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { appointments as seedAppointments, events as seedEvents, memberships as seedMemberships, products as seedProducts, services as seedServices, tenants as seedTenants } from '../data/demo';

type Tenant = typeof seedTenants[keyof typeof seedTenants] & {
  plan?: 'starter' | 'operations' | 'growth';
  sinpeNumber?: string;
  sinpeOwner?: string;
  primaryColor?: string;
  heroTitle?: string;
  ctaLabel?: string;
};
type Service = typeof seedServices[number];
type Appointment = typeof seedAppointments[number] & { date?: string; clientPhone?: string; depositStatus?: string; notes?: string };
type Membership = typeof seedMemberships[number] & { receiptName?: string; updatedAt?: string };
type Product = typeof seedProducts[number] & { id?: string };
type EventItem = typeof seedEvents[number] & { id?: string };

type NewTenantInput = {
  name: string;
  vertical: 'appointments' | 'membership';
  description: string;
  plan?: 'starter' | 'operations' | 'growth';
};

type NewServiceInput = {
  tenantSlug: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  deposit: number;
};

type NewAppointmentInput = {
  tenantSlug: string;
  client: string;
  clientPhone: string;
  service: string;
  time: string;
  date: string;
  notes: string;
};

type TenantPatch = Partial<Pick<Tenant, 'name' | 'description' | 'whatsapp' | 'address' | 'sinpeNumber' | 'sinpeOwner' | 'primaryColor' | 'heroTitle' | 'ctaLabel' | 'plan'>>;

type Store = {
  tenants: Record<string, Tenant>;
  services: Service[];
  appointments: Appointment[];
  memberships: Membership[];
  products: Product[];
  events: EventItem[];
  getTenant: (slug?: string) => Tenant;
  addTenant: (input: NewTenantInput) => string;
  updateTenant: (slug: string, patch: TenantPatch) => void;
  addService: (input: NewServiceInput) => void;
  createAppointment: (input: NewAppointmentInput) => void;
  updateAppointmentStatus: (appointmentId: string, status: string) => void;
  uploadReceipt: (membershipId: string, receiptName: string) => void;
  approveReceipt: (membershipId: string) => void;
  rejectReceipt: (membershipId: string) => void;
  addProduct: (tenantSlug: string, name: string, price: number) => void;
  addEvent: (tenantSlug: string, title: string, date: string, price: number) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<Store | null>(null);
const STORAGE_KEY = 'atlas-agenda-os-state-v2';

function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `tenant-${Date.now()}`;
}

function enrichTenants() {
  return Object.fromEntries(Object.entries(seedTenants).map(([slug, tenant]) => [slug, {
    ...tenant,
    plan: slug === 'atlas-fight-academy' ? 'operations' : 'growth',
    sinpeNumber: tenant.vertical === 'membership' ? '8888-0000' : '7777-0000',
    sinpeOwner: tenant.name,
    primaryColor: '#f59e0b',
    heroTitle: tenant.name,
    ctaLabel: tenant.vertical === 'membership' ? 'Entrar a mi cuenta' : 'Reservar ahora',
  } as Tenant]));
}

function initialState() {
  return {
    tenants: enrichTenants() as Record<string, Tenant>,
    services: seedServices as Service[],
    appointments: seedAppointments as Appointment[],
    memberships: seedMemberships as Membership[],
    products: seedProducts as Product[],
    events: seedEvents as EventItem[],
  };
}

export function AtlasStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setState(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const store = useMemo<Store>(() => ({
    ...state,
    getTenant: (slug?: string) => state.tenants[slug || 'ink-beauty-studio'] || state.tenants['ink-beauty-studio'],
    addTenant: (input) => {
      const slug = slugify(input.name);
      const modules = input.vertical === 'membership'
        ? ['Membresías', 'Comprobantes', 'Eventos', 'Productos', 'Promos', 'Clientes']
        : ['Agenda', 'Servicios', 'Profesionales', 'Depósitos', 'Clientes', 'Promos'];
      const tenant = {
        slug,
        name: input.name,
        vertical: input.vertical,
        label: input.vertical === 'membership' ? 'Gym y academia' : 'Citas y servicios',
        description: input.description,
        whatsapp: '50600000000',
        address: 'Costa Rica',
        modules,
        plan: input.plan || 'starter',
        sinpeNumber: '0000-0000',
        sinpeOwner: input.name,
        primaryColor: '#f59e0b',
        heroTitle: input.name,
        ctaLabel: input.vertical === 'membership' ? 'Entrar a mi cuenta' : 'Reservar ahora',
      } as Tenant;
      setState(current => ({ ...current, tenants: { ...current.tenants, [slug]: tenant } }));
      return slug;
    },
    updateTenant: (slug, patch) => {
      setState(current => ({
        ...current,
        tenants: { ...current.tenants, [slug]: { ...current.tenants[slug], ...patch } },
      }));
    },
    addService: (input) => {
      const service = { id: `svc-${Date.now()}`, ...input } as Service;
      setState(current => ({ ...current, services: [service, ...current.services] }));
    },
    createAppointment: (input) => {
      const appointment = { id: `apt-${Date.now()}`, status: 'pending_deposit', depositStatus: 'pending', ...input } as Appointment;
      setState(current => ({ ...current, appointments: [appointment, ...current.appointments] }));
    },
    updateAppointmentStatus: (appointmentId, status) => {
      setState(current => ({
        ...current,
        appointments: current.appointments.map(item => item.id === appointmentId ? { ...item, status } : item),
      }));
    },
    uploadReceipt: (membershipId, receiptName) => {
      setState(current => ({
        ...current,
        memberships: current.memberships.map(item => item.id === membershipId ? { ...item, status: 'receipt_uploaded', due: 'Comprobante en revisión', receiptName, updatedAt: new Date().toLocaleString('es-CR') } : item),
      }));
    },
    approveReceipt: (membershipId) => {
      setState(current => ({
        ...current,
        memberships: current.memberships.map(item => item.id === membershipId ? { ...item, status: 'paid', due: 'Pagado junio', updatedAt: new Date().toLocaleString('es-CR') } : item),
      }));
    },
    rejectReceipt: (membershipId) => {
      setState(current => ({
        ...current,
        memberships: current.memberships.map(item => item.id === membershipId ? { ...item, status: 'rejected', due: 'Reenviar comprobante', updatedAt: new Date().toLocaleString('es-CR') } : item),
      }));
    },
    addProduct: (tenantSlug, name, price) => {
      setState(current => ({ ...current, products: [{ id: `prd-${Date.now()}`, tenantSlug, name, category: 'Nuevo', price }, ...current.products] }));
    },
    addEvent: (tenantSlug, title, date, price) => {
      setState(current => ({ ...current, events: [{ id: `evt-${Date.now()}`, tenantSlug, title, date, price }, ...current.events] }));
    },
    resetDemo: () => setState(initialState()),
  }), [state]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useAtlasStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useAtlasStore must be used inside AtlasStoreProvider');
  return value;
}
