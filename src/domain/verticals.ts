export type AtlasVertical = 'appointments' | 'membership' | 'clinic' | 'academy';

export const verticalConfig = {
  appointments: {
    label: 'Citas y servicios',
    publicAction: 'Reservar',
    adminTabs: ['Agenda', 'Citas', 'Servicios', 'Profesionales', 'Clientes', 'Promos', 'Landing', 'Ajustes'],
  },
  membership: {
    label: 'Membresias y pagos',
    publicAction: 'Entrar a mi cuenta',
    adminTabs: ['Membresias', 'Comprobantes', 'Clientes', 'Productos', 'Eventos', 'Promos', 'Landing', 'Ajustes'],
  },
  clinic: {
    label: 'Clinica y pacientes',
    publicAction: 'Agendar consulta',
    adminTabs: ['Agenda', 'Pacientes', 'Servicios', 'Profesionales', 'Documentos', 'Pagos', 'Landing', 'Ajustes'],
  },
  academy: {
    label: 'Academia y tracking',
    publicAction: 'Ver programas',
    adminTabs: ['Alumnos', 'Membresias', 'Asistencia', 'Progreso', 'Eventos', 'Pagos', 'Landing', 'Ajustes'],
  },
} as const;
