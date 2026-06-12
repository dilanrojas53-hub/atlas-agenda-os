import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { BarChart3, Building2, CalendarDays, Dumbbell, PlusCircle, ShieldCheck, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { SuperAdminLayout } from '../../layouts/AdminLayout';
import { useAtlasStore } from '../../state/AtlasStore';

function hasAccess() {
  return typeof window !== 'undefined' && window.localStorage.getItem('atlas-gate:super:global') === 'ok';
}

function Metric({ icon, label, value, detail }: { icon: JSX.Element; label: string; value: string; detail: string }) {
  return <article className="summary-kpi violet"><div className="summary-kpi-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

export function ModernSuperAdminPage() {
  const store = useAtlasStore();
  const [name, setName] = useState('');
  const [vertical, setVertical] = useState<'appointments' | 'membership'>('appointments');
  const [plan, setPlan] = useState<'starter' | 'operations' | 'growth'>('operations');
  const tenants = Object.values(store.tenants);
  const appointmentCount = store.appointments.length;
  const membershipCount = store.memberships.length;
  const clientCount = useMemo(() => new Set([...store.appointments.map(item => item.client), ...store.memberships.map(item => item.client)]).size, [store.appointments, store.memberships]);

  if (!hasAccess()) {
    return <main className="login-shell"><section className="login-card"><div className="login-logo"><Building2 size={24} /></div><span className="eyebrow">Digital Atlas</span><h1 className="login-title">Control interno</h1><p className="login-sub">Ingresá desde la puerta segura de administración global.</p><div className="empty-state"><ShieldCheck /><strong>Zona separada</strong><span>Los negocios y sus datos operativos permanecen aislados.</span></div><div className="hero-actions"><Link className="btn btn-primary" href="/atlas/login">Ir al acceso</Link><Link className="btn btn-secondary" href="/">Volver</Link></div></section></main>;
  }

  return (
    <SuperAdminLayout>
      <div className="summary-kpi-grid">
        <Metric icon={<Building2 />} label="Negocios" value={String(tenants.length)} detail={`${tenants.filter(item => item.vertical === 'membership').length} academias`} />
        <Metric icon={<CalendarDays />} label="Citas" value={String(appointmentCount)} detail="Reservas registradas" />
        <Metric icon={<Dumbbell />} label="Membresías" value={String(membershipCount)} detail="Solicitudes y alumnos" />
        <Metric icon={<Users />} label="Personas" value={String(clientCount)} detail={`Fuente: ${store.dataSource}`} />
      </div>
      <div className="dashboard-grid summary-dashboard-grid">
        <article className="card wide-card summary-panel">
          <div className="summary-panel-head"><div><span className="eyebrow">Directorio</span><h3>Negocios de la plataforma</h3></div><span className="badge badge-violet">{tenants.length} activos</span></div>
          <div className="summary-list">{tenants.map(tenant => <div className="summary-list-row" key={tenant.slug}><div className="summary-avatar">{tenant.name.charAt(0)}</div><div><strong>{tenant.name}</strong><span>{tenant.vertical === 'membership' ? 'Academia y membresías' : 'Servicios por cita'} · {tenant.plan}</span></div><span className="badge badge-green">Activo</span><Link className="admin-track-link" href={`/admin/${tenant.slug}/login`}>Abrir panel</Link></div>)}</div>
        </article>
        <article className="card summary-panel">
          <PlusCircle /><h3>Crear negocio</h3>
          <div className="stack-form">
            <input className="input" placeholder="Nombre" value={name} onChange={event => setName(event.target.value)} />
            <select className="input" value={vertical} onChange={event => setVertical(event.target.value as 'appointments' | 'membership')}><option value="appointments">Negocio de citas</option><option value="membership">Academia o gimnasio</option></select>
            <select className="input" value={plan} onChange={event => setPlan(event.target.value as 'starter' | 'operations' | 'growth')}><option value="starter">Starter</option><option value="operations">Operations</option><option value="growth">Growth</option></select>
            <button className="btn btn-primary btn-full" onClick={() => { if (!name.trim()) return toast.error('Escribí un nombre'); const slug = store.addTenant({ name: name.trim(), vertical, plan, description: 'Negocio creado desde Digital Atlas.' }); setName(''); toast.success(`Negocio creado: ${slug}`); }}>Crear negocio</button>
          </div>
          <div className="summary-mini-list"><p><strong>{store.products.length}</strong><span>productos</span></p><p><strong>{store.events.length}</strong><span>eventos</span></p><p><strong><BarChart3 size={18} /></strong><span>métricas activas</span></p><p><strong><Wallet size={18} /></strong><span>pagos conectados</span></p></div>
        </article>
      </div>
    </SuperAdminLayout>
  );
}
