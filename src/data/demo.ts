export const tenants = {
  'ink-beauty-studio': {
    slug: 'ink-beauty-studio',
    name: 'Ink Beauty Studio',
    vertical: 'appointments',
    label: 'Tattoo, piercing y belleza',
    description: 'Estudio demo para servicios por cita, deposito y seguimiento del cliente.',
    whatsapp: '50670000000',
    address: 'Costa Rica',
    modules: ['Agenda', 'Servicios', 'Profesionales', 'Depositos', 'Clientes', 'Promos']
  },
  'atlas-fight-academy': {
    slug: 'atlas-fight-academy',
    name: 'Atlas Fight Academy',
    vertical: 'membership',
    label: 'Gym y academia',
    description: 'Academia demo para mensualidades, comprobantes SINPE, eventos, productos y tracking.',
    whatsapp: '50671112222',
    address: 'San Jose, Costa Rica',
    modules: ['Membresias', 'Comprobantes', 'Eventos', 'Productos', 'Promos', 'Clientes']
  }
};

export const business = tenants['ink-beauty-studio'];

export const services = [
  { id: 'tattoo-small', tenantSlug: 'ink-beauty-studio', category: 'Tattoo', name: 'Tatuaje pequeno', price: 25000, duration: 60, deposit: 10000 },
  { id: 'piercing-nose', tenantSlug: 'ink-beauty-studio', category: 'Piercing', name: 'Piercing nariz', price: 18000, duration: 30, deposit: 5000 },
  { id: 'nails', tenantSlug: 'ink-beauty-studio', category: 'Belleza', name: 'Unas acrilicas', price: 22000, duration: 90, deposit: 5000 }
];

export const appointments = [
  { id: 'apt-001', tenantSlug: 'ink-beauty-studio', client: 'Maria Lopez', service: 'Piercing nariz', status: 'confirmed', time: '2:30 PM' },
  { id: 'apt-002', tenantSlug: 'ink-beauty-studio', client: 'Carlos Vega', service: 'Tatuaje pequeno', status: 'pending_deposit', time: '4:00 PM' }
];

export const memberships = [
  { id: 'mem-001', tenantSlug: 'atlas-fight-academy', client: 'Jose Ramirez', plan: 'MMA mensual', status: 'paid', due: 'Pagado junio', amount: 35000 },
  { id: 'mem-002', tenantSlug: 'atlas-fight-academy', client: 'Daniela Soto', plan: 'Boxeo mensual', status: 'pending_receipt', due: 'Pendiente comprobante', amount: 28000 },
  { id: 'mem-003', tenantSlug: 'atlas-fight-academy', client: 'Kevin Mora', plan: 'BJJ mensual', status: 'late', due: 'Vencido hace 3 dias', amount: 32000 }
];

export const products = [
  { tenantSlug: 'ink-beauty-studio', name: 'Kit aftercare', category: 'Cuidado', price: 7000 },
  { tenantSlug: 'atlas-fight-academy', name: 'Guantes de boxeo', category: 'Academia', price: 28000 },
  { tenantSlug: 'atlas-fight-academy', name: 'Camisa oficial', category: 'Merch', price: 12000 }
];

export const events = [
  { tenantSlug: 'atlas-fight-academy', title: 'Seminario striking', date: 'Sabado 15', price: 10000 },
  { tenantSlug: 'atlas-fight-academy', title: 'Clase abierta', date: 'Domingo 23', price: 0 },
  { tenantSlug: 'ink-beauty-studio', title: 'Flash day tattoo', date: 'Viernes 28', price: 15000 }
];

export const clientProfile = {
  name: 'Maria Lopez',
  phone: '+506 8888 0000',
  points: 240,
  upcoming: ['Piercing nariz · Hoy 2:30 PM', 'Flash day tattoo · Viernes 28'],
  payments: ['Deposito piercing · Pagado', 'Kit aftercare · Disponible para compra']
};

export function getTenant(slug?: string) {
  return tenants[(slug || 'ink-beauty-studio') as keyof typeof tenants] || tenants['ink-beauty-studio'];
}
