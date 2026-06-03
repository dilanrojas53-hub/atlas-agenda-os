import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  BarChart3, Building2, CalendarDays, ChevronLeft, Dumbbell, Image, Menu,
  Package, Receipt, Scissors, Settings, Sparkles, Ticket, UserCheck, Users, Wallet, X
} from 'lucide-react';

type TenantLike = { slug: string; vertical: string; name: string; label?: string };

const APPOINTMENT_NAV = [
  { section: 'Operaciones', items: [
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
  { section: 'Operaciones', items: [
    { tab: 'Membresías', icon: <Dumbbell size={16} /> },
    { tab: 'Comprobantes', icon: <Wallet size={16} /> },
    { tab: 'Productos', icon: <Package size={16} /> },
    { tab: 'Eventos', icon: <Ticket size={16} /> },
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

export function AdminLayout({ tenant, activeTab, onTabChange, children }: {
  tenant: TenantLike;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const nav = tenant.vertical === 'membership' ? MEMBERSHIP_NAV : APPOINTMENT_NAV;

  return (
    <div className="admin-shell">
      <button className="admin-mobile-menu" onClick={() => setOpen(true)}><Menu size={18} /> Menu</button>
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link href="/" className="admin-brand">Atlas OS</Link>
          <button className="admin-close" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <div className="tenant-chip">
          <span>{tenant.vertical}</span>
          <strong>{tenant.name}</strong>
        </div>
        <nav className="admin-nav">
          {nav.map(group => (
            <div key={group.section} className="admin-nav-group">
              <p>{group.section}</p>
              {group.items.map(item => (
                <button key={item.tab} className={activeTab === item.tab ? 'active' : ''} onClick={() => { onTabChange(item.tab); setOpen(false); }}>
                  {item.icon}<span>{item.tab}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link href={`/${tenant.slug}`}><ChevronLeft size={14} /> Vista pública</Link>
          <Link href={`/staff/${tenant.slug}`}>Staff portal</Link>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Admin workspace</span>
            <h1>{tenant.name}</h1>
          </div>
          <div className="admin-top-actions">
            <span className="badge badge-amber"><span className="dot dot-amber" /> Activo</span>
            <Link className="btn btn-sm btn-secondary" href="/super-admin">Digital Atlas</Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="super-shell">
      <aside className="super-sidebar">
        <Link href="/super-admin" className="admin-brand">Digital Atlas</Link>
        <nav className="admin-nav">
          <div className="admin-nav-group">
            <p>Control center</p>
            <Link href="/super-admin"><Building2 size={16} /> Tenants</Link>
            <Link href="/super-admin"><BarChart3 size={16} /> Métricas</Link>
            <Link href="/super-admin"><Settings size={16} /> Sistema</Link>
          </div>
        </nav>
      </aside>
      <main className="super-main">{children}</main>
    </div>
  );
}

export function StaffLayout({ tenant, children }: { tenant: TenantLike; children: ReactNode }) {
  return (
    <div className="staff-shell">
      <header className="staff-topbar">
        <div>
          <span className="eyebrow">Staff operativo</span>
          <h1>{tenant.name}</h1>
        </div>
        <Link className="btn btn-sm btn-secondary" href={`/admin/${tenant.slug}`}>Volver al admin</Link>
      </header>
      {children}
    </div>
  );
}
