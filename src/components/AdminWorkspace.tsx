import { useState } from 'react';
import { BellRing, CalendarDays, Image, Scissors, Settings, UserCheck, Users, Wallet } from 'lucide-react';
import { appointments, services } from '../data/demo';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
const tabs = ['Agenda', 'Citas', 'Servicios', 'Profesionales', 'Clientes', 'Landing', 'Ajustes'];
const professionals = ['Ana · Tattoo artist', 'Marco · Piercer', 'Sofia · Beauty specialist'];

export function AdminWorkspace() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <>
      <div className="admin-tabs">
        {tabs.map(tab => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>
      <AdminTabContent activeTab={activeTab} />
    </>
  );
}

function AdminTabContent({ activeTab }: { activeTab: string }) {
  if (activeTab === 'Agenda') {
    return (
      <div className="dashboard-grid">
        <article className="card wide-card"><CalendarDays /><h3>Agenda diaria</h3>{appointments.map(a => <div className="agenda-row" key={a.id}><span>{a.time}</span><strong>{a.service}</strong><em>{a.status}</em></div>)}</article>
        <article className="card"><BellRing /><h3>Acciones sugeridas</h3><p>Confirmar depósito pendiente.</p><p>Enviar recordatorio 24h antes.</p><p>Ofrecer aftercare kit al finalizar.</p></article>
      </div>
    );
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

  if (activeTab === 'Landing') {
    return <div className="dashboard-grid"><article className="card"><Image /><h3>Landing pública</h3><p>Hero activo, portafolio pendiente, horarios visibles, WhatsApp conectado.</p></article><article className="card"><Settings /><h3>Bloques editables</h3><p>Hero</p><p>Galería</p><p>Mapa</p><p>CTA de reserva</p></article></div>;
  }

  if (activeTab === 'Ajustes') {
    return <div className="dashboard-grid"><article className="card"><Settings /><h3>Configuración</h3><p>Depósito obligatorio: activo.</p><p>Recordatorios: WhatsApp.</p><p>Duración base: por servicio.</p></article><article className="card"><Wallet /><h3>Pagos</h3><p>SINPE configurado.</p><p>Comprobante requerido para confirmar.</p></article></div>;
  }

  return <article className="card"><CalendarDays /><h3>Citas</h3><div className="admin-table">{appointments.map(a => <div key={a.id}><strong>{a.client}</strong><span>{a.service}</span><span>{a.time}</span><span>{a.status}</span></div>)}</div></article>;
}
