import { useState, type ReactNode } from 'react';
import { CalendarDays, CheckCircle2, Clock, Dumbbell, Sparkles, Users, Wallet } from 'lucide-react';
import { StaffLayout } from '../layouts/AdminLayout';
import { useAtlasStore } from '../state/AtlasStore';

const money = (v: number) => `₡${v.toLocaleString('es-CR')}`;

export function StaffPortal({ tenantSlug }: { tenantSlug: string }) {
  const { getTenant, appointments, memberships } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const isMembership = tenant.vertical === 'membership';
  const tenantApts = appointments.filter((a) => a.tenantSlug === tenant.slug);
  const tenantMems = memberships.filter((m) => m.tenantSlug === tenant.slug);
  const [activeTab, setActiveTab] = useState('Operaciones');

  function renderClients() {
    return (
      <div className="staff-grid">
        {(isMembership ? tenantMems : tenantApts).map((item, i) => (
          <div className="card card-sm" key={i}>
            <div className="avatar" style={{ marginBottom: 12 }}>{('client' in item ? item.client : '?')[0]}</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{'client' in item ? item.client : ''}</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>{'plan' in item ? item.plan : 'service' in item ? item.service : ''}</div>
            <div className="mt-8">
              {'status' in item && <span className={`badge ${item.status === 'paid' || item.status === 'confirmed' ? 'badge-green' : 'badge-amber'}`}>{item.status === 'paid' ? 'Pagado' : item.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function renderPayments() {
    return (
      <div className="staff-grid">
        <div className="card">
          <div className="staff-card-icon"><Wallet size={18} /></div>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Pagos pendientes</h3>
          {isMembership ? tenantMems.filter((m) => m.status !== 'paid').map((m) => <div className="staff-item" key={m.id}><span>{m.client}</span><span className="badge badge-amber">{money(m.amount)}</span></div>) : <p>Depósitos por confirmar en citas.</p>}
        </div>
        <div className="card">
          <div className="staff-card-icon"><CheckCircle2 size={18} /></div>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Confirmados</h3>
          {isMembership ? tenantMems.filter((m) => m.status === 'paid').map((m) => <div className="staff-item" key={m.id}><span>{m.client}</span><span className="badge badge-green">Pagado</span></div>) : <p>Sin pagos confirmados.</p>}
        </div>
      </div>
    );
  }

  function renderOperations() {
    if (isMembership) {
      return <div className="staff-grid"><StaffCard icon={<Dumbbell size={18} />} title="Clases de hoy" items={['MMA · 6:00 PM', 'BJJ · 7:30 PM', 'Boxeo · 8:00 AM']} /><StaffCard icon={<Users size={18} />} title="Alumnos activos" items={tenantMems.map((m) => `${m.client} · ${m.plan}`)} /><StaffCard icon={<Sparkles size={18} />} title="Check-in hoy" items={tenantMems.filter((m) => m.status === 'paid').map((m) => `${m.client} · Activo`)} /></div>;
    }
    return <div className="staff-grid"><StaffCard icon={<CalendarDays size={18} />} title="Citas de hoy" items={tenantApts.map((a) => `${a.time} · ${a.client} · ${a.service}`)} /><StaffCard icon={<Clock size={18} />} title="Preparación" items={['Confirmar espacio de trabajo', 'Revisar notas del cliente', 'Preparar materiales']} /><StaffCard icon={<Sparkles size={18} />} title="Post-servicio" items={['Enviar instrucciones', 'Ofrecer rebooking', 'Aplicar puntos']} /></div>;
  }

  return (
    <StaffLayout tenant={tenant} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="page-header">
        <div className="flex-between">
          <div><div className="eyebrow">Staff Portal</div><h2>{tenant.name}</h2><p>Vista operativa reducida. Sin configuración ni datos sensibles.</p></div>
          <span className="badge badge-sky"><span className="dot dot-green" />{isMembership ? 'Academia activa' : 'Estudio activo'}</span>
        </div>
      </div>
      {activeTab === 'Clientes' ? renderClients() : activeTab === 'Pagos' ? renderPayments() : renderOperations()}
    </StaffLayout>
  );
}

function StaffCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return <div className="card"><div className="staff-card-icon">{icon}</div><h3 style={{ fontSize: 16, marginBottom: 10 }}>{title}</h3>{items.length ? items.map((item) => <div className="staff-item" key={item}><span>{item}</span></div>) : <p>Sin registros.</p>}</div>;
}
