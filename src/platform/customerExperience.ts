import { CalendarDays, Dumbbell, Home, Receipt, Sparkles, UserRound } from 'lucide-react';

export type CustomerVertical = 'appointments' | 'membership' | 'hybrid';
export type CustomerWidgetKey =
  | 'membership_status'
  | 'upcoming_appointment'
  | 'payment_task'
  | 'access_pass'
  | 'upcoming_classes'
  | 'appointment_history'
  | 'membership_history'
  | 'rewards_balance'
  | 'aftercare'
  | 'promotions';

export type CustomerNavItem = {
  id: string;
  label: string;
  icon: JSX.Element;
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
        { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
        { id: 'clases', label: 'Clases', icon: <Dumbbell size={20} /> },
        { id: 'pagos', label: 'Pagos', icon: <Receipt size={20} /> },
        { id: 'perfil', label: 'Perfil', icon: <UserRound size={20} /> },
      ],
      sections: {
        inicio: ['membership_status', 'payment_task', 'access_pass', 'upcoming_classes', 'rewards_balance'],
        clases: ['upcoming_classes', 'membership_history'],
        pagos: ['payment_task', 'membership_history'],
        perfil: ['access_pass', 'rewards_balance', 'promotions'],
      },
    };
  }

  if (vertical === 'hybrid') {
    return {
      vertical,
      title: 'Mi cuenta',
      subtitle: 'Citas, plan, pagos y beneficios según este negocio.',
      primaryFocus: 'appointments',
      nav: [
        { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
        { id: 'reservas', label: 'Reservas', icon: <CalendarDays size={20} /> },
        { id: 'pagos', label: 'Pagos', icon: <Receipt size={20} /> },
        { id: 'promos', label: 'Promos', icon: <Sparkles size={20} /> },
      ],
      sections: {
        inicio: ['upcoming_appointment', 'membership_status', 'payment_task', 'rewards_balance'],
        reservas: ['upcoming_appointment', 'appointment_history', 'aftercare'],
        pagos: ['payment_task', 'membership_history'],
        promos: ['promotions', 'rewards_balance'],
      },
    };
  }

  return {
    vertical,
    title: 'Mis citas',
    subtitle: 'Próxima cita, depósito, profesional, preparación e historial.',
    primaryFocus: 'appointments',
    nav: [
      { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
      { id: 'reservar', label: 'Reservar', icon: <CalendarDays size={20} /> },
      { id: 'pagos', label: 'Pagos', icon: <Receipt size={20} /> },
      { id: 'perfil', label: 'Perfil', icon: <UserRound size={20} /> },
    ],
    sections: {
      inicio: ['upcoming_appointment', 'payment_task', 'aftercare', 'rewards_balance'],
      reservar: ['upcoming_appointment', 'appointment_history'],
      pagos: ['payment_task', 'appointment_history'],
      perfil: ['rewards_balance', 'promotions'],
    },
  };
}
