import { useState } from 'react';
import { BellRing, CalendarDays, Image, Scissors, Settings, UserCheck, Users, Wallet, Receipt, Ticket, Package, Dumbbell, Sparkles } from 'lucide-react';
import { appointments, services, memberships, products, events } from '../data/demo';

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
    <>
      <div className="admin-tabs">
        {tabs.map(tab => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>
      {isMembership ? <MembershipAdminTab activeTab={activeTab} tenantSlug={tenant?.slug || ''} /> : <AppointmentAdminTab activeTab={activeTab} />}
    </>
  );
}

function AppointmentAdminTab({ activeTab }: { activeTab: string }) {
  if (activeTab === 'Agenda') {
    return <div className="dashboard-grid"><article className="card wide-card"><CalendarDays /><h3>Agenda diaria</h3>{appointments.map(a => <div className="agenda-row" key={a.id}><span>{a.time}</span><strong>{a.service}</strong><em>{a.status}</em></div>)}</article><article className="card"><BellRing /><h3>Acciones sugeridas</h3><p>Confirmar depósito pendiente.</p><p>Enviar recordatorio 24h antes.</p><p>Ofrecer aftercare kit al finalizar.</p></article></div>;
  }
  if (activeTab === 'Servicios') {
    return <article className="card"><Scissors /><h3>Servicios configurados</h3><div className="admin-table">{services.map(s => <div key={s.id}><strong>{s.name}</strong><span>{s.category}</span><span>{s.duration} min</span><span>{money(s.price)}</span></div>)}</div></article>;
  }
  if (activeTab === 'Profesionales') {
    return <div className="grid three">{professionals.map(pro => <article className="card" key={pro}><UserCheck /><h3>{pro.split(' · ')[0]}</h3><p>{pro.split(' · ')[1]}</p><p>Agenda activa · Servicios asignados</p></article>)}</div>;
  }
  if (activeTab === 'Clientes') {
    return <div className="grid three"><article className="card"><Users /><h3>Maria Lopez</h3><p>2 citas · 120 puntos · Piercing</p></article><article className="card"><Users /><h3>Carlos Vega</h3><p>1 cita · depósito pendiente · Tattoo</p></article><article className="card"><Users /><h3>Valeria Mora</h3><p>3 citas · cliente recurrente · Belleza</p></article></div>;
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
  return <article className="card"><CalendarDays /><h3>Citas</h3><div className="admin-table">{appointments.map(a => <div key={a.id}><strong>{a.client}</strong><span>{a.service}</span><span>{a.time}</span><span>{a.status}</span></div>)}</div></article>;
}

function MembershipAdminTab({ activeTab, tenantSlug }: { activeTab: string; tenantSlug: string }) {
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenantSlug);
  const tenantProducts = products.filter(item => item.tenantSlug === tenantSlug);
  const tenantEvents = events.filter(item => item.tenantSlug === tenantSlug);
  if (activeTab === 'Membresías') {
    return <article className="card"><Dumbbell /><h3>Membresías activas</h3><div className="admin-table">{tenantMemberships.map(m => <div key={m.id}><strong>{m.client}</strong><span>{m.plan}</span><span>{m.due}</span><span>{money(m.amount)}</span></div>)}</div></article>;
  }
  if (activeTab === 'Comprobantes') {
    return <div className="dashboard-grid"><article className="card wide-card"><Receipt /><h3>Comprobantes SINPE</h3>{tenantMemberships.map(m => <div className="agenda-row" key={m.id}><span>{m.client}</span><strong>{m.status}</strong><em>{m.due}</em></div>)}</article><article className="card"><BellRing /><h3>Acciones</h3><p>Aprobar comprobante</p><p>Rechazar y pedir reenvío</p><p>Enviar recordatorio de pago</p></article></div>;
  }
  if (activeTab === 'Productos') {
    return <article className="card"><Package /><h3>Productos y merch</h3>{tenantProducts.map(p => <p key={p.name}>{p.name} · {money(p.price)}</p>)}</article>;
  }
  if (activeTab === 'Eventos') {
    return <article className="card"><Ticket /><h3>Eventos y clases especiales</h3>{tenantEvents.map(e => <p key={e.title}>{e.title} · {e.date} · {money(e.price)}</p>)}</article>;
  }
  if (activeTab === 'Clientes') {
    return <div className="grid three">{tenantMemberships.map(m => <article className="card" key={m.id}><Users /><h3>{m.client}</h3><p>{m.plan}</p><p>{m.due}</p></article>)}</div>;
  }
  if (activeTab === 'Promos') {
    return <div className="dashboard-grid"><article className="card"><Sparkles /><h3>Promos de academia</h3><p>Promo matrícula</p><p>Referidos</p><p>Evento especial</p></article><article className="card"><BellRing /><h3>Automatizaciones</h3><p>Mensualidad vencida</p><p>Comprobante pendiente</p><p>Cliente inactivo</p></article></div>;
  }
  return <div className="dashboard-grid"><article className="card"><Settings /><h3>{activeTab}</h3><p>Módulo configurable para este tenant.</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE y validación manual de comprobantes.</p></article></div>;
}
