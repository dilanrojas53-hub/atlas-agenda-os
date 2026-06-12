import { useState } from 'react';
import { BellRing, CalendarCheck2, Clock3, Dumbbell, Image, Package, Settings, Sparkles, Ticket, TrendingUp, UserCheck, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';
import { AdminDataTable, StatusBadge } from './admin/AdminDataTable';
import { BusinessMediaPreview } from './admin/BusinessMediaPreview';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
type TenantLike = { slug: string; vertical: string; name: string };
function Header({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="workspace-header"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>; }
function Empty({ title, text }: { title: string; text: string }) { return <div className="empty-state"><strong>{title}</strong><span>{text}</span></div>; }
function tone(status?: string) { if (status === 'confirmed' || status === 'paid' || status === 'completed') return 'success' as const; if (status === 'cancelled' || status === 'rejected' || status === 'late') return 'danger' as const; return 'warning' as const; }
function trackHref(item: { id: string; trackingId?: string }) { return `/status/${item.trackingId || item.id}`; }
function TrackLink({ item }: { item: { id: string; trackingId?: string } }) { return <a className="admin-track-link" href={trackHref(item)}>Seguimiento</a>; }
function SummaryCard({ icon, label, value, detail, toneName = 'violet' }: { icon: JSX.Element; label: string; value: string; detail: string; toneName?: 'violet' | 'blue' | 'green' | 'orange' }) { return <article className={`summary-kpi ${toneName}`}><div className="summary-kpi-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }

export function AdminWorkspace({ tenant, activeTab }: { tenant: TenantLike; activeTab?: string }) {
  const isMembership = tenant.vertical === 'membership';
  return <section className="tenant-workspace">{isMembership ? <MembershipAdmin activeTab={activeTab || 'Dashboard'} tenantSlug={tenant.slug} /> : <AppointmentsAdmin activeTab={activeTab || 'Dashboard'} tenantSlug={tenant.slug} />}</section>;
}

function AppointmentsAdmin({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const store = useAtlasStore();
  const tenant = store.getTenant(tenantSlug);
  const appointments = store.appointments.filter(item => item.tenantSlug === tenantSlug);
  const services = store.services.filter(item => item.tenantSlug === tenantSlug);
  const [service, setService] = useState({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 });

  if (activeTab === 'Dashboard') {
    const active = appointments.filter(item => !['cancelled', 'completed'].includes(item.status));
    const pending = appointments.filter(item => item.status === 'pending_deposit').length;
    const confirmed = appointments.filter(item => item.status === 'confirmed').length;
    const clients = new Set(appointments.map(item => item.client)).size;
    const revenue = appointments.filter(item => item.status !== 'cancelled').reduce((sum, item) => sum + (services.find(serviceItem => serviceItem.name === item.service)?.price || 0), 0);
    const upcoming = active.slice(0, 4);
    return <>
      <Header eyebrow="Resumen ejecutivo" title="Operación de hoy" text="Ingresos, citas, clientes y acciones pendientes en una sola vista." />
      <div className="summary-kpi-grid">
        <SummaryCard icon={<TrendingUp />} label="Ingresos estimados" value={money(revenue)} detail="Según citas no canceladas" toneName="violet" />
        <SummaryCard icon={<CalendarCheck2 />} label="Citas confirmadas" value={String(confirmed)} detail={`${appointments.length} solicitudes totales`} toneName="blue" />
        <SummaryCard icon={<Clock3 />} label="Depósitos pendientes" value={String(pending)} detail="Requieren seguimiento" toneName="orange" />
        <SummaryCard icon={<Users />} label="Clientes" value={String(clients)} detail="Personas registradas" toneName="green" />
      </div>
      <div className="dashboard-grid summary-dashboard-grid">
        <article className="card wide-card summary-panel"><div className="summary-panel-head"><div><span className="eyebrow">Agenda</span><h3>Próximas citas</h3></div><a className="btn btn-secondary btn-sm" href="#agenda">Ver agenda</a></div><div className="summary-list">{upcoming.length ? upcoming.map(item => <div className="summary-list-row" key={item.id}><div className="summary-time"><strong>{item.time}</strong><small>{item.date || 'Hoy'}</small></div><div><strong>{item.client}</strong><span>{item.service}</span></div><StatusBadge tone={tone(item.status)}>{item.status}</StatusBadge><TrackLink item={item} /></div>) : <Empty title="Sin citas próximas" text="Las nuevas reservas aparecerán aquí." />}</div></article>
        <article className="card summary-panel"><BellRing /><h3>Atención requerida</h3><div className="summary-mini-list"><p><strong>{pending}</strong><span>depósitos pendientes</span></p><p><strong>{appointments.filter(item => item.status === 'cancelled').length}</strong><span>cancelaciones</span></p><p><strong>{services.length}</strong><span>servicios activos</span></p></div></article>
      </div>
    </>;
  }
  if (activeTab === 'Agenda' || activeTab === 'Citas') {
    const rows = appointments.map(a => [<strong>{a.client}</strong>, a.service, a.time, <StatusBadge tone={tone(a.status)}>{a.status}</StatusBadge>, <div className="row-actions"><TrackLink item={a} /><button onClick={() => store.updateAppointmentStatus(a.id, 'confirmed')}>Confirmar</button><button onClick={() => store.updateAppointmentStatus(a.id, 'cancelled')}>Cancelar</button></div>]);
    return <><Header eyebrow="Operación diaria" title="Agenda del negocio" text="Solicitudes, citas, depósitos y seguimiento viven en este panel privado." /><div className="dashboard-grid"><AdminDataTable title="Citas y solicitudes" subtitle="Reservas de este negocio" columns={['Cliente', 'Servicio', 'Hora', 'Estado', 'Acciones']} rows={rows} emptyTitle="Sin citas" emptyText="Las reservas nuevas aparecerán aquí." /><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorio 24h antes.</p><p>Solicitud de depósito.</p><p>Mensaje post-servicio.</p></article></div></>;
  }
  if (activeTab === 'Servicios') {
    const rows = services.map(s => [<strong>{s.name}</strong>, s.category, `${s.duration} min`, money(s.price), money(s.deposit)]);
    return <><Header eyebrow="Catálogo" title="Servicios y precios" text="Lo que el cliente puede reservar desde la página pública." /><div className="dashboard-grid"><AdminDataTable title="Servicios activos" subtitle="Catálogo público" columns={['Servicio', 'Categoría', 'Duración', 'Precio', 'Depósito']} rows={rows} emptyTitle="Sin servicios" emptyText="Agregá el primer servicio." /><article className="card"><Settings /><h3>Agregar servicio</h3><div className="stack-form"><input className="input" placeholder="Nombre" value={service.name} onChange={e => setService({ ...service, name: e.target.value })} /><input className="input" placeholder="Categoría" value={service.category} onChange={e => setService({ ...service, category: e.target.value })} /><input className="input" type="number" placeholder="Precio" value={service.price || ''} onChange={e => setService({ ...service, price: Number(e.target.value) })} /><button className="btn btn-primary btn-full" onClick={() => { if (!service.name || !service.price) return toast.error('Falta nombre o precio'); store.addService({ tenantSlug, ...service }); setService({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 }); toast.success('Servicio agregado'); }}>Guardar</button></div></article></div></>;
  }
  if (activeTab === 'Profesionales') return <><Header eyebrow="Equipo" title="Profesionales" text="Especialistas, disponibilidad y servicios asignados." /><div className="feature-grid">{['Ana', 'Marco', 'Sofia'].map(name => <article className="card" key={name}><UserCheck /><h3>{name}</h3><p>Agenda activa.</p><p>Servicios asignados.</p></article>)}</div></>;
  if (activeTab === 'Clientes') { const clients = Array.from(new Set(appointments.map(a => a.client))); return <><Header eyebrow="Clientes" title="Relación con clientes" text="Historial y seguimiento." /><AdminDataTable title="Clientes" subtitle="Personas asociadas al negocio" columns={['Cliente', 'Actividad', 'Estado', 'Seguimiento']} rows={clients.map(name => { const last = appointments.find(a => a.client === name); return [<strong>{name}</strong>, `${appointments.filter(a => a.client === name).length} citas`, <StatusBadge tone="success">Activo</StatusBadge>, last ? <TrackLink item={last} /> : null]; })} emptyTitle="Sin clientes" emptyText="Cuando alguien reserve, aparecerá aquí." /></>; }
  if (activeTab === 'Promos') return <Growth />;
  if (activeTab === 'Landing') return <><Header eyebrow="Página pública" title="Landing del negocio" text="El admin controla el contenido visual que alimenta la página pública y el portal cliente." /><div className="dashboard-grid"><article className="card"><Image /><h3>Vista pública</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p><p>WhatsApp: {tenant.whatsapp}</p><a className="btn btn-secondary btn-sm" href={`/${tenant.slug}`}>Abrir página pública</a></article><BusinessMediaPreview tenantSlug={tenantSlug} /></div></>;
  if (activeTab === 'Ajustes') return <SettingsPanel tenantSlug={tenantSlug} />;
  return <Empty title="Sección pendiente" text="Esta vista se está preparando." />;
}

function MembershipAdmin({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const store = useAtlasStore();
  const tenant = store.getTenant(tenantSlug);
  const memberships = store.memberships.filter(item => item.tenantSlug === tenantSlug);
  const requests = memberships.filter(item => item.status === 'requested');
  const products = store.products.filter(item => item.tenantSlug === tenantSlug);
  const events = store.events.filter(item => item.tenantSlug === tenantSlug);
  const [product, setProduct] = useState({ name: '', price: 0 });
  const [event, setEvent] = useState('');

  if (activeTab === 'Dashboard') {
    const active = memberships.filter(item => item.status === 'paid');
    const receipts = memberships.filter(item => item.status === 'receipt_uploaded');
    const revenue = active.reduce((sum, item) => sum + item.amount, 0);
    return <>
      <Header eyebrow="Resumen ejecutivo" title="Estado de la academia" text="Alumnos, solicitudes, pagos y próximas acciones en una sola vista." />
      <div className="summary-kpi-grid">
        <SummaryCard icon={<Dumbbell />} label="Membresías activas" value={String(active.length)} detail={`${memberships.length} registros totales`} toneName="violet" />
        <SummaryCard icon={<UserCheck />} label="Solicitudes" value={String(requests.length)} detail="Pendientes de aprobación" toneName="blue" />
        <SummaryCard icon={<Wallet />} label="Comprobantes" value={String(receipts.length)} detail="En revisión" toneName="orange" />
        <SummaryCard icon={<TrendingUp />} label="Ingresos activos" value={money(revenue)} detail="Mensualidades aprobadas" toneName="green" />
      </div>
      <div className="dashboard-grid summary-dashboard-grid">
        <article className="card wide-card summary-panel"><div className="summary-panel-head"><div><span className="eyebrow">Alumnos</span><h3>Actividad reciente</h3></div></div><div className="summary-list">{memberships.slice(0, 5).map(item => <div className="summary-list-row" key={item.id}><div className="summary-avatar">{item.client.charAt(0)}</div><div><strong>{item.client}</strong><span>{item.plan}</span></div><StatusBadge tone={tone(item.status)}>{item.status}</StatusBadge><TrackLink item={item} /></div>)}</div></article>
        <article className="card summary-panel"><Ticket /><h3>Operación</h3><div className="summary-mini-list"><p><strong>{events.length}</strong><span>eventos</span></p><p><strong>{products.length}</strong><span>productos</span></p><p><strong>{receipts.length}</strong><span>pagos por revisar</span></p></div></article>
      </div>
    </>;
  }
  if (activeTab === 'Solicitudes') return <><Header eyebrow="Nuevos alumnos" title="Solicitudes de registro" text="Personas interesadas antes de convertirse en alumnos." /><AdminDataTable title="Solicitudes" subtitle="Registros enviados desde la página pública" columns={['Alumno', 'Plan', 'Teléfono', 'Estado', 'Acciones']} rows={requests.map(m => [<strong>{m.client}</strong>, m.plan, m.phone || 'Sin teléfono', <StatusBadge tone="warning">Pendiente</StatusBadge>, <div className="row-actions"><TrackLink item={m} /><button onClick={() => store.approveReceipt(m.id)}>Aprobar</button><button onClick={() => store.rejectReceipt(m.id)}>Rechazar</button></div>])} emptyTitle="Sin solicitudes" emptyText="Cuando alguien solicite registro, aparecerá aquí." /></>;
  if (activeTab === 'Membresías') return <><Header eyebrow="Academia" title="Membresías y alumnos" text="Alumnos activos, renovaciones y estado de pago." /><AdminDataTable title="Membresías" subtitle="Alumnos y planes" columns={['Alumno', 'Plan', 'Renovación', 'Monto', 'Estado', 'Seguimiento']} rows={memberships.filter(m => m.status !== 'requested').map(m => [<strong>{m.client}</strong>, m.plan, m.due, money(m.amount), <StatusBadge tone={tone(m.status)}>{m.status}</StatusBadge>, <TrackLink item={m} />])} emptyTitle="Sin alumnos" emptyText="Aprobá solicitudes para crear miembros." /></>;
  if (activeTab === 'Comprobantes') return <><Header eyebrow="Pagos" title="Comprobantes SINPE" text="Revisión de mensualidades y pagos recibidos." /><AdminDataTable title="Revisión de pagos" subtitle="Comprobantes enviados por alumnos" columns={['Alumno', 'Plan', 'Periodo', 'Estado', 'Acciones']} rows={memberships.filter(m => m.status !== 'requested').map(m => [<strong>{m.client}</strong>, m.plan, m.due, <StatusBadge tone={tone(m.status)}>{m.status}</StatusBadge>, <div className="row-actions"><TrackLink item={m} /><button onClick={() => store.approveReceipt(m.id)}>Aprobar</button><button onClick={() => store.rejectReceipt(m.id)}>Rechazar</button></div>])} emptyTitle="Sin comprobantes" emptyText="Los pagos enviados aparecerán aquí." /></>;
  if (activeTab === 'Productos') return <><Header eyebrow="Venta adicional" title="Productos" text="Equipo, merch o productos del negocio." /><div className="dashboard-grid"><AdminDataTable title="Productos" subtitle="Visibles en la academia" columns={['Producto', 'Categoría', 'Precio']} rows={products.map(p => [<strong>{p.name}</strong>, p.category || 'General', money(p.price)])} emptyTitle="Sin productos" emptyText="Agregá productos." /><article className="card"><Package /><h3>Agregar producto</h3><div className="stack-form"><input className="input" placeholder="Producto" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} /><input className="input" type="number" placeholder="Precio" value={product.price || ''} onChange={e => setProduct({ ...product, price: Number(e.target.value) })} /><button className="btn btn-primary btn-full" onClick={() => { if (!product.name || !product.price) return; store.addProduct(tenantSlug, product.name, product.price); setProduct({ name: '', price: 0 }); }}>Guardar</button></div></article></div></>;
  if (activeTab === 'Eventos') return <><Header eyebrow="Comunidad" title="Eventos y clases especiales" text="Seminarios, clases abiertas y actividades." /><div className="dashboard-grid"><AdminDataTable title="Eventos" subtitle="Eventos públicos" columns={['Evento', 'Fecha', 'Precio']} rows={events.map(e => [<strong>{e.title}</strong>, e.date, money(e.price)])} emptyTitle="Sin eventos" emptyText="Creá un evento." /><article className="card"><Ticket /><h3>Crear evento</h3><div className="stack-form"><input className="input" placeholder="Título" value={event} onChange={e => setEvent(e.target.value)} /><button className="btn btn-primary btn-full" onClick={() => { if (!event) return; store.addEvent(tenantSlug, event, 'Próxima semana', 10000); setEvent(''); }}>Guardar</button></div></article></div></>;
  if (activeTab === 'Clientes') return <><Header eyebrow="Alumnos" title="Alumnos activos" text="Lista de miembros, plan y renovación." /><AdminDataTable title="Alumnos" subtitle="Personas asociadas a la academia" columns={['Alumno', 'Plan', 'Estado', 'Monto', 'Seguimiento']} rows={memberships.filter(m => m.status !== 'requested').map(m => [<strong>{m.client}</strong>, m.plan, m.due, money(m.amount), <TrackLink item={m} />])} emptyTitle="Sin alumnos" emptyText="Cuando haya registros aprobados, aparecerán aquí." /></>;
  if (activeTab === 'Promos') return <Growth />;
  if (activeTab === 'Landing') return <><Header eyebrow="Página pública" title="Landing de academia" text="El admin controla el contenido visual que alimenta la página pública y el portal de alumno." /><div className="dashboard-grid"><article className="card"><Dumbbell /><h3>Vista pública</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p><p>WhatsApp: {tenant.whatsapp}</p><a className="btn btn-secondary btn-sm" href={`/${tenant.slug}`}>Abrir página pública</a></article><BusinessMediaPreview tenantSlug={tenantSlug} /></div></>;
  if (activeTab === 'Ajustes') return <SettingsPanel tenantSlug={tenantSlug} />;
  return <Empty title="Sección pendiente" text="Esta vista se está preparando." />;
}

function Growth() { return <><Header eyebrow="Crecimiento" title="Promociones" text="Campañas, referidos, beneficios y recordatorios automáticos." /><div className="dashboard-grid"><article className="card"><Sparkles /><h3>Campañas</h3><p>Bienvenida</p><p>Reactivación</p><p>Referidos</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorios</p><p>Mensajes post-servicio</p><p>Beneficios</p></article></div></>; }
function SettingsPanel({ tenantSlug }: { tenantSlug: string }) {
  const store = useAtlasStore();
  const tenant = store.getTenant(tenantSlug);
  const [settings, setSettings] = useState({ name: tenant.name, whatsapp: tenant.whatsapp, address: tenant.address, sinpeNumber: tenant.sinpeNumber || '', sinpeOwner: tenant.sinpeOwner || tenant.name, heroTitle: tenant.heroTitle || tenant.name, ctaLabel: tenant.ctaLabel || 'Entrar a mi cuenta' });
  return <><Header eyebrow="Configuración" title="Datos del negocio" text="Información pública, contacto y pagos SINPE." /><div className="dashboard-grid"><article className="card wide-card"><Settings /><h3>Información general</h3><div className="stack-form"><input className="input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} placeholder="Nombre" /><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp" /><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" /><input className="input" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="Título público" /><input className="input" value={settings.ctaLabel} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="Botón principal" /><button className="btn btn-primary btn-full" onClick={() => { store.updateTenant(tenantSlug, settings); toast.success('Configuración guardada'); }}>Guardar configuración</button></div></article><article className="card"><Wallet /><h3>Pagos SINPE</h3><div className="stack-form"><input className="input" value={settings.sinpeNumber} onChange={e => setSettings({ ...settings, sinpeNumber: e.target.value })} placeholder="Número SINPE" /><input className="input" value={settings.sinpeOwner} onChange={e => setSettings({ ...settings, sinpeOwner: e.target.value })} placeholder="Titular" /><button className="btn btn-secondary btn-full" onClick={() => { store.updateTenant(tenantSlug, settings); toast.success('Datos SINPE guardados'); }}>Guardar SINPE</button></div></article></div></>;
}
