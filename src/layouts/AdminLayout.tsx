import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { BarChart3, Building2, CalendarDays, ChevronLeft, Dumbbell, Image, LayoutDashboard, Menu, Package, Receipt, Scissors, Settings, Sparkles, Ticket, UserCheck, Users, Wallet, X } from 'lucide-react';

type TenantLike = { slug: string; vertical: string; name: string; label?: string };
const exitZone = (role: 'admin' | 'staff' | 'super', slug?: string, to = '/') => { window.localStorage.removeItem(`atlas-gate:${role}:${slug || 'global'}`); window.location.href = to; };
const APPOINTMENT_NAV = [
  { section: 'Principal', items: [{ tab: 'Dashboard', label: 'Resumen', icon: <LayoutDashboard size={16} /> }, { tab: 'Agenda', icon: <CalendarDays size={16} /> }, { tab: 'Citas', icon: <Receipt size={16} /> }] },
  { section: 'Gestión', items: [{ tab: 'Servicios', icon: <Scissors size={16} /> }, { tab: 'Profesionales', icon: <UserCheck size={16} /> }, { tab: 'Clientes', icon: <Users size={16} /> }] },
  { section: 'Crecimiento', items: [{ tab: 'Promos', label: 'Promociones', icon: <Sparkles size={16} /> }, { tab: 'Landing', label: 'Página pública', icon: <Image size={16} /> }] },
  { section: 'Sistema', items: [{ tab: 'Ajustes', label: 'Configuración', icon: <Settings size={16} /> }] },
];
const MEMBERSHIP_NAV = [
  { section: 'Principal', items: [{ tab: 'Dashboard', label: 'Resumen', icon: <LayoutDashboard size={16} /> }, { tab: 'Solicitudes', icon: <UserCheck size={16} /> }, { tab: 'Membresías', icon: <Dumbbell size={16} /> }, { tab: 'Comprobantes', label: 'Pagos SINPE', icon: <Wallet size={16} /> }] },
  { section: 'Gestión', items: [{ tab: 'Clientes', label: 'Alumnos', icon: <Users size={16} /> }, { tab: 'Productos', icon: <Package size={16} /> }, { tab: 'Eventos', icon: <Ticket size={16} /> }] },
  { section: 'Crecimiento', items: [{ tab: 'Promos', label: 'Promociones', icon: <Sparkles size={16} /> }, { tab: 'Landing', label: 'Página pública', icon: <Image size={16} /> }] },
  { section: 'Sistema', items: [{ tab: 'Ajustes', label: 'Configuración', icon: <Settings size={16} /> }] },
];
const STAFF_NAV = [{ tab: 'Operaciones', icon: <CalendarDays size={16} /> }, { tab: 'Clientes', icon: <Users size={16} /> }, { tab: 'Pagos', icon: <Wallet size={16} /> }];

export function AdminLayout({ tenant, activeTab, onTabChange, children }: { tenant: TenantLike; activeTab: string; onTabChange: (tab: string) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isMembership = tenant.vertical === 'membership';
  const nav = isMembership ? MEMBERSHIP_NAV : APPOINTMENT_NAV;
  const businessType = isMembership ? 'Academia y membresías' : 'Servicios por cita';
  return <div className="admin-shell admin-shell-premium">
    <button className="admin-mobile-menu" onClick={() => setOpen(true)}><Menu size={18} /> Menú</button>
    <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
      <div className="admin-sidebar-head"><Link href={`/${tenant.slug}`} className="admin-brand">Atlas Agenda OS</Link><button className="admin-close" onClick={() => setOpen(false)}><X size={18} /></button></div>
      <div className="tenant-chip tenant-chip-premium"><span>{businessType}</span><strong>{tenant.name}</strong><small>Panel privado · Negocio activo</small></div>
      <nav className="admin-nav">{nav.map(group => <div key={group.section} className="admin-nav-group"><p>{group.section}</p>{group.items.map(item => <button key={item.tab} className={activeTab === item.tab ? 'active' : ''} onClick={() => { onTabChange(item.tab); setOpen(false); }}>{item.icon}<span>{item.label || item.tab}</span></button>)}</div>)}</nav>
      <div className="admin-sidebar-foot"><Link href={`/${tenant.slug}`}><ChevronLeft size={14} /> Vista pública</Link><Link href={`/staff/${tenant.slug}/login`}>Entrar como staff</Link><button className="zone-exit" onClick={() => exitZone('admin', tenant.slug, `/${tenant.slug}`)}>Salir del panel</button></div>
    </aside>
    <main className="admin-main admin-main-premium"><header className="admin-command-center"><div><span className="eyebrow">{businessType}</span><h1>{activeTab === 'Dashboard' ? 'Resumen' : activeTab}</h1><p>{activeTab === 'Dashboard' ? 'Una vista ejecutiva de la operación, clientes y pagos.' : `Gestioná ${activeTab.toLowerCase()} desde el panel privado de ${tenant.name}.`}</p></div><div className="admin-command-actions"><span className="badge badge-green"><span className="dot dot-green" /> Activo</span><Link className="btn btn-sm btn-secondary" href={`/${tenant.slug}`}>Vista pública</Link><button className="btn btn-sm btn-secondary" onClick={() => exitZone('admin', tenant.slug, `/${tenant.slug}`)}>Salir</button></div></header>{children}</main>
  </div>;
}

export function SuperAdminLayout({ children }: { children: ReactNode }) { return <div className="super-shell admin-shell-premium"><aside className="super-sidebar"><Link href="/atlas" className="admin-brand">Digital Atlas</Link><nav className="admin-nav"><div className="admin-nav-group"><p>Control interno</p><Link href="/atlas"><Building2 size={16} /> Negocios</Link><Link href="/atlas"><BarChart3 size={16} /> Métricas</Link><Link href="/atlas"><Settings size={16} /> Sistema</Link></div><div className="admin-nav-group"><p>Acceso</p><button className="zone-exit" onClick={() => exitZone('super', undefined, '/')}>Salir de Digital Atlas</button></div></nav></aside><main className="super-main admin-main-premium"><header className="admin-command-center"><div><span className="eyebrow">Digital Atlas</span><h1>Control interno</h1><p>Zona separada para administrar negocios, planes y funciones activas.</p></div><button className="btn btn-sm btn-secondary" onClick={() => exitZone('super', undefined, '/')}>Salir</button></header>{children}</main></div>; }

export function StaffLayout({ tenant, activeTab, onTabChange, children }: { tenant: TenantLike; activeTab: string; onTabChange: (tab: string) => void; children: ReactNode }) { return <div className="admin-shell admin-shell-premium"><aside className="admin-sidebar sidebar-staff"><div className="admin-sidebar-head"><Link href={`/${tenant.slug}`} className="admin-brand">{tenant.name}</Link></div><nav className="admin-nav"><div className="admin-nav-group"><p>Vista staff</p>{STAFF_NAV.map(item => <button key={item.tab} className={activeTab === item.tab ? 'active' : ''} onClick={() => onTabChange(item.tab)}>{item.icon}<span>{item.tab}</span></button>)}</div><div className="admin-nav-group"><p>Acceso</p><Link href={`/${tenant.slug}`}><ChevronLeft size={16} /> Vista pública</Link><button className="zone-exit" onClick={() => exitZone('staff', tenant.slug, `/${tenant.slug}`)}>Salir de staff</button></div></nav></aside><main className="admin-main admin-main-premium"><header className="admin-command-center staff-command-center"><div><span className="eyebrow">Vista staff</span><h1>{activeTab}</h1><p>Operación diaria reducida, sin configuración sensible.</p></div><div className="admin-command-actions"><span className="badge badge-sky"><span className="dot dot-green" /> Turno activo</span><button className="btn btn-sm btn-secondary" onClick={() => exitZone('staff', tenant.slug, `/${tenant.slug}`)}>Salir</button></div></header>{children}</main></div>; }
