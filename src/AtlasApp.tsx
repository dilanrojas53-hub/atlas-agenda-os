import { useState, type ReactNode } from 'react';
import { Link, Route, Switch, useParams } from 'wouter';
import { toast } from 'sonner';
import { BarChart3, Building2, CalendarDays, Dumbbell, Image, MapPin, Package, PlusCircle, Sparkles, Ticket, Upload, UserCheck, Users, Wallet } from 'lucide-react';
import { BookingExperience } from './components/BookingExperience';
import { AdminWorkspace } from './components/AdminWorkspace';
import { StaffPortal } from './components/StaffPortal';
import { AdminLogin, ClientLogin, SuperAdminLogin } from './components/LoginScreens';
import { AdminLayout, SuperAdminLayout } from './layouts/AdminLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { APP_NAME, APP_TAGLINE } from './domain/core';
import { useAtlasStore } from './state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

function Home() {
  return (
    <PublicLayout>
      <section className="public-hero">
        <div className="public-hero-copy">
          <span className="eyebrow">Digital Atlas product lab</span>
          <h1>{APP_NAME}</h1>
          <p>{APP_TAGLINE}. Un core multi-tenant con vistas separadas para público, cliente, admin, staff y superadmin.</p>
          <div className="hero-actions"><Link className="btn btn-primary" href="/ink-beauty-studio">Ver tenant de citas</Link><Link className="btn btn-secondary" href="/atlas-fight-academy">Ver tenant de membresías</Link></div>
        </div>
        <aside className="hero-panel"><span className="badge badge-violet">SaaS modular</span><h3>Separado por rol</h3><p>El slug decide el negocio, el vertical y los módulos activos.</p></aside>
      </section>
      <section className="feature-grid"><Mini icon={<CalendarDays />} title="Citas" text="Agenda, servicios, profesionales y depósitos." /><Mini icon={<Dumbbell />} title="Membresías" text="Mensualidades, comprobantes, eventos y productos." /><Mini icon={<Users />} title="Cliente global" text="Historial y beneficios por negocio." /></section>
    </PublicLayout>
  );
}

function Mini({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function ListCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return <article className="card">{icon}<h3>{title}</h3>{items.length ? items.map((item) => <p key={item}>{item}</p>) : <p>Sin registros todavía.</p>}</article>;
}

function PublicTenant() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  const services = store.services.filter((item) => item.tenantSlug === tenant.slug);
  const products = store.products.filter((item) => item.tenantSlug === tenant.slug);
  const events = store.events.filter((item) => item.tenantSlug === tenant.slug);
  const memberships = store.memberships.filter((item) => item.tenantSlug === tenant.slug);

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name}>
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">{tenant.label}</span>
          <h1>{tenant.heroTitle || tenant.name}</h1>
          <p>{tenant.description}</p>
          <p className="inline-muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="module-row">{tenant.modules.map((module) => <span key={module}>{module}</span>)}</div>
          <div className="hero-actions"><Link className="btn btn-primary" href={isMembership ? '/client/login' : '#catalog'}>{tenant.ctaLabel || (isMembership ? 'Entrar a mi cuenta' : 'Reservar')}</Link><Link className="btn btn-secondary" href={`/${tenant.slug}/info`}>Más información</Link></div>
        </div>
        <aside className="tenant-status-card"><span className="badge badge-green">{isMembership ? 'Membresías' : 'Agenda'}</span><h3>{isMembership ? 'Portal de pagos' : 'Próximo espacio'}</h3><strong>{isMembership ? `${memberships.length} clientes` : 'Hoy · 4:00 PM'}</strong><p>{isMembership ? 'Comprobantes desde portal cliente y aprobación por admin.' : 'Depósito por SINPE para confirmar.'}</p></aside>
      </section>
      {isMembership ? (
        <section className="feature-grid"><ListCard icon={<Package />} title="Productos" items={products.map((p) => `${p.name} · ${money(p.price)}`)} /><ListCard icon={<Ticket />} title="Eventos" items={events.map((e) => `${e.title} · ${e.date}`)} /><ListCard icon={<Wallet />} title="Pagos" items={['Mensualidad SINPE', 'Comprobante en portal', 'Validación por admin']} /></section>
      ) : (
        <section id="catalog" className="catalog-grid">{services.map((service) => <article className="card service-card" key={service.id}><span className="badge badge-amber">{service.category}</span><h3>{service.name}</h3><p>{service.duration} min · depósito {money(service.deposit)}</p><strong>Desde {money(service.price)}</strong><Link className="btn btn-primary btn-sm" href={`/booking/${service.id}`}>Reservar</Link></article>)}</section>
      )}
    </PublicLayout>
  );
}

function InfoPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return <PublicLayout slug={tenant.slug} businessName={tenant.name}><section className="public-tenant-hero"><div><span className="eyebrow">Landing pública</span><h1>{tenant.name}</h1><p>Contenido editable desde el admin: hero, CTA, ubicación, galería, módulos y WhatsApp.</p><Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver</Link></div><div className="hero-panel"><Image /><span>Bloques configurables</span></div></section></PublicLayout>;
}

function ClientPortal() {
  const { memberships, uploadReceipt } = useAtlasStore();
  const [section, setSection] = useState('resumen');
  const pending = memberships.find((item) => item.status !== 'paid');
  return (
    <ClientLayout activeSection={section} onSectionChange={setSection} clientName="Maria Lopez">
      <section className="client-hero"><div><span className="eyebrow">Portal cliente</span><h1>Mi espacio Atlas</h1><p>Citas, pagos, comprobantes, productos, puntos y promociones por negocio.</p></div><div className="client-score"><span>240</span><small>puntos</small></div></section>
      {section === 'pagos' ? <div className="dashboard-grid"><article className="card"><Upload /><h3>Comprobante SINPE</h3><p>{pending ? `${pending.plan} · ${pending.due}` : 'No hay pagos pendientes'}</p><button className="btn btn-primary btn-full" disabled={!pending} onClick={() => { if (!pending) return; uploadReceipt(pending.id, 'sinpe-demo.jpg'); toast.success('Comprobante subido a revisión'); }}>Subir comprobante demo</button></article><ListCard icon={<Wallet />} title="Historial" items={['Depósito cita · Pendiente', 'Mensualidad · En revisión']} /></div> : <div className="dashboard-grid"><ListCard icon={<CalendarDays />} title="Mis citas" items={['Ink Beauty Studio · Cita confirmada', 'Flash day · Próximamente']} /><ListCard icon={<Dumbbell />} title="Mis membresías" items={memberships.map((m) => `${m.plan} · ${m.due}`)} /><ListCard icon={<Sparkles />} title="Promos y puntos" items={['240 puntos disponibles', 'Promo de bienvenida activa']} /></div>}
    </ClientLayout>
  );
}

function AdminPage() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const [activeTab, setActiveTab] = useState(tenant.vertical === 'membership' ? 'Membresías' : 'Agenda');
  const isMembership = tenant.vertical === 'membership';
  const count = isMembership ? store.memberships.filter((item) => item.tenantSlug === tenant.slug).length : store.appointments.filter((item) => item.tenantSlug === tenant.slug).length;
  return <AdminLayout tenant={tenant} activeTab={activeTab} onTabChange={setActiveTab}><div className="kpi-grid"><Kpi icon={isMembership ? <Dumbbell /> : <CalendarDays />} label={isMembership ? 'Membresías' : 'Citas'} value={String(count)} /><Kpi icon={<Wallet />} label="Pagos pendientes" value="1" /><Kpi icon={<Users />} label="Clientes" value={String(count)} /><Kpi icon={<Sparkles />} label="Promos" value="4" /></div><AdminWorkspace tenant={tenant} activeTab={activeTab} /></AdminLayout>;
}

function StaffPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return <StaffPortal tenantSlug={tenant.slug} />;
}

function SuperAdmin() {
  const { tenants, addTenant, resetDemo, dataSource } = useAtlasStore();
  const [name, setName] = useState('');
  const [vertical, setVertical] = useState<'appointments' | 'membership'>('appointments');
  const [plan, setPlan] = useState<'starter' | 'operations' | 'growth'>('operations');
  const modules = vertical === 'membership' ? ['Landing', 'Portal', 'Membresías', 'Comprobantes', 'Productos', 'Eventos'] : ['Landing', 'Portal', 'Agenda', 'Servicios', 'Profesionales', 'Depósitos'];
  return <SuperAdminLayout><section className="page-header"><div className="flex-between"><div><span className="eyebrow">Digital Atlas control center</span><h2>Superadmin</h2><p>Crea tenants, define vertical, plan y acceso al workspace correcto.</p></div><span className="badge badge-violet">Data: {dataSource}</span></div></section><div className="dashboard-grid"><article className="card wide-card"><Building2 /><h3>Tenants activos</h3>{Object.values(tenants).map((tenant) => <div className="agenda-row" key={tenant.slug}><span>{tenant.vertical}</span><strong>{tenant.name}</strong><Link href={`/admin/${tenant.slug}`}>Abrir admin</Link></div>)}</article><article className="card"><PlusCircle /><h3>Crear tenant</h3><div className="stack-form"><input className="input" placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} /><select className="input" value={vertical} onChange={(event) => setVertical(event.target.value as 'appointments' | 'membership')}><option value="appointments">Citas</option><option value="membership">Membresías</option></select><select className="input" value={plan} onChange={(event) => setPlan(event.target.value as 'starter' | 'operations' | 'growth')}><option value="starter">Starter</option><option value="operations">Operations</option><option value="growth">Growth</option></select><div className="module-row">{modules.map((module) => <span key={module}>{module}</span>)}</div><button className="btn btn-primary btn-full" onClick={() => { if (!name) return toast.error('Escribí un nombre'); const createdSlug = addTenant({ name, vertical, plan, description: 'Tenant creado desde Digital Atlas.' }); setName(''); toast.success(`Tenant creado: ${createdSlug}`); }}>Crear</button><button className="btn btn-secondary btn-full" onClick={resetDemo}>Reset demo</button></div></article><ListCard icon={<BarChart3 />} title="Métricas SaaS" items={[`Tenants: ${Object.keys(tenants).length}`, 'Separación por rol activa', 'Supabase fallback activo']} /><ListCard icon={<UserCheck />} title="Próximo salto" items={['Auth por tenant', 'RLS avanzado', 'Escritura real a Supabase']} /></div></SuperAdminLayout>;
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="kpi-card">{icon}<span>{label}</span><strong>{value}</strong></article>;
}

export default function AtlasApp() {
  return <Switch><Route path="/" component={Home} /><Route path="/client/login" component={ClientLogin} /><Route path="/client/demo" component={ClientPortal} /><Route path="/:slug/info" component={InfoPage} /><Route path="/booking/:id" component={() => <PublicLayout><BookingExperience /></PublicLayout>} /><Route path="/admin/:slug/login" component={AdminLogin} /><Route path="/admin/:slug" component={AdminPage} /><Route path="/staff/:slug" component={StaffPage} /><Route path="/super-admin/login" component={SuperAdminLogin} /><Route path="/super-admin" component={SuperAdmin} /><Route path="/:slug" component={PublicTenant} /></Switch>;
}
