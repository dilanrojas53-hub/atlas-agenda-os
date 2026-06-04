import { CalendarDays, CheckCircle2, Dumbbell, Home, KeyRound, Receipt, Sparkles, UserRound, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { resolveCustomerDashboard, type CustomerWidgetKey } from '../platform/customerExperience';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

type TenantLike = { slug: string; vertical: string; name: string };

type CustomerDashboardRendererProps = {
  tenant: TenantLike;
  activeSection: string;
  onSectionChange: (section: string) => void;
};

function iconFor(key: string) {
  const icons = {
    home: <Home size={20} />,
    calendar: <CalendarDays size={20} />,
    dumbbell: <Dumbbell size={20} />,
    receipt: <Receipt size={20} />,
    sparkles: <Sparkles size={20} />,
    user: <UserRound size={20} />,
  } as Record<string, JSX.Element>;
  return icons[key] || <Home size={20} />;
}

export function CustomerDashboardRenderer({ tenant, activeSection, onSectionChange }: CustomerDashboardRendererProps) {
  const spec = resolveCustomerDashboard(tenant.vertical);
  const widgets = spec.sections[activeSection] || spec.sections.inicio || [];
  const isMembership = spec.vertical === 'membership';

  return (
    <div className="client-shell">
      <header className="client-topbar">
        <span className="client-brand">Mi cuenta en {tenant.name}</span>
        <div className="client-user"><span className="badge badge-green"><span className="dot dot-green" /> {isMembership ? 'Alumno' : 'Cliente'}</span><div className="avatar">ML</div></div>
      </header>
      <main className="client-main">
        <section className="client-hero">
          <div>
            <span className="eyebrow">{isMembership ? 'Portal de alumno' : 'Portal de cliente'}</span>
            <h1>{spec.title}</h1>
            <p>{spec.subtitle}</p>
          </div>
          <div className="client-score"><span>240</span><small>{isMembership ? 'puntos' : 'beneficios'}</small></div>
        </section>
        <section className="dashboard-grid">
          {widgets.map((widget) => <CustomerWidget key={widget} widget={widget} tenant={tenant} />)}
        </section>
      </main>
      <nav className="client-bottom-nav">
        {spec.nav.map((item) => (
          <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => onSectionChange(item.id)}>
            {iconFor(item.iconKey)}<span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function CustomerWidget({ widget, tenant }: { widget: CustomerWidgetKey; tenant: TenantLike }) {
  const { memberships, appointments, uploadReceipt } = useAtlasStore();
  const isMembership = tenant.vertical === 'membership';
  const tenantMemberships = memberships.filter((item) => item.tenantSlug === tenant.slug);
  const tenantAppointments = appointments.filter((item) => item.tenantSlug === tenant.slug);
  const pendingMembership = tenantMemberships.find((item) => item.status !== 'paid');
  const nextAppointment = tenantAppointments[0];

  if (widget === 'membership_status') {
    const current = tenantMemberships[0];
    return <article className="card"><Dumbbell /><h3>Mi membresía</h3><p>{current ? current.plan : 'Sin plan activo'}</p><strong>{current ? current.due : 'Consulta planes disponibles'}</strong></article>;
  }

  if (widget === 'upcoming_appointment') {
    return <article className="card"><CalendarDays /><h3>Mi próxima cita</h3><p>{nextAppointment ? `${nextAppointment.service} · ${nextAppointment.time}` : 'No tienes citas activas'}</p><strong>{nextAppointment ? nextAppointment.status : 'Reservar nuevo servicio'}</strong></article>;
  }

  if (widget === 'payment_task' && isMembership) {
    return <article className="card"><Wallet /><h3>Pago de mensualidad</h3><p>{pendingMembership ? `${pendingMembership.plan} · ${pendingMembership.due}` : 'No hay pagos pendientes'}</p><button className="btn btn-primary btn-full" disabled={!pendingMembership} onClick={() => { if (!pendingMembership) return; uploadReceipt(pendingMembership.id, 'sinpe-demo.jpg'); toast.success('Comprobante subido a revisión'); }}>Subir comprobante SINPE</button></article>;
  }

  if (widget === 'payment_task') {
    return <article className="card"><Wallet /><h3>Depósito de reserva</h3><p>{nextAppointment ? 'Depósito pendiente de confirmación por el negocio.' : 'No hay depósitos pendientes.'}</p><span className="badge badge-amber">SINPE disponible</span></article>;
  }

  if (widget === 'access_pass') {
    return <article className="card"><KeyRound /><h3>Acceso</h3><p>Estado de entrada y beneficios activos.</p><span className="badge badge-green">Acceso permitido</span></article>;
  }

  if (widget === 'upcoming_classes') {
    return <article className="card"><Dumbbell /><h3>Próximas clases</h3><p>MMA · 6:00 PM</p><p>BJJ · 7:30 PM</p><p>Boxeo · 8:00 AM</p></article>;
  }

  if (widget === 'appointment_history') {
    return <article className="card"><CheckCircle2 /><h3>Historial de servicios</h3><p>{tenantAppointments.length ? `${tenantAppointments.length} citas registradas` : 'Sin historial todavía'}</p></article>;
  }

  if (widget === 'membership_history') {
    const total = tenantMemberships.reduce((sum, item) => sum + item.amount, 0);
    return <article className="card"><Receipt /><h3>Historial de pagos</h3><p>{tenantMemberships.length} registros</p><strong>{money(total)}</strong></article>;
  }

  if (widget === 'aftercare') {
    return <article className="card"><Sparkles /><h3>{isMembership ? 'Recomendaciones' : 'Preparación y cuidados'}</h3><p>{isMembership ? 'Revisá indicaciones de clase, equipo recomendado y próximos objetivos.' : 'Indicaciones antes y después del servicio.'}</p></article>;
  }

  if (widget === 'promotions') {
    return <article className="card"><Sparkles /><h3>Beneficios</h3><p>Promociones activas para este negocio.</p><span className="badge badge-amber">Beneficio de bienvenida</span></article>;
  }

  return <article className="card"><Sparkles /><h3>{isMembership ? 'Puntos' : 'Beneficios'}</h3><p>Saldo disponible para beneficios.</p><strong>240</strong></article>;
}
