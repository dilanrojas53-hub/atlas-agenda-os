import { useState } from 'react';
import { BellRing, CalendarDays, Image, Scissors, Settings, UserCheck, Users, Wallet, Receipt, Ticket, Package, Dumbbell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';
import { AdminDataTable, StatusBadge } from './admin/AdminDataTable';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const professionals = ['Ana · Especialista', 'Marco · Profesional', 'Sofia · Consultora'];

type TenantLike = { slug: string; vertical: string; name: string };

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div className="workspace-header"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty-state"><strong>{title}</strong><span>{text}</span></div>;
}

function toneForStatus(status?: string) {
  if (status === 'confirmed' || status === 'paid') return 'success' as const;
  if (status === 'cancelled' || status === 'rejected' || status === 'late') return 'danger' as const;
  return 'warning' as const;
}

export function AdminWorkspace({ tenant, activeTab }: { tenant: TenantLike; activeTab?: string }) {
  const isMembership = tenant.vertical === 'membership';
  const currentTab = activeTab || (isMembership ? 'Dashboard' : 'Agenda');
  return <section className="tenant-workspace">{isMembership ? <MembershipAdminTab activeTab={currentTab} tenantSlug={tenant.slug} /> : <AppointmentAdminTab activeTab={currentTab} tenantSlug={tenant.slug} />}</section>;
}

function AppointmentAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const { appointments, services, addService, updateAppointmentStatus, getTenant, updateTenant } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const tenantAppointments = appointments.filter(item => item.tenantSlug === tenantSlug);
  const tenantServices = services.filter(item => item.tenantSlug === tenantSlug);
  const [newService, setNewService] = useState({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 });
  const [settings, setSettings] = useState({ name: tenant.name, whatsapp: tenant.whatsapp, address: tenant.address, sinpeNumber: tenant.sinpeNumber || '', sinpeOwner: tenant.sinpeOwner || tenant.name, heroTitle: tenant.heroTitle || tenant.name, ctaLabel: tenant.ctaLabel || 'Reservar ahora' });

  if (activeTab === 'Agenda' || activeTab === 'Citas') {
    const rows = tenantAppointments.map(a => [
      <strong>{a.client}</strong>,
      a.service,
      a.time,
      <StatusBadge tone={toneForStatus(a.status)}>{a.status}</StatusBadge>,
      <div className="row-actions"><button onClick={() => { updateAppointmentStatus(a.id, 'confirmed'); toast.success('Cita confirmada'); }}>Confirmar</button><button onClick={() => { updateAppointmentStatus(a.id, 'cancelled'); toast.message('Cita cancelada'); }}>Cancelar</button></div>,
    ]);
    return <><SectionHeader eyebrow="Operación diaria" title="Agenda del negocio" text="Revisá solicitudes, confirmá citas y mantené el día ordenado." /><div className="admin-toolbar"><input className="input" placeholder="Buscar cliente o servicio" /><button className="btn btn-secondary btn-sm">Filtrar fecha</button></div><div className="dashboard-grid"><AdminDataTable title="Citas y solicitudes" subtitle="Reservas visibles para este negocio" columns={['Cliente', 'Servicio', 'Hora', 'Estado', 'Acciones']} rows={rows} emptyTitle="Sin citas visibles" emptyText="Las reservas nuevas aparecerán aquí." /><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorio 24h antes.</p><p>Solicitud de depósito.</p><p>Mensaje post-servicio.</p></article></div></>;
  }

  if (activeTab === 'Servicios') {
    const rows = tenantServices.map(s => [<strong>{s.name}</strong>, s.category, `${s.duration} min`, money(s.price), money(s.deposit)]);
    return <><SectionHeader eyebrow="Catálogo" title="Servicios y precios" text="Configurá lo que el cliente puede reservar desde la página pública." /><div className="dashboard-grid"><AdminDataTable title="Servicios activos" subtitle="Catálogo público de reservas" columns={['Servicio', 'Categoría', 'Duración', 'Precio', 'Depósito']} rows={rows} emptyTitle="Sin servicios" emptyText="Agregá el primer servicio para activar reservas." /><article className="card"><Settings /><h3>Agregar servicio</h3><div className="stack-form"><input className="input" placeholder="Nombre" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} /><input className="input" placeholder="Categoría" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} /><input className="input" type="number" placeholder="Precio" value={newService.price || ''} onChange={e => setNewService({ ...newService, price: Number(e.target.value) })} /><button className="btn btn-primary btn-full" onClick={() => { if (!newService.name || !newService.price) return toast.error('Falta nombre o precio'); addService({ tenantSlug, ...newService }); setNewService({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 }); toast.success('Servicio agregado'); }}>Guardar servicio</button></div></article></div></>;
  }

  if (activeTab === 'Profesionales') return <><SectionHeader eyebrow="Equipo" title="Profesionales" text="Administrá especialistas, disponibilidad y servicios asignados." /><div className="feature-grid">{professionals.map(pro => <article className="card" key={pro}><UserCheck /><h3>{pro.split(' · ')[0]}</h3><p>{pro.split(' · ')[1]}</p><p>Agenda activa · Servicios asignados</p></article>)}</div></>;

  if (activeTab === 'Clientes') {
    const clients = Array.from(new Set(tenantAppointments.map(item => item.client)));
    const rows = clients.map(client => [<strong>{client}</strong>, `${tenantAppointments.filter(item => item.client === client).length} citas`, 'Cliente activo', <StatusBadge tone="success">Activo</StatusBadge>]);
    return <><SectionHeader eyebrow="Relación cliente" title="Clientes" text="Historial y seguimiento de personas que han reservado." /><AdminDataTable title="Base de clientes" subtitle="Clientes asociados a este negocio" columns={['Cliente', 'Actividad', 'Tipo', 'Estado']} rows={rows} emptyTitle="Sin clientes todavía" emptyText="Cuando alguien reserve, aparecerá en esta sección." /></>;
  }

  if (activeTab === 'Promos') return <><SectionHeader eyebrow="Crecimiento" title="Promociones y fidelización" text="Acciones para reactivar clientes y aumentar reservas." /><div className="dashboard-grid"><article className="card"><Sparkles /><h3>Campañas</h3><p>Bienvenida</p><p>Reactivación</p><p>Beneficios por recurrencia</p></article><article className="card"><BellRing /><h3>Mensajes automáticos</h3><p>Recordatorio de cita</p><p>Post-servicio</p><p>Beneficio por puntos</p></article></div></>;

  if (activeTab === 'Landing') return <><SectionHeader eyebrow="Página pública" title="Landing del negocio" text="Editá cómo se presenta el negocio hacia sus clientes." /><div className="dashboard-grid"><article className="card"><Image /><h3>Vista pública</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p><p>WhatsApp: {tenant.whatsapp}</p></article><article className="card"><Settings /><h3>Bloques disponibles</h3><p>Hero</p><p>Servicios</p><p>Ubicación</p><p>CTA de reserva</p></article></div></>;

  if (activeTab === 'Ajustes') return <><SectionHeader eyebrow="Configuración" title="Datos del negocio" text="Información base, contacto público y datos de pago." /><div className="dashboard-grid"><article className="card wide-card"><Settings /><h3>Información general</h3><div className="stack-form"><input className="input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} placeholder="Nombre" /><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp" /><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" /><input className="input" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="Título público" /><input className="input" value={settings.ctaLabel} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="Botón principal" /><button className="btn btn-primary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Configuración guardada'); }}>Guardar configuración</button></div></article><article className="card"><Wallet /><h3>Pagos SINPE</h3><div className="stack-form"><input className="input" value={settings.sinpeNumber} onChange={e => setSettings({ ...settings, sinpeNumber: e.target.value })} placeholder="Número SINPE" /><input className="input" value={settings.sinpeOwner} onChange={e => setSettings({ ...settings, sinpeOwner: e.target.value })} placeholder="Titular" /><button className="btn btn-secondary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Datos SINPE guardados'); }}>Guardar SINPE</button></div></article></div></>;

  return <EmptyState title="Sección pendiente" text="Esta vista se está preparando." />;
}

function MembershipAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const { memberships, products, events, approveReceipt, rejectReceipt, addProduct, addEvent, getTenant, updateTenant } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenantSlug);
  const tenantProducts = products.filter(item => item.tenantSlug === tenantSlug);
  const tenantEvents = events.filter(item => item.tenantSlug === tenantSlug);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [eventTitle, setEventTitle] = useState('');
  const [settings, setSettings] = useState({ name: tenant.name, whatsapp: tenant.whatsapp, address: tenant.address, sinpeNumber: tenant.sinpeNumber || '', sinpeOwner: tenant.sinpeOwner || tenant.name, heroTitle: tenant.heroTitle || tenant.name, ctaLabel: tenant.ctaLabel || 'Entrar a mi cuenta' });

  if (activeTab === 'Dashboard' || activeTab === 'Membresías') {
    const rows = tenantMemberships.map(m => [<strong>{m.client}</strong>, m.plan, m.due, money(m.amount), <StatusBadge tone={toneForStatus(m.status)}>{m.status}</StatusBadge>]);
    return <><SectionHeader eyebrow="Operación de academia" title="Membresías y alumnos" text="Controlá alumnos activos, renovaciones y estado de pago." /><AdminDataTable title="Membresías activas" subtitle="Alumnos y planes registrados" columns={['Alumno', 'Plan', 'Renovación', 'Monto', 'Estado']} rows={rows} emptyTitle="Sin membresías" emptyText="Los alumnos aparecerán cuando se registren." /></>;
  }

  if (activeTab === 'Comprobantes') {
    const rows = tenantMemberships.map(m => [<strong>{m.client}</strong>, m.plan, m.due, <StatusBadge tone={toneForStatus(m.status)}>{m.status}</StatusBadge>, <div className="row-actions"><button onClick={() => { approveReceipt(m.id); toast.success('Comprobante aprobado'); }}>Aprobar</button><button onClick={() => { rejectReceipt(m.id); toast.message('Se pidió reenviar comprobante'); }}>Rechazar</button></div>]);
    return <><SectionHeader eyebrow="Pagos" title="Comprobantes SINPE" text="Revisá mensualidades pendientes y aprobá pagos recibidos." /><div className="dashboard-grid"><AdminDataTable title="Revisión de pagos" subtitle="Comprobantes enviados por alumnos" columns={['Alumno', 'Plan', 'Periodo', 'Estado', 'Acciones']} rows={rows} emptyTitle="Sin comprobantes" emptyText="Los pagos enviados aparecerán aquí." /><article className="card"><BellRing /><h3>Acciones rápidas</h3><p>Aprobar comprobante</p><p>Rechazar y pedir reenvío</p><p>Enviar recordatorio de pago</p></article></div></>;
  }

  if (activeTab === 'Productos') return <><SectionHeader eyebrow="Venta adicional" title="Productos" text="Ofrecé artículos, equipo, merch o suplementos del negocio." /><div className="dashboard-grid"><AdminDataTable title="Productos activos" subtitle="Productos visibles en la academia" columns={['Producto', 'Categoría', 'Precio']} rows={tenantProducts.map(p => [<strong>{p.name}</strong>, p.category || 'General', money(p.price)])} emptyTitle="Sin productos" emptyText="Agregá productos para mostrarlos en la página." /><article className="card"><Settings /><h3>Agregar producto</h3><div className="stack-form"><input className="input" placeholder="Producto" value={productName} onChange={e => setProductName(e.target.value)} /><input className="input" type="number" placeholder="Precio" value={productPrice || ''} onChange={e => setProductPrice(Number(e.target.value))} /><button className="btn btn-primary btn-full" onClick={() => { if (!productName || !productPrice) return toast.error('Falta producto o precio'); addProduct(tenantSlug, productName, productPrice); setProductName(''); setProductPrice(0); toast.success('Producto agregado'); }}>Guardar producto</button></div></article></div></>;

  if (activeTab === 'Eventos') return <><SectionHeader eyebrow="Comunidad" title="Eventos y clases especiales" text="Publicá seminarios, clases abiertas y actividades del negocio." /><div className="dashboard-grid"><AdminDataTable title="Eventos activos" subtitle="Eventos públicos y clases especiales" columns={['Evento', 'Fecha', 'Precio']} rows={tenantEvents.map(e => [<strong>{e.title}</strong>, e.date, money(e.price)])} emptyTitle="Sin eventos" emptyText="Creá un evento para mostrarlo públicamente." /><article className="card"><Settings /><h3>Crear evento</h3><div className="stack-form"><input className="input" placeholder="Título" value={eventTitle} onChange={e => setEventTitle(e.target.value)} /><button className="btn btn-primary btn-full" onClick={() => { if (!eventTitle) return toast.error('Falta título'); addEvent(tenantSlug, eventTitle, 'Próxima semana', 10000); setEventTitle(''); toast.success('Evento creado'); }}>Guardar evento</button></div></article></div></>;

  if (activeTab === 'Clientes') return <><SectionHeader eyebrow="Alumnos" title="Alumnos activos" text="Lista de miembros, plan y estado de renovación." /><AdminDataTable title="Alumnos" subtitle="Personas asociadas a la academia" columns={['Alumno', 'Plan', 'Estado', 'Monto']} rows={tenantMemberships.map(m => [<strong>{m.client}</strong>, m.plan, m.due, money(m.amount)])} emptyTitle="Sin alumnos" emptyText="Cuando haya registros, aparecerán aquí." /></>;

  if (activeTab === 'Promos') return <><SectionHeader eyebrow="Crecimiento" title="Promociones" text="Beneficios, referidos y campañas para alumnos." /><div className="dashboard-grid"><article className="card"><Sparkles /><h3>Campañas</h3><p>Bienvenida</p><p>Referidos</p><p>Evento especial</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Mensualidad vencida</p><p>Comprobante pendiente</p><p>Alumno inactivo</p></article></div></>;

  if (activeTab === 'Ajustes') return <><SectionHeader eyebrow="Configuración" title="Datos del negocio" text="Información pública, contacto y pagos SINPE." /><div className="dashboard-grid"><article className="card wide-card"><Settings /><h3>Información general</h3><div className="stack-form"><input className="input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} placeholder="Nombre" /><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp" /><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" /><input className="input" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="Título público" /><input className="input" value={settings.ctaLabel} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="Botón principal" /><button className="btn btn-primary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Configuración guardada'); }}>Guardar configuración</button></div></article><article className="card"><Wallet /><h3>Pagos SINPE</h3><div className="stack-form"><input className="input" value={settings.sinpeNumber} onChange={e => setSettings({ ...settings, sinpeNumber: e.target.value })} placeholder="Número SINPE" /><input className="input" value={settings.sinpeOwner} onChange={e => setSettings({ ...settings, sinpeOwner: e.target.value })} placeholder="Titular" /><button className="btn btn-secondary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Datos SINPE guardados'); }}>Guardar SINPE</button></div></article></div></>;

  return <div className="dashboard-grid"><article className="card"><Image /><h3>Landing pública</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE: {tenant.sinpeNumber}</p><p>Titular: {tenant.sinpeOwner}</p></article></div>;
}
