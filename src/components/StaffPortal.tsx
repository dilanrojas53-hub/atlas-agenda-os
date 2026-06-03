import { CalendarDays, Clock, Dumbbell, Sparkles, Users, Wallet } from 'lucide-react';
import { useAtlasStore } from '../state/AtlasStore';

function CardList({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return <article className="card">{icon}<h3>{title}</h3>{items.map(item => <p key={item}>{item}</p>)}</article>;
}

export function StaffPortal({ tenantSlug }: { tenantSlug: string }) {
  const { getTenant, appointments, memberships } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const isMembership = tenant.vertical === 'membership';
  const tenantAppointments = appointments.filter(item => item.tenantSlug === tenant.slug);
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenant.slug);

  return (
    <>
      <section className="admin-hero">
        <span className="eyebrow">Staff portal</span>
        <h1>{tenant.name}</h1>
        <p>Vista reducida para el equipo interno. Sin configuración, sin superadmin y sin datos de otros tenants.</p>
      </section>
      <div className="grid three">
        {isMembership ? (
          <>
            <CardList icon={<Dumbbell />} title="Clases de hoy" items={['MMA · 6:00 PM', 'BJJ · 7:30 PM']} />
            <CardList icon={<Users />} title="Alumnos" items={tenantMemberships.map(item => `${item.client} · ${item.plan}`)} />
            <CardList icon={<Wallet />} title="Pagos por revisar" items={tenantMemberships.filter(item => item.status !== 'paid').map(item => `${item.client} · ${item.due}`)} />
          </>
        ) : (
          <>
            <CardList icon={<CalendarDays />} title="Citas de hoy" items={tenantAppointments.map(item => `${item.time} · ${item.service}`)} />
            <CardList icon={<Clock />} title="Preparación" items={['Confirmar espacio', 'Ver notas del cliente', 'Preparar materiales']} />
            <CardList icon={<Sparkles />} title="Post-servicio" items={['Enviar cuidados', 'Ofrecer rebooking', 'Aplicar puntos']} />
          </>
        )}
      </div>
    </>
  );
}
