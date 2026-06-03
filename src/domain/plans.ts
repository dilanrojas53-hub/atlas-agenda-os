export type PlanTier = 'starter' | 'operations' | 'growth';
export type Vertical = 'appointments' | 'membership' | 'clinic' | 'academy' | 'commerce';

export const PLAN_LABELS: Record<PlanTier, string> = {
  starter: 'Starter',
  operations: 'Operations',
  growth: 'Growth',
};

export const VERTICAL_LABELS: Record<Vertical, string> = {
  appointments: 'Citas y servicios',
  membership: 'Membresias y academias',
  clinic: 'Clinicas y expedientes',
  academy: 'Academias y tracking',
  commerce: 'Productos y eventos',
};

export const CORE_MODULES = ['landing', 'client_portal', 'catalog', 'sinpe_payments'];

export const PLAN_MODULES: Record<PlanTier, string[]> = {
  starter: CORE_MODULES,
  operations: [...CORE_MODULES, 'staff_portal', 'promotions', 'automations'],
  growth: [...CORE_MODULES, 'staff_portal', 'promotions', 'automations', 'loyalty', 'ai_insights'],
};

export const VERTICAL_MODULES: Record<Vertical, string[]> = {
  appointments: ['appointments', 'professionals', 'deposits'],
  membership: ['memberships', 'receipts', 'events', 'products'],
  clinic: ['appointments', 'professionals', 'records', 'documents'],
  academy: ['memberships', 'attendance', 'events', 'progress'],
  commerce: ['products', 'events', 'orders'],
};

export function getEnabledModules(plan: PlanTier, vertical: Vertical) {
  return Array.from(new Set([...PLAN_MODULES[plan], ...VERTICAL_MODULES[vertical]]));
}
