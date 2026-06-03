export const business = {
  slug: 'ink-beauty-studio',
  name: 'Ink Beauty Studio',
  description: 'Agenda demo para servicios por cita.',
  whatsapp: '50670000000',
  address: 'Costa Rica'
};

export const services = [
  { id: 'tattoo-small', category: 'Tattoo', name: 'Tatuaje pequeno', price: 25000, duration: 60, deposit: 10000 },
  { id: 'piercing-nose', category: 'Piercing', name: 'Piercing nariz', price: 18000, duration: 30, deposit: 5000 },
  { id: 'nails', category: 'Belleza', name: 'Unas acrilicas', price: 22000, duration: 90, deposit: 5000 }
];

export const appointments = [
  { id: 'apt-001', client: 'Cliente demo', service: 'Piercing nariz', status: 'confirmed', time: '2:30 PM' },
  { id: 'apt-002', client: 'Cliente demo 2', service: 'Tatuaje pequeno', status: 'pending_deposit', time: '4:00 PM' }
];
