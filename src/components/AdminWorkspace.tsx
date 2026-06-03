import { useState } from 'react';
import { BellRing, CalendarDays, Image, Scissors, Settings, UserCheck, Users, Wallet, Receipt, Ticket, Package, Dumbbell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const professionals = ['Ana · Especialista', 'Marco · Profesional', 'Sofia · Consultora'];

type TenantLike = { slug: string; vertical: string; name: string };

export function AdminWorkspace({ tenant, activeTab }: { tenant: TenantLike; activeTab?: string }) {
  const isMembership = tenant.vertical === 'membership';
  const currentTab = activeTab || (isMembership ? 'Membresías' : 'Agenda');
  return (
    <section className="tenant-workspace">
      {isMembership ? <MembershipAdminTab activeTab={currentTab} tenantSlug={tenant.slug} /> : <AppointmentAdminTab activeTab={currentTab} tenantSlug={tenant.slug} />}
    </section>
  );
}

function AppointmentAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const { appointments, services, addService, updateAppointmentStatus, getTenant, updateTenant } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const tenantAppointments = appointments.filter(item => item.tenantSlug === tenantSlug);
  const tenantServices = services.filter(item => item.tenantSlug === tenantSlug);
  const [newService, setNewService] = useState({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 });
  const [settings, setSettings] = useState({ name: tenant.name, whatsapp: tenant.whatsapp, address: tenant.address, sinpeNumber: tenant.sinpeNumber || '', sinpeOwner: tenant.sinpeOwner || tenant.name, heroTitle: tenant.heroTitle || tenant.name, ctaLabel: tenant.ctaLabel || 'Reservar ahora' });

  if (activeTab === 'Agenda') {
    return <div className="dashboard-grid"><article className="card wide-card"><CalendarDays /><h3>Agenda diaria</h3>{tenantAppointments.map(a => <div className="review-row" key={a.id}><div><strong>{a.client}</strong><span>{a.service} · {a.time}</span><em>{a.status}</em></div><div className="row-actions"><button onClick={() => { updateAppointmentStatus(a.id, 'confirmed'); toast.success('Cita confirmada'); }}>Confirmar</button><button onClick={() => { updateAppointmentStatus(a.id, 'cancelled'); toast.message('Cita cancelada'); }}>Cancelar</button></div></div>)}</article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorio 24h antes.</p><p>Solicitud de depósito.</p><p>Mensaje post-servicio.</p></article></div>;
  }

  if (activeTab === 'Servicios') {
    return <div className="dashboard-grid"><article className="card wide-card"><Scissors /><h3>Servicios configurados</h3><div className="admin-table">{tenantServices.map(s => <div key={s.id}><strong>{s.name}</strong><span>{s.category}</span><span>{s.duration} min</span><span>{money(s.price)}</span></div>)}</div></article><article className="card"><Settings /><h3>Agregar servicio</h3><div className="stack-form"><input className="input" placeholder="Nombre" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} /><input className="input" placeholder="Categoría" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} /><input className="input" type="number" placeholder="Precio" value={newService.price || ''} onChange={e => setNewService({ ...newService, price: Number(e.target.value) })} /><button className="btn btn-primary btn-full" onClick={() => { if (!newService.name || !newService.price) return toast.error('Falta nombre o precio'); addService({ tenantSlug, ...newService }); setNewService({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 }); toast.success('Servicio agregado'); }}>Guardar servicio</button></div></article></div>;
  }

  if (activeTab === 'Profesionales') {
    return <div className="feature-grid">{professionals.map(pro => <article className="card" key={pro}><UserCheck /><h3>{pro.split(' · ')[0]}</h3><p>{pro.split(' · ')[1]}</p><p>Agenda activa · Servicios asignados</p></article>)}</div>;
  }

  if (activeTab === 'Clientes') {
    const clients = Array.from(new Set(tenantAppointments.map(item => item.client)));
    return <div className="feature-grid">{clients.map(client => <article className="card" key={client}><Users /><h3>{client}</h3><p>{tenantAppointments.filter(item => item.client === client).length} citas</p><p>Historial dentro de este tenant</p></article>)}</div>;
  }

  if (activeTab === 'Promos') {
    return <div className="dashboard-grid"><article className="card"><Sparkles /><h3>Growth engine</h3><p>Campañas de bienvenida</p><p>Promoción de reactivación</p><p>Beneficios por recurrencia</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorio de cita</p><p>Post-servicio</p><p>Beneficio por puntos</p></article></div>;
  }

  if (activeTab === 'Landing') {
    return <div className="dashboard-grid"><article className="card"><Image /><h3>Preview landing</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p><p>WhatsApp: {tenant.whatsapp}</p></article><article className="card"><Settings /><h3>Bloques editables</h3><p>Hero</p><p>Galería</p><p>Mapa</p><p>CTA de reserva</p></article></div>;
  }

  if (activeTab === 'Ajustes') {
    return <div className="dashboard-grid"><article className="card wide-card"><Settings /><h3>Configuración del negocio</h3><div className="stack-form"><input className="input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} placeholder="Nombre" /><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp" /><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" /><input className="input" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="Hero" /><input className="input" value={settings.ctaLabel} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="CTA" /><button className="btn btn-primary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Configuración guardada'); }}>Guardar configuración</button></div></article><article className="card"><Wallet /><h3>Pagos SINPE</h3><div className="stack-form"><input className="input" value={settings.sinpeNumber} onChange={e => setSettings({ ...settings, sinpeNumber: e.target.value })} placeholder="Número SINPE" /><input className="input" value={settings.sinpeOwner} onChange={e => setSettings({ ...settings, sinpeOwner: e.target.value })} placeholder="Titular" /><button className="btn btn-secondary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Datos SINPE guardados'); }}>Guardar SINPE</button></div></article></div>;
  }

  return <article className="card"><CalendarDays /><h3>Citas</h3><div className="admin-table">{tenantAppointments.map(a => <div key={a.id}><strong>{a.client}</strong><span>{a.service}</span><span>{a.time}</span><span>{a.status}</span></div>)}</div></article>;
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

  if (activeTab === 'Membresías') {
    return <article className="card"><Dumbbell /><h3>Membresías activas</h3><div className="admin-table">{tenantMemberships.map(m => <div key={m.id}><strong>{m.client}</strong><span>{m.plan}</span><span>{m.due}</span><span>{money(m.amount)}</span></div>)}</div></article>;
  }

  if (activeTab === 'Comprobantes') {
    return <div className="dashboard-grid"><article className="card wide-card"><Receipt /><h3>Comprobantes SINPE</h3>{tenantMemberships.map(m => <div className="review-row" key={m.id}><div><strong>{m.client}</strong><span>{m.plan}</span><em>{m.status} · {m.due}</em></div><div className="row-actions"><button onClick={() => { approveReceipt(m.id); toast.success('Comprobante aprobado'); }}>Aprobar</button><button onClick={() => { rejectReceipt(m.id); toast.message('Se pidió reenviar comprobante'); }}>Rechazar</button></div></div>)}</article><article className="card"><BellRing /><h3>Acciones</h3><p>Aprobar comprobante</p><p>Rechazar y pedir reenvío</p><p>Enviar recordatorio de pago</p></article></div>;
  }

  if (activeTab === 'Productos') {
    return <div className="dashboard-grid"><article className="card wide-card"><Package /><h3>Productos y merch</h3>{tenantProducts.map(p => <p key={p.name}>{p.name} · {money(p.price)}</p>)}</article><article className="card"><Settings /><h3>Agregar producto</h3><div className="stack-form"><input className="input" placeholder="Producto" value={productName} onChange={e => setProductName(e.target.value)} /><input className="input" type="number" placeholder="Precio" value={productPrice || ''} onChange={e => setProductPrice(Number(e.target.value))} /><button className="btn btn-primary btn-full" onClick={() => { if (!productName || !productPrice) return toast.error('Falta producto o precio'); addProduct(tenantSlug, productName, productPrice); setProductName(''); setProductPrice(0); toast.success('Producto agregado'); }}>Guardar producto</button></div></article></div>;
  }

  if (activeTab === 'Eventos') {
    return <div className="dashboard-grid"><article className="card wide-card"><Ticket /><h3>Eventos y clases especiales</h3>{tenantEvents.map(e => <p key={e.title}>{e.title} · {e.date} · {money(e.price)}</p>)}</article><article className="card"><Settings /><h3>Crear evento</h3><div className="stack-form"><input className="input" placeholder="Título" value={eventTitle} onChange={e => setEventTitle(e.target.value)} /><button className="btn btn-primary btn-full" onClick={() => { if (!eventTitle) return toast.error('Falta título'); addEvent(tenantSlug, eventTitle, 'Próxima semana', 10000); setEventTitle(''); toast.success('Evento creado'); }}>Guardar evento</button></div></article></div>;
  }

  if (activeTab === 'Clientes') {
    return <div className="feature-grid">{tenantMemberships.map(m => <article className="card" key={m.id}><Users /><h3>{m.client}</h3><p>{m.plan}</p><p>{m.due}</p></article>)}</div>;
  }

  if (activeTab === 'Promos') {
    return <div className="dashboard-grid"><article className="card"><Sparkles /><h3>Promos de academia</h3><p>Promo de bienvenida</p><p>Referidos</p><p>Evento especial</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Mensualidad vencida</p><p>Comprobante pendiente</p><p>Cliente inactivo</p></article></div>;
  }

  if (activeTab === 'Ajustes') {
    return <div className="dashboard-grid"><article className="card wide-card"><Settings /><h3>Configuración del negocio</h3><div className="stack-form"><input className="input" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} placeholder="Nombre" /><input className="input" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp" /><input className="input" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} placeholder="Dirección" /><input className="input" value={settings.heroTitle} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="Hero" /><input className="input" value={settings.ctaLabel} onChange={e => setSettings({ ...settings, ctaLabel: e.target.value })} placeholder="CTA" /><button className="btn btn-primary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Configuración guardada'); }}>Guardar configuración</button></div></article><article className="card"><Wallet /><h3>Pagos SINPE</h3><div className="stack-form"><input className="input" value={settings.sinpeNumber} onChange={e => setSettings({ ...settings, sinpeNumber: e.target.value })} placeholder="Número SINPE" /><input className="input" value={settings.sinpeOwner} onChange={e => setSettings({ ...settings, sinpeOwner: e.target.value })} placeholder="Titular" /><button className="btn btn-secondary btn-full" onClick={() => { updateTenant(tenantSlug, settings); toast.success('Datos SINPE guardados'); }}>Guardar SINPE</button></div></article></div>;
  }

  return <div className="dashboard-grid"><article className="card"><Image /><h3>Landing pública</h3><p>Hero: {tenant.heroTitle}</p><p>CTA: {tenant.ctaLabel}</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE: {tenant.sinpeNumber}</p><p>Titular: {tenant.sinpeOwner}</p></article></div>;
}
