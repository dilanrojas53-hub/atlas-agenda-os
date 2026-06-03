import { useState } from 'react';
import { BellRing, CalendarDays, Image, Scissors, Settings, UserCheck, Users, Wallet, Receipt, Ticket, Package, Dumbbell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAtlasStore } from '../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const appointmentTabs = ['Agenda', 'Citas', 'Servicios', 'Profesionales', 'Clientes', 'Promos', 'Landing', 'Ajustes'];
const membershipTabs = ['Membresías', 'Comprobantes', 'Clientes', 'Productos', 'Eventos', 'Promos', 'Landing', 'Ajustes'];
const professionals = ['Ana · Tattoo artist', 'Marco · Piercer', 'Sofia · Beauty specialist'];

type TenantLike = { slug: string; vertical: string; name: string };

export function AdminWorkspace({ tenant }: { tenant?: TenantLike }) {
  const isMembership = tenant?.vertical === 'membership';
  const tabs = isMembership ? membershipTabs : appointmentTabs;
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="tenant-workspace">
      <div className="workspace-header card">
        <div>
          <span className="eyebrow">Workspace aislado</span>
          <h2>{tenant?.name}</h2>
          <p>Este panel pertenece solo a este tenant. No mezcla clientes, pagos ni módulos de otros negocios.</p>
        </div>
        <strong>{isMembership ? 'Vertical membresías' : 'Vertical citas'}</strong>
      </div>
      <div className="admin-tabs">
        {tabs.map(tab => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>
      {isMembership ? <MembershipAdminTab activeTab={activeTab} tenantSlug={tenant?.slug || ''} /> : <AppointmentAdminTab activeTab={activeTab} tenantSlug={tenant?.slug || ''} />}
    </section>
  );
}

function AppointmentAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const { appointments, services, addService } = useAtlasStore();
  const tenantAppointments = appointments.filter(item => item.tenantSlug === tenantSlug);
  const tenantServices = services.filter(item => item.tenantSlug === tenantSlug);
  const [newService, setNewService] = useState({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 });

  if (activeTab === 'Agenda') {
    return <div className="dashboard-grid"><article className="card wide-card"><CalendarDays /><h3>Agenda diaria</h3>{tenantAppointments.map(a => <div className="agenda-row" key={a.id}><span>{a.time}</span><strong>{a.service}</strong><em>{a.status}</em></div>)}</article><article className="card"><BellRing /><h3>Acciones sugeridas</h3><p>Confirmar depósitos pendientes.</p><p>Enviar recordatorio 24h antes.</p><p>Ofrecer aftercare o rebooking al finalizar.</p></article></div>;
  }

  if (activeTab === 'Servicios') {
    return <div className="dashboard-grid"><article className="card wide-card"><Scissors /><h3>Servicios configurados</h3><div className="admin-table">{tenantServices.map(s => <div key={s.id}><strong>{s.name}</strong><span>{s.category}</span><span>{s.duration} min</span><span>{money(s.price)}</span></div>)}</div></article><article className="card"><Settings /><h3>Agregar servicio</h3><div className="stack-form"><input placeholder="Nombre" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} /><input placeholder="Categoría" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })} /><input type="number" placeholder="Precio" value={newService.price || ''} onChange={e => setNewService({ ...newService, price: Number(e.target.value) })} /><button className="btn primary full" onClick={() => { if (!newService.name || !newService.price) return toast.error('Falta nombre o precio'); addService({ tenantSlug, ...newService }); setNewService({ name: '', category: 'General', price: 0, duration: 45, deposit: 5000 }); toast.success('Servicio agregado al tenant'); }}>Guardar servicio</button></div></article></div>;
  }

  if (activeTab === 'Profesionales') {
    return <div className="grid three">{professionals.map(pro => <article className="card" key={pro}><UserCheck /><h3>{pro.split(' · ')[0]}</h3><p>{pro.split(' · ')[1]}</p><p>Agenda activa · Servicios asignados</p></article>)}</div>;
  }

  if (activeTab === 'Clientes') {
    const clients = Array.from(new Set(tenantAppointments.map(item => item.client)));
    return <div className="grid three">{clients.map(client => <article className="card" key={client}><Users /><h3>{client}</h3><p>{tenantAppointments.filter(item => item.client === client).length} citas</p><p>Historial dentro de este tenant</p></article>)}</div>;
  }

  if (activeTab === 'Promos') {
    return <div className="dashboard-grid"><article className="card"><Sparkles /><h3>Growth engine</h3><p>Flash day tattoo</p><p>Promo aftercare kit</p><p>Reactivación cliente 60 días</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Recordatorio de cita</p><p>Post-servicio</p><p>Beneficio por puntos</p></article></div>;
  }

  if (activeTab === 'Landing') {
    return <div className="dashboard-grid"><article className="card"><Image /><h3>Landing pública</h3><p>Hero activo, portafolio pendiente, horarios visibles, WhatsApp conectado.</p></article><article className="card"><Settings /><h3>Bloques editables</h3><p>Hero</p><p>Galería</p><p>Mapa</p><p>CTA de reserva</p></article></div>;
  }

  if (activeTab === 'Ajustes') {
    return <div className="dashboard-grid"><article className="card"><Settings /><h3>Configuración</h3><p>Depósito obligatorio: activo.</p><p>Recordatorios: WhatsApp.</p><p>Duración base: por servicio.</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE configurado.</p><p>Comprobante requerido para confirmar.</p></article></div>;
  }

  return <article className="card"><CalendarDays /><h3>Citas</h3><div className="admin-table">{tenantAppointments.map(a => <div key={a.id}><strong>{a.client}</strong><span>{a.service}</span><span>{a.time}</span><span>{a.status}</span></div>)}</div></article>;
}

function MembershipAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const { memberships, products, events, approveReceipt, rejectReceipt, addProduct, addEvent } = useAtlasStore();
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenantSlug);
  const tenantProducts = products.filter(item => item.tenantSlug === tenantSlug);
  const tenantEvents = events.filter(item => item.tenantSlug === tenantSlug);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [eventTitle, setEventTitle] = useState('');

  if (activeTab === 'Membresías') {
    return <article className="card"><Dumbbell /><h3>Membresías activas</h3><div className="admin-table">{tenantMemberships.map(m => <div key={m.id}><strong>{m.client}</strong><span>{m.plan}</span><span>{m.due}</span><span>{money(m.amount)}</span></div>)}</div></article>;
  }

  if (activeTab === 'Comprobantes') {
    return <div className="dashboard-grid"><article className="card wide-card"><Receipt /><h3>Comprobantes SINPE</h3>{tenantMemberships.map(m => <div className="review-row" key={m.id}><div><strong>{m.client}</strong><span>{m.plan}</span><em>{m.status} · {m.due}</em></div><div className="row-actions"><button onClick={() => { approveReceipt(m.id); toast.success('Comprobante aprobado'); }}>Aprobar</button><button onClick={() => { rejectReceipt(m.id); toast.message('Se pidió reenviar comprobante'); }}>Rechazar</button></div></div>)}</article><article className="card"><BellRing /><h3>Acciones</h3><p>Aprobar comprobante</p><p>Rechazar y pedir reenvío</p><p>Enviar recordatorio de pago</p></article></div>;
  }

  if (activeTab === 'Productos') {
    return <div className="dashboard-grid"><article className="card wide-card"><Package /><h3>Productos y merch</h3>{tenantProducts.map(p => <p key={p.name}>{p.name} · {money(p.price)}</p>)}</article><article className="card"><Settings /><h3>Agregar producto</h3><div className="stack-form"><input placeholder="Producto" value={productName} onChange={e => setProductName(e.target.value)} /><input type="number" placeholder="Precio" value={productPrice || ''} onChange={e => setProductPrice(Number(e.target.value))} /><button className="btn primary full" onClick={() => { if (!productName || !productPrice) return toast.error('Falta producto o precio'); addProduct(tenantSlug, productName, productPrice); setProductName(''); setProductPrice(0); toast.success('Producto agregado'); }}>Guardar producto</button></div></article></div>;
  }

  if (activeTab === 'Eventos') {
    return <div className="dashboard-grid"><article className="card wide-card"><Ticket /><h3>Eventos y clases especiales</h3>{tenantEvents.map(e => <p key={e.title}>{e.title} · {e.date} · {money(e.price)}</p>)}</article><article className="card"><Settings /><h3>Crear evento</h3><div className="stack-form"><input placeholder="Título" value={eventTitle} onChange={e => setEventTitle(e.target.value)} /><button className="btn primary full" onClick={() => { if (!eventTitle) return toast.error('Falta título'); addEvent(tenantSlug, eventTitle, 'Próxima semana', 10000); setEventTitle(''); toast.success('Evento creado'); }}>Guardar evento</button></div></article></div>;
  }

  if (activeTab === 'Clientes') {
    return <div className="grid three">{tenantMemberships.map(m => <article className="card" key={m.id}><Users /><h3>{m.client}</h3><p>{m.plan}</p><p>{m.due}</p></article>)}</div>;
  }

  if (activeTab === 'Promos') {
    return <div className="dashboard-grid"><article className="card"><Sparkles /><h3>Promos de academia</h3><p>Promo matrícula</p><p>Referidos</p><p>Evento especial</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Mensualidad vencida</p><p>Comprobante pendiente</p><p>Cliente inactivo</p></article></div>;
  }

  return <div className="dashboard-grid"><article className="card"><Settings /><h3>{activeTab}</h3><p>Módulo configurable para este tenant.</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE y validación manual de comprobantes.</p></article></div>;
}
