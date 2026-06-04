import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  BarChart3, Building2, CalendarDays, ChevronLeft, Dumbbell, Image, Menu,
  Package, Receipt, Scissors, Settings, Sparkles, Ticket, UserCheck, Users, Wallet, X
} from 'lucide-react';

type TenantLike = { slug: string; vertical: string; name: string; label?: string };

const APPOINTMENT_NAV = [
  { section: 'Operación', items: [
    { tab: 'Agenda', icon: <CalendarDays size={16} /> },
    { tab: 'Citas', icon: <Receipt size={16} /> },
    { tab: 'Servicios', icon: <Scissors size={16} /> },
    { tab: 'Profesionales', icon: <UserCheck size={16} /> },
  ]},
  { section: 'Clientes y crecimiento', items: [
    { tab: 'Clientes', icon: <Users size={16} /> },
    { tab: 'Promos', icon: <Sparkles size={16} /> },
  ]},
  { section: 'Configuración', items: [
    { tab: 'Landing', icon: <Image size={16} /> },
    { tab: 'Ajustes', icon: <Settings size={16} /> },
  ]},
];

const MEMBERSHIP_NAV = [
  { section: 'Operación', items: [
    { tab: 'Membresías', icon: <Dumbbell size={16} /> },
    { tab: 'Comprobantes', icon: <Wallet size={16} /> },
    { tab: 'Productos', icon: <Package size={16} /> },
    { tab: 'Eventos', icon: <Ticket size={16} /> },
  ]},
  { section: 'Alumnos y crecimiento', items: [
    { tab: 'Clientes', label: 'Alumnos', icon: <Users size={16} /> },
    { tab: 'Promos', icon: <Sparkles size={16} /> },
  ]},
  { section: 'Configuración', items: [
    { tab: 'Landing', icon: <Image size={16} /> },
    { tab: 'Ajustes', icon: <Settings size={16} /> },
  ]},
];

const STAFF_NAV = [
  { tab: 'Operaciones', icon: <CalendarDays size={16} /> },
  { tab: 'Clientes', icon: <Users size={16} /> },
  { tab: 'Pagos', icon: <Wallet size={16} /> },
];

export function AdminLayout({ tenant, activeTab, onTabChange, children }: {
  tenant: TenantLike;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isMembership = tenant.vertical === 'membership';
  const nav = isMembership ? MEMBERSHIP_NAV : APPOINTMENT_NAV;
  const businessType = isMembership ? 'Academia y membresías' : 'Servicios por cita';

  return (
    <div className="admin-shell admin-shell-premium">
      <button className="admin-mobile-menu" onClick={() => setOpen(true)}><Menu size={18} /> Menú</button>
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link href={`/${tenant.slug}`} className="admin-brand">Atlas OS</Link>
          <button className="admin-close" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <div className="tenant-chip tenant-chip-premium"><span>{businessType}</span><strong>{tenant.name}</strong><small>Panel privado del negocio</small></div>
        <nav className="admin-nav">
          {nav.map(group => (
            <div key={group.section} className="admin-nav-group">
              <p>{group.section}</p>
              {group.items.map(item => (
                <button key={item.tab} className={activeTab === item.tab ? 'active' : ''} onClick={() => { onTabChange(item.tab); setOpen(false); }}>
                  {item.icon}<span>{'label' in item ? item.label : item.tab}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-foot"><Link href={`/${tenant.slug}`}><ChevronLeft size={14} /> Vista pública</Link><Link href={`/staff/${tenant.slug}/login`}>Entrar como staff</Link></div>
      </aside>
      <main className="admin-main admin-main-premium">
        <header className="admin-command-center">
          <div>
            <span className="eyebrow">Panel del negocio · {businessType}</span>
            <h1>{tenant.name}</h1>
            <p>Operación, clientes, pagos y configuración viven dentro de esta zona privada.</p>
          </div>
          <div className="admin-command-actions">
            <span className="badge badge-amber"><span className="dot dot-amber" /> Activo</span>
            <Link className="btn btn-sm btn-secondary" href={`/${tenant.slug}`}>Vista pública</Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="super-shell admin-shell-premium">
      <aside className="super-sidebar">
        <Link href="/super-admin" className="admin-brand">Digital Atlas</Link>
        <nav className="admin-nav"><div className="admin-nav-group"><p>Control interno</p><Link href="/super-admin"><Building2 size={16} /> Negocios</Link><Link href="/super-admin"><BarChart3 size={16} /> Métricas</Link><Link href="/super-admin"><Settings size={16} /> Sistema</Link></div></nav>
      </aside>
      <main className="super-main admin-main-premium">{children}</main>
    </div>
  );
}

export function StaffLayout({ tenant, activeTab, onTabChange, children }: { tenant: TenantLike; activeTab: string; onTabChange: (tab: string) => void; children: ReactNode }) {
  return (
    <div className="admin-shell admin-shell-premium">
      <aside className="admin-sidebar sidebar-staff">
        <div className="admin-sidebar-head"><Link href={`/${tenant.slug}`} className="admin-brand">{tenant.name}</Link></div>
        <nav className="admin-nav">
          <div className="admin-nav-group"><p>Vista staff</p>{STAFF_NAV.map(item => <button key={item.tab} className={activeTab === item.tab ? 'active' : ''} onClick={() => onTabChange(item.tab)}>{item.icon}<span>{item.tab}</span></button>)}</div>
          <div className="admin-nav-group"><p>Acceso</p><Link href={`/${tenant.slug}`}><ChevronLeft size={16} /> Vista pública</Link></div>
        </nav>
      </aside>
      <main className="admin-main admin-main-premium">
        <header className="admin-command-center staff-command-center"><div><span className="eyebrow">Vista staff</span><h1>{tenant.name}</h1><p>Operación diaria reducida, sin configuración sensible.</p></div><span className="badge badge-sky"><span className="dot dot-green" /> Turno activo</span></header>
        {children}
      </main>
    </div>
  );
}
