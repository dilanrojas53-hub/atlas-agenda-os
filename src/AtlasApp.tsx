import { useState, type ReactNode } from 'react';
import { Link, Route, Switch, useParams } from 'wouter';
import { toast } from 'sonner';
import { BarChart3, Building2, CalendarDays, Clock, Dumbbell, Image, MapPin, Package, PlusCircle, Settings, Sparkles, Ticket, Upload, UserCheck, Users, Wallet } from 'lucide-react';
import { BookingExperience } from './components/BookingExperience';
import { AdminWorkspace } from './components/AdminWorkspace';
import { StaffPortal } from './components/StaffPortal';
import { APP_NAME, APP_TAGLINE } from './domain/core';
import { useAtlasStore } from './state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;
type Area = 'public' | 'client' | 'admin' | 'super';

function Shell({ area, children }: { area: Area; children: ReactNode }) {
  return <main className={`app-shell area-${area}`}>{children}</main>;
}

function Nav({ area, slug }: { area: Area; slug?: string }) {
  return (
    <nav className={`topbar role-${area}`}>
      <Link href="/" className="brand-link">Atlas Agenda OS</Link>
      <div className="nav-actions">
        {area === 'public' && <><Link href="/ink-beauty-studio">Citas</Link><Link href="/atlas-fight-academy">Academia</Link><Link href="/client/demo">Cliente</Link></>}
        {area === 'client' && <><Link href="/client/demo">Mi cuenta</Link><Link href="/ink-beauty-studio">Reservar</Link><Link href="/atlas-fight-academy">Membresía</Link></>}
        {area === 'admin' && <><Link href={`/${slug}`}>Público</Link><Link href={`/admin/${slug}`}>Admin</Link><Link href={`/staff/${slug}`}>Staff</Link><Link href="/super-admin">Digital Atlas</Link></>}
        {area === 'super' && <><Link href="/super-admin">Tenants</Link><Link href="/admin/ink-beauty-studio">Admin demo</Link><Link href="/ink-beauty-studio">Público</Link></>}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <Shell area="public">
      <Nav area="public" />
      <section className="hero home-hero">
        <div><span className="eyebrow">Digital Atlas product lab</span><h1>{APP_NAME}</h1><p>{APP_TAGLINE}. Un core multi-tenant con zonas separadas: público, cliente, admin, staff y superadmin.</p><div className="actions"><Link className="btn primary" href="/ink-beauty-studio">Tenant citas</Link><Link className="btn secondary" href="/atlas-fight-academy">Tenant academia</Link></div></div>
        <aside className="hero-console"><span className="console-label">Modelo SaaS</span><h3>Como SmartMenu, pero por vertical</h3><p>El slug decide qué negocio, módulos y datos se cargan.</p><div className="mini-flow"><span>Tenant</span><span>Vertical</span><span>Rol</span><span>Módulos</span></div></aside>
      </section>
      <section className="grid three"><Mini icon={<CalendarDays />} title="Citas" text="Servicios, agenda, profesionales y depósitos." /><Mini icon={<Dumbbell />} title="Membresías" text="Mensualidades, comprobantes, eventos y productos." /><Mini icon={<Users />} title="Cliente global" text="Historial y beneficios cruzados por tenant." /></section>
    </Shell>
  );
}

function Mini({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function PublicTenant() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  const services = store.services.filter(item => item.tenantSlug === tenant.slug);
  const products = store.products.filter(item => item.tenantSlug === tenant.slug);
  const events = store.events.filter(item => item.tenantSlug === tenant.slug);
  const memberships = store.memberships.filter(item => item.tenantSlug === tenant.slug);
  return (
    <Shell area="public">
      <Nav area="public" slug={tenant.slug} />
      <section className="business-hero split-hero">
        <div><span className="eyebrow">{tenant.label}</span><h1>{tenant.heroTitle || tenant.name}</h1><p>{tenant.description}</p><p className="muted"><MapPin size={16} /> {tenant.address}</p><div className="module-row">{tenant.modules.map(m => <span key={m}>{m}</span>)}</div><div className="actions"><Link className="btn primary" href={isMembership ? '/client/demo' : '#catalog'}>{tenant.ctaLabel || (isMembership ? 'Entrar a mi cuenta' : 'Reservar')}</Link><Link className="btn secondary" href={`/${tenant.slug}/info`}>Más información</Link></div></div>
        <aside className="status-panel"><span className="pill success">{isMembership ? 'Membresías' : 'Agenda'}</span><h3>{isMembership ? 'Portal de pagos' : 'Próximo espacio'}</h3><strong>{isMembership ? `${memberships.length} clientes` : 'Hoy · 4:00 PM'}</strong><p>{isMembership ? 'Comprobantes desde portal cliente y aprobación por admin.' : 'Depósito por SINPE para confirmar.'}</p></aside>
      </section>
      {isMembership ? <section className="grid three"><ListCard icon={<Package />} title="Productos" items={products.map(p => `${p.name} · ${money(p.price)}`)} /><ListCard icon={<Ticket />} title="Eventos" items={events.map(e => `${e.title} · ${e.date}`)} /><ListCard icon={<Wallet />} title="Pagos" items={['Mensualidad SINPE', 'Comprobante en portal', 'Validación por admin']} /></section> : <section id="catalog" className="grid services">{services.map(s => <article className="card service-card" key={s.id}><span className="pill">{s.category}</span><h3>{s.name}</h3><p>{s.duration} min · depósito {money(s.deposit)}</p><strong>Desde {money(s.price)}</strong><Link className="btn primary small" href={`/booking/${s.id}`}>Reservar</Link></article>)}</section>}
    </Shell>
  );
}

function ListCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return <article className="card">{icon}<h3>{title}</h3>{items.length ? items.map(i => <p key={i}>{i}</p>) : <p>Sin registros todavía.</p>}</article>;
}

function InfoPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return <Shell area="public"><Nav area="public" slug={tenant.slug} /><section className="business-hero split-hero"><div><span className="eyebrow">Landing pública</span><h1>{tenant.name}</h1><p>Contenido editable desde el admin: hero, CTA, ubicación, galería, módulos y WhatsApp.</p><Link className="btn secondary" href={`/${tenant.slug}`}>Volver</Link></div><div className="mock-gallery"><Image /><span>Bloques configurables</span></div></section></Shell>;
}

function ClientPortal() {
  const { memberships, uploadReceipt } = useAtlasStore();
  const pending = memberships.find(item => item.status !== 'paid');
  return <Shell area="client"><Nav area="client" /><section className="business-hero split-hero"><div><span className="eyebrow">Portal cliente</span><h1>Mi espacio Atlas</h1><p>Citas, pagos, comprobantes, productos, puntos, promociones y documentos por tenant.</p></div><aside className="status-panel"><span className="pill success">Cliente demo</span><h3>Maria Lopez</h3><p>2 negocios conectados · 240 puntos</p></aside></section><div className="dashboard-grid"><ListCard icon={<CalendarDays />} title="Mis citas" items={['Ink Beauty Studio · Piercing nariz · Confirmada', 'Flash day tattoo · Próximamente']} /><article className="card"><Upload /><h3>Comprobante SINPE</h3><p>{pending ? `${pending.plan} · ${pending.due}` : 'No hay pagos pendientes'}</p><button className="btn primary full" disabled={!pending} onClick={() => { if (!pending) return; uploadReceipt(pending.id, 'sinpe-demo.jpg'); toast.success('Comprobante subido a revisión'); }}>Subir comprobante demo</button></article><ListCard icon={<Sparkles />} title="Promos y puntos" items={['240 puntos disponibles', 'Promo aftercare activa']} /></div></Shell>;
}

function AdminPage() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  const count = isMembership ? store.memberships.filter(i => i.tenantSlug === tenant.slug).length : store.appointments.filter(i => i.tenantSlug === tenant.slug).length;
  return <Shell area="admin"><Nav area="admin" slug={tenant.slug} /><section className="admin-hero"><span className="eyebrow">Admin del tenant · {tenant.label}</span><h1>{tenant.name}</h1><p>Controla solo este negocio, sus clientes, pagos, módulos y configuración.</p></section><div className="kpi-grid"><Kpi icon={isMembership ? <Dumbbell /> : <CalendarDays />} label={isMembership ? 'Membresías' : 'Citas'} value={String(count)} /><Kpi icon={<Wallet />} label="Pagos pendientes" value="1" /><Kpi icon={<Users />} label="Clientes" value={String(count)} /><Kpi icon={<Sparkles />} label="Promos" value="4" /></div><AdminWorkspace tenant={tenant} /></Shell>;
}

function StaffPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return <Shell area="admin"><Nav area="admin" slug={tenant.slug} /><StaffPortal tenantSlug={tenant.slug} /></Shell>;
}

function SuperAdmin() {
  const { tenants, addTenant, resetDemo } = useAtlasStore();
  const [name, setName] = useState('');
  const [vertical, setVertical] = useState<'appointments' | 'membership'>('appointments');
  const [plan, setPlan] = useState<'starter' | 'operations' | 'growth'>('operations');
  const modules = vertical === 'membership' ? ['Landing', 'Portal', 'Membresías', 'Comprobantes', 'Productos', 'Eventos'] : ['Landing', 'Portal', 'Agenda', 'Servicios', 'Profesionales', 'Depósitos'];
  return <Shell area="super"><Nav area="super" /><section className="business-hero"><span className="eyebrow">Digital Atlas control center</span><h1>Superadmin</h1><p>Crea tenants, define vertical, plan y acceso al workspace correcto.</p></section><div className="dashboard-grid"><article className="card wide-card"><Building2 /><h3>Tenants activos</h3>{Object.values(tenants).map(t => <div className="agenda-row" key={t.slug}><span>{t.vertical}</span><strong>{t.name}</strong><Link href={`/admin/${t.slug}`}>Abrir admin</Link></div>)}</article><article className="card"><PlusCircle /><h3>Crear tenant</h3><div className="stack-form"><input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} /><select value={vertical} onChange={e => setVertical(e.target.value as 'appointments' | 'membership')}><option value="appointments">Citas</option><option value="membership">Membresías</option></select><select value={plan} onChange={e => setPlan(e.target.value as 'starter' | 'operations' | 'growth')}><option value="starter">Starter</option><option value="operations">Operations</option><option value="growth">Growth</option></select><div className="module-row">{modules.map(m => <span key={m}>{m}</span>)}</div><button className="btn primary full" onClick={() => { if (!name) return toast.error('Escribí un nombre'); const slug = addTenant({ name, vertical, plan, description: 'Tenant creado desde Digital Atlas.' }); setName(''); toast.success(`Tenant creado: ${slug}`); }}>Crear</button><button className="btn secondary full" onClick={resetDemo}>Reset demo</button></div></article><ListCard icon={<BarChart3 />} title="Métricas SaaS" items={[`Tenants: ${Object.keys(tenants).length}`, 'Separación por rol activa', 'Persistencia local lista']} /><ListCard icon={<UserCheck />} title="Próximo salto" items={['Supabase Auth', 'RLS por tenant', 'Base de datos real']} /></div></Shell>;
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="kpi-card">{icon}<span>{label}</span><strong>{value}</strong></article>;
}

export default function AtlasApp() {
  return <Switch><Route path="/" component={Home} /><Route path="/client/demo" component={ClientPortal} /><Route path="/:slug/info" component={InfoPage} /><Route path="/booking/:id" component={() => <Shell area="public"><Nav area="public" /><BookingExperience /></Shell>} /><Route path="/admin/:slug" component={AdminPage} /><Route path="/staff/:slug" component={StaffPage} /><Route path="/super-admin" component={SuperAdmin} /><Route path="/:slug" component={PublicTenant} /></Switch>;
}
