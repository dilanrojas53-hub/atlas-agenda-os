export type CustomerVertical = 'appointments' | 'membership' | 'hybrid';
export type CustomerIconKey = 'home' | 'calendar' | 'dumbbell' | 'receipt' | 'sparkles' | 'user';
export type CustomerWidgetKey = 'membership_status' | 'upcoming_appointment' | 'payment_task' | 'access_pass' | 'upcoming_classes' | 'appointment_history' | 'membership_history' | 'rewards_balance' | 'aftercare' | 'promotions';

export type CustomerNavItem = {
  id: string;
  label: string;
  iconKey: CustomerIconKey;
};

export type CustomerDashboardSpec = {
  vertical: CustomerVertical;
  title: string;
  subtitle: string;
  primaryFocus: 'appointments' | 'memberships';
  nav: CustomerNavItem[];
  sections: Record<string, CustomerWidgetKey[]>;
};

export function resolveCustomerVertical(rawVertical?: string): CustomerVertical {
  if (rawVertical === 'membership' || rawVertical === 'academy') return 'membership';
  if (rawVertical === 'hybrid') return 'hybrid';
  return 'appointments';
}

export function resolveCustomerDashboard(rawVertical?: string): CustomerDashboardSpec {
  const vertical = resolveCustomerVertical(rawVertical);

  if (vertical === 'membership') {
    return {
      vertical,
      title: 'Mi membresía',
      subtitle: 'Plan, pagos, clases, acceso y actividad dentro del negocio.',
      primaryFocus: 'memberships',
      nav: [
        { id: 'inicio', label: 'Inicio', iconKey: 'home' },
        { id: 'clases', label: 'Clases', iconKey: 'dumbbell' },
        { id: 'pagos', label: 'Pagos', iconKey: 'receipt' },
        { id: 'perfil', label: 'Perfil', iconKey: 'user' },
      ],
      sections: {
        inicio: ['membership_status', 'payment_task', 'access_pass', 'upcoming_classes', 'rewards_balance'],
        clases: ['upcoming_classes', 'membership_history'],
        pagos: ['payment_task', 'membership_history'],
        perfil: ['access_pass', 'rewards_balance', 'promotions'],
      },
    };
  }

  return {
    vertical,
    title: 'Mis citas',
    subtitle: 'Próxima cita, depósito, profesional, preparación e historial.',
    primaryFocus: 'appointments',
    nav: [
      { id: 'inicio', label: 'Inicio', iconKey: 'home' },
      { id: 'reservar', label: 'Reservar', iconKey: 'calendar' },
      { id: 'pagos', label: 'Pagos', iconKey: 'receipt' },
      { id: 'perfil', label: 'Perfil', iconKey: 'user' },
    ],
    sections: {
      inicio: ['upcoming_appointment', 'payment_task', 'aftercare', 'rewards_balance'],
      reservar: ['upcoming_appointment', 'appointment_history'],
      pagos: ['payment_task', 'appointment_history'],
      perfil: ['rewards_balance', 'promotions'],
    },
  };
}
