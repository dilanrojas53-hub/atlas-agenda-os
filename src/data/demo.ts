export const tenants = {
  'ink-beauty-studio': {
    slug: 'ink-beauty-studio',
    name: 'Ink Beauty Studio',
    vertical: 'appointments',
    label: 'Tattoo, piercing y belleza',
    description: 'Estudio boutique en San Jose para tattoo fino, piercing seguro, cejas, unas y servicios de belleza por cita.',
    whatsapp: '50670000000',
    address: 'Barrio Escalante, San Jose',
    modules: ['Servicios', 'Profesionales', 'Reservas', 'Depositos', 'Aftercare', 'Promos']
  },
  'atlas-fight-academy': {
    slug: 'atlas-fight-academy',
    name: 'Atlas Fight Academy',
    vertical: 'membership',
    label: 'Gym y academia',
    description: 'Academia de MMA, BJJ y boxeo con membresias, clases, eventos, productos y pagos SINPE desde portal de alumno.',
    whatsapp: '50671112222',
    address: 'San Pedro, San Jose',
    modules: ['Planes', 'Clases', 'Pagos SINPE', 'Eventos', 'Productos', 'Alumnos']
  },
  'nova-skin-clinic': {
    slug: 'nova-skin-clinic',
    name: 'Nova Skin Clinic',
    vertical: 'appointments',
    label: 'Clinica estetica',
    description: 'Clinica estetica para limpiezas faciales, depilacion laser, valoraciones y tratamientos por cita.',
    whatsapp: '50672223333',
    address: 'Escazu, San Jose',
    modules: ['Valoraciones', 'Servicios', 'Agenda', 'Depositos', 'Seguimiento', 'Promos']
  },
  'flow-pilates-studio': {
    slug: 'flow-pilates-studio',
    name: 'Flow Pilates Studio',
    vertical: 'membership',
    label: 'Studio fitness',
    description: 'Studio de pilates y movilidad con paquetes mensuales, clases reservables y control de asistencia.',
    whatsapp: '50673334444',
    address: 'Curridabat, San Jose',
    modules: ['Planes', 'Clases', 'Reservas', 'Pagos', 'Eventos', 'Alumnos']
  }
};

export const business = tenants['ink-beauty-studio'];

export const services = [
  { id: 'tattoo-small', tenantSlug: 'ink-beauty-studio', category: 'Tattoo fino', name: 'Tatuaje pequeno lineal', price: 25000, duration: 60, deposit: 10000 },
  { id: 'piercing-nose', tenantSlug: 'ink-beauty-studio', category: 'Piercing', name: 'Piercing nariz titanio', price: 18000, duration: 30, deposit: 5000 },
  { id: 'brows-design', tenantSlug: 'ink-beauty-studio', category: 'Belleza', name: 'Diseno de cejas premium', price: 16000, duration: 45, deposit: 5000 },
  { id: 'nails', tenantSlug: 'ink-beauty-studio', category: 'Unas', name: 'Unas acrilicas soft glam', price: 22000, duration: 90, deposit: 5000 },
  { id: 'facial-clean', tenantSlug: 'nova-skin-clinic', category: 'Facial', name: 'Limpieza facial profunda', price: 38000, duration: 75, deposit: 10000 },
  { id: 'laser-session', tenantSlug: 'nova-skin-clinic', category: 'Laser', name: 'Sesion laser zona pequena', price: 45000, duration: 45, deposit: 15000 },
  { id: 'skin-consult', tenantSlug: 'nova-skin-clinic', category: 'Valoracion', name: 'Valoracion estetica', price: 15000, duration: 30, deposit: 5000 }
];

export const appointments = [
  { id: 'apt-001', tenantSlug: 'ink-beauty-studio', client: 'Maria Lopez', clientPhone: '+506 8888 0000', service: 'Piercing nariz titanio', status: 'confirmed', time: '2:30 PM', date: 'Hoy', depositStatus: 'paid', notes: 'Cliente prefiere titanio dorado.' },
  { id: 'apt-002', tenantSlug: 'ink-beauty-studio', client: 'Carlos Vega', clientPhone: '+506 8777 1122', service: 'Tatuaje pequeno lineal', status: 'pending_deposit', time: '4:00 PM', date: 'Hoy', depositStatus: 'pending', notes: 'Trae referencia minimalista.' },
  { id: 'apt-003', tenantSlug: 'nova-skin-clinic', client: 'Andrea Solis', clientPhone: '+506 8666 4455', service: 'Limpieza facial profunda', status: 'confirmed', time: '10:00 AM', date: 'Manana', depositStatus: 'paid', notes: 'Piel sensible.' },
  { id: 'apt-004', tenantSlug: 'nova-skin-clinic', client: 'Valeria Mora', clientPhone: '+506 8555 9988', service: 'Valoracion estetica', status: 'confirmed', time: '1:15 PM', date: 'Viernes', depositStatus: 'paid', notes: 'Primera visita.' }
];

export const memberships = [
  { id: 'mem-001', tenantSlug: 'atlas-fight-academy', client: 'Jose Ramirez', phone: '+506 8888 1010', plan: 'MMA mensual', status: 'paid', due: 'Pagado junio', amount: 35000, updatedAt: 'Hoy 8:12 AM', notes: 'Alumno activo, 3 clases por semana.' },
  { id: 'mem-002', tenantSlug: 'atlas-fight-academy', client: 'Daniela Soto', phone: '+506 8777 2020', plan: 'Boxeo mensual', status: 'pending_receipt', due: 'Pendiente comprobante', amount: 28000, updatedAt: 'Ayer 7:40 PM', notes: 'Debe subir SINPE.' },
  { id: 'mem-003', tenantSlug: 'atlas-fight-academy', client: 'Kevin Mora', phone: '+506 8666 3030', plan: 'BJJ mensual', status: 'late', due: 'Vencido hace 3 dias', amount: 32000, updatedAt: 'Hace 3 dias', notes: 'Enviar recordatorio.' },
  { id: 'mem-004', tenantSlug: 'flow-pilates-studio', client: 'Sofia Castro', phone: '+506 8555 4040', plan: 'Pilates 8 clases', status: 'paid', due: 'Pagado junio', amount: 42000, updatedAt: 'Hoy 9:05 AM', notes: 'Reserva martes y jueves.' },
  { id: 'mem-005', tenantSlug: 'flow-pilates-studio', client: 'Natalia Rojas', phone: '+506 8444 5050', plan: 'Movilidad mensual', status: 'pending_receipt', due: 'Pendiente comprobante', amount: 30000, updatedAt: 'Hoy 11:20 AM', notes: 'Solicitud nueva.' }
];

export const products = [
  { tenantSlug: 'ink-beauty-studio', name: 'Kit aftercare tattoo', category: 'Cuidado', price: 7000 },
  { tenantSlug: 'ink-beauty-studio', name: 'Solucion salina piercing', category: 'Cuidado', price: 4500 },
  { tenantSlug: 'atlas-fight-academy', name: 'Guantes de boxeo', category: 'Academia', price: 28000 },
  { tenantSlug: 'atlas-fight-academy', name: 'Camisa oficial', category: 'Merch', price: 12000 },
  { tenantSlug: 'flow-pilates-studio', name: 'Mat premium', category: 'Studio', price: 24000 },
  { tenantSlug: 'flow-pilates-studio', name: 'Botella Flow', category: 'Merch', price: 8500 }
];

export const events = [
  { tenantSlug: 'atlas-fight-academy', title: 'Seminario striking con coach invitado', date: 'Sabado 15', price: 10000 },
  { tenantSlug: 'atlas-fight-academy', title: 'Clase abierta MMA', date: 'Domingo 23', price: 0 },
  { tenantSlug: 'flow-pilates-studio', title: 'Clase sunset pilates', date: 'Jueves 20', price: 6000 },
  { tenantSlug: 'ink-beauty-studio', title: 'Flash day tattoo minimal', date: 'Viernes 28', price: 15000 },
  { tenantSlug: 'nova-skin-clinic', title: 'Semana glow facial', date: 'Lunes 17', price: 25000 }
];

export const clientProfile = {
  name: 'Maria Lopez',
  phone: '+506 8888 0000',
  points: 240,
  upcoming: ['Piercing nariz titanio · Hoy 2:30 PM', 'Flash day tattoo minimal · Viernes 28'],
  payments: ['Deposito piercing · Pagado', 'Kit aftercare tattoo · Disponible para compra']
};

export function getTenant(slug?: string) {
  return tenants[(slug || 'ink-beauty-studio') as keyof typeof tenants] || tenants['ink-beauty-studio'];
}
