import { useState, type ReactNode } from 'react';
import { Route, Switch, Link, useParams } from 'wouter';
import { toast } from 'sonner';
import {
  CalendarDays,
  Sparkles,
  Users,
  Clock,
  Wallet,
  MessageCircle,
  MapPin,
  Building2,
  BarChart3,
  Image,
  UserCheck,
  Dumbbell,
  Ticket,
  Package,
  Upload,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from './domain/core';
import { BookingExperience } from './components/BookingExperience';
import { AdminWorkspace } from './components/AdminWorkspace';
import { useAtlasStore } from './state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

function Shell({ children, area = 'public' }: { children: ReactNode; area?: 'public' | 'client' | 'admin' | 'super' }) {
  return <main className={`app-shell area-${area}`}>{children}</main>;
}

function RoleNav({ area, tenantSlug }: { area: 'public' | 'client' | 'admin' | 'super'; tenantSlug?: string }) {
  const businessUrl = tenantSlug ? `/${tenantSlug}` : '/ink-beauty-studio';
  return (
    <nav className={`topbar role-${area}`}>
      <Link href="/" className="brand-link">Atlas Agenda OS</Link>
      <div className="nav-actions">
        {area === 'public' && <><Link href="/ink-beauty-studio">Citas</Link><Link href="/atlas-fight-academy">Academia</Link><Link href="/client/demo">Portal cliente</Link></>}
        {area === 'client' && <><Link href="/client/demo">Mi cuenta</Link><Link href="/ink-beauty-studio">Reservar</Link><Link href="/atlas-fight-academy">Membresía</Link></>}
        {area === 'admin' && <><Link href={businessUrl}>Vista pública</Link><Link href={`/admin/${tenantSlug || 'ink-beauty-studio'}`}>Panel</Link><Link href="/super-admin">Digital Atlas</Link></>}
        {area === 'super' && <><Link href="/super-admin">Tenants</Link><Link href="/ink-beauty-studio">Demo pública</Link><Link href="/admin/ink-beauty-studio">Admin demo</Link></>}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <Shell area="public">
      <RoleNav area="public" />
      <section className="hero home-hero">
        <div>
          <span className="eyebrow">Digital Atlas product lab</span>
          <h1>{APP_NAME}</h1>
          <p>{APP_TAGLINE}. Un SaaS multi-tenant con áreas separadas: público, cliente, admin de negocio y superadmin Digital Atlas.</p>
          <div className="actions">
            <Link href="/ink-beauty-studio" className="btn primary">Ver tenant de citas</Link>
            <Link href="/atlas-fight-academy" className="btn secondary">Ver tenant de membresías</Link>
          </div>
        </div>
        <aside className="hero-console">
          <span className="console-label">Lógica tipo SmartMenu</span>
          <h3>Un core, paneles separados</h3>
          <p>Cada slug carga su negocio. Cada admin controla solo su tenant y sus clientes.</p>
          <div className="mini-flow"><span>Público</span><span>Cliente</span><span>Admin</span><span>Superadmin</span></div>
        </aside>
      </section>
      <section className="grid three">
        <Feature icon={<CalendarDays />} title="Citas" text="Servicios, profesionales, horarios, depósitos y seguimiento." />
        <Feature icon={<Dumbbell />} title="Membresías" text="Mensualidades, comprobantes SINPE, productos y eventos." />
        <Feature icon={<Users />} title="Cliente global" text="Perfil transversal con historial por negocio." />
      </section>
    </Shell>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function PublicBusiness() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  return tenant.vertical === 'membership' ? <MembershipTenant tenantSlug={tenant.slug} /> : <AppointmentTenant tenantSlug={tenant.slug} />;
}

function AppointmentTenant({ tenantSlug }: { tenantSlug: string }) {
  const { getTenant, services } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const tenantServices = services.filter(service => service.tenantSlug === tenant.slug);
  return (
    <Shell area="public">
      <RoleNav area="public" tenantSlug={tenant.slug} />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">{tenant.label}</span>
          <h1>{tenant.name}</h1>
          <p>{tenant.description}</p>
          <p className="muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="module-row">{tenant.modules.map(module => <span key={module}>{module}</span>)}</div>
          <div className="actions"><a className="btn primary" href="#servicios">Reservar servicio</a><Link href={`/${tenant.slug}/info`} className="btn secondary">Ver landing</Link></div>
        </div>
        <div className="status-panel"><span className="pill success">Agenda abierta</span><h3>Próximo espacio</h3><strong>Hoy · 4:00 PM</strong><p>Depósito desde {money(5000)} para confirmar la cita.</p></div>
      </section>
      <section id="servicios" className="section-head"><span className="eyebrow">Catálogo público</span><h2>Servicios reservables</h2><p>Esta es la vista pública. No muestra controles de admin ni datos internos.</p></section>
      <div className="grid services">{tenantServices.map(service => <ServiceCard key={service.id} service={service} />)}</div>
    </Shell>
  );
}

function MembershipTenant({ tenantSlug }: { tenantSlug: string }) {
  const { getTenant, memberships, products, events } = useAtlasStore();
  const tenant = getTenant(tenantSlug);
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenant.slug);
  const tenantProducts = products.filter(item => item.tenantSlug === tenant.slug);
  const tenantEvents = events.filter(item => item.tenantSlug === tenant.slug);
  return (
    <Shell area="public">
      <RoleNav area="public" tenantSlug={tenant.slug} />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">{tenant.label}</span>
          <h1>{tenant.name}</h1>
          <p>{tenant.description}</p>
          <p className="muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="module-row">{tenant.modules.map(module => <span key={module}>{module}</span>)}</div>
          <div className="actions"><Link href="/client/demo" className="btn primary">Entrar a mi cuenta</Link><Link href={`/${tenant.slug}/info`} className="btn secondary">Ver información</Link></div>
        </div>
        <div className="status-panel"><span className="pill success">Membresías</span><h3>Portal de pagos</h3><strong>{tenantMemberships.length} clientes demo</strong><p>El cliente sube comprobante SINPE desde su cuenta, no desde la página pública.</p></div>
      </section>
      <section className="grid three">
        <PublicList icon={<Package />} title="Productos" items={tenantProducts.map(item => `${item.name} · ${money(item.price)}`)} />
        <PublicList icon={<Ticket />} title="Eventos" items={tenantEvents.map(item => `${item.title} · ${item.date}`)} />
        <PublicList icon={<Wallet />} title="Pagos" items={['Mensualidad por SINPE', 'Comprobante desde portal cliente', 'Aprobación por admin']} />
      </section>
    </Shell>
  );
}

function PublicList({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return <article className="card">{icon}<h3>{title}</h3>{items.map(item => <p key={item}>{item}</p>)}</article>;
}

function ServiceCard({ service }: { service: ReturnType<typeof useAtlasStore>['services'][number] }) {
  return <article className="card service-card"><span className="pill">{service.category}</span><h3>{service.name}</h3><p>{service.duration} min · depósito {money(service.deposit)}</p><strong>Desde {money(service.price)}</strong><div className="service-meta"><span><Clock size={14} /> Agenda</span><span><Wallet size={14} /> SINPE</span></div><Link href={`/booking/${service.id}`} className="btn primary small">Reservar ahora</Link></article>;
}

function BusinessInfo() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  return (
    <Shell area="public">
      <RoleNav area="public" tenantSlug={tenant.slug} />
      <section className="business-hero split-hero">
        <div><span className="eyebrow">Landing pública</span><h1>{tenant.name}</h1><p>Página informativa del negocio: contenido, ubicación, CTA y módulos públicos.</p><div className="actions"><Link href={`/${tenant.slug}`} className="btn secondary">Volver</Link></div></div>
        <div className="mock-gallery"><Image /><span>Hero + portafolio + mapa + CTA</span></div>
      </section>
      <div className="grid three"><Feature icon={<Image />} title="Contenido" text="Fotos, portafolio, instalaciones o certificaciones." /><Feature icon={<MessageCircle />} title="Acción" text="Agendar, consultar o entrar al portal cliente." /><Feature icon={<Settings />} title="Configuración" text="Editable desde el admin del tenant." /></div>
    </Shell>
  );
}

function BookingStatus() {
  return <Shell area="public"><RoleNav area="public" /><BookingExperience /></Shell>;
}

function ClientPortal() {
  const { memberships, uploadReceipt } = useAtlasStore();
  const pending = memberships.find(item => item.status !== 'paid');
  return (
    <Shell area="client">
      <RoleNav area="client" />
      <section className="business-hero split-hero"><div><span className="eyebrow">Portal cliente</span><h1>Mi espacio Atlas</h1><p>El cliente ve sus citas, pagos, comprobantes, productos, puntos y promociones. No ve el panel admin.</p></div><div className="status-panel"><span className="pill success">Maria Lopez</span><h3>Cuenta cliente</h3><p>2 negocios conectados · 240 puntos · 1 pago pendiente</p></div></section>
      <div className="dashboard-grid">
        <article className="card"><CalendarDays /><h3>Mis citas</h3><p>Ink Beauty Studio · Piercing nariz · Confirmada</p><p>Flash day tattoo · Próximamente</p></article>
        <article className="card"><Upload /><h3>Subir comprobante</h3><p>{pending ? `${pending.plan} · ${pending.due}` : 'No hay pagos pendientes'}</p><button className="btn primary full" disabled={!pending} onClick={() => { if (!pending) return; uploadReceipt(pending.id, 'sinpe-demo.jpg'); toast.success('Comprobante subido a revisión'); }}>Subir comprobante demo</button></article>
        <article className="card"><Sparkles /><h3>Promos y puntos</h3><p>240 puntos disponibles.</p><p>Promo aftercare activa.</p></article>
      </div>
    </Shell>
  );
}

function AdminDashboard() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  const tenantAppointments = store.appointments.filter(item => item.tenantSlug === tenant.slug);
  const tenantMemberships = store.memberships.filter(item => item.tenantSlug === tenant.slug);
  return (
    <Shell area="admin">
      <RoleNav area="admin" tenantSlug={tenant.slug} />
      <section className="admin-hero"><span className="eyebrow">Admin del tenant · {tenant.label}</span><h1>{tenant.name}</h1><p>Este panel administra únicamente este local y sus clientes. Es la separación tipo SmartMenu.</p></section>
      <div className="kpi-grid"><Kpi icon={isMembership ? <Dumbbell /> : <CalendarDays />} label={isMembership ? 'Membresías' : 'Citas'} value={String(isMembership ? tenantMemberships.length : tenantAppointments.length)} /><Kpi icon={<Wallet />} label={isMembership ? 'Comprobantes pendientes' : 'Depósitos pendientes'} value={String(isMembership ? tenantMemberships.filter(item => item.status !== 'paid').length : tenantAppointments.filter(item => item.status !== 'confirmed').length)} /><Kpi icon={<Users />} label="Clientes" value={String(isMembership ? tenantMemberships.length : new Set(tenantAppointments.map(a => a.client)).size)} /><Kpi icon={<Sparkles />} label="Promos" value="4" /></div>
      <AdminWorkspace tenant={tenant} />
    </Shell>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="kpi-card">{icon}<span>{label}</span><strong>{value}</strong></article>;
}

function SuperAdmin() {
  const { tenants, addTenant, resetDemo } = useAtlasStore();
  const [name, setName] = useState('');
  const [vertical, setVertical] = useState<'appointments' | 'membership'>('appointments');
  return (
    <Shell area="super">
      <RoleNav area="super" />
      <section className="business-hero"><span className="eyebrow">Digital Atlas control center</span><h1>Superadmin</h1><p>Área interna para crear tenants, asignar vertical y controlar el SaaS. No pertenece al público ni al cliente.</p></section>
      <div className="dashboard-grid"><article className="card wide-card"><Building2 /><h3>Tenants activos</h3>{Object.values(tenants).map(tenant => <div className="agenda-row" key={tenant.slug}><span>{tenant.vertical}</span><strong>{tenant.name}</strong><Link href={`/admin/${tenant.slug}`}>Abrir admin</Link></div>)}</article><article className="card"><PlusCircle /><h3>Crear tenant demo</h3><div className="stack-form"><input placeholder="Nombre del negocio" value={name} onChange={e => setName(e.target.value)} /><select value={vertical} onChange={e => setVertical(e.target.value as 'appointments' | 'membership')}><option value="appointments">Citas</option><option value="membership">Membresías</option></select><button className="btn primary full" onClick={() => { if (!name) return toast.error('Escribí un nombre'); const slug = addTenant({ name, vertical, description: 'Nuevo tenant creado desde Digital Atlas.' }); setName(''); toast.success(`Tenant creado: ${slug}`); }}>Crear negocio</button><button className="btn secondary full" onClick={resetDemo}>Reset demo</button></div></article><article className="card"><BarChart3 /><h3>Métricas SaaS</h3><p>Tenants: {Object.keys(tenants).length}</p><p>Modelo: multi-tenant modular</p></article><article className="card"><UserCheck /><h3>Planes</h3><p>Starter · Operations · Growth</p><p>Capabilities por vertical</p></article></div>
    </Shell>
  );
}

export default function App() {
  return <Switch><Route path="/" component={Home} /><Route path="/client/demo" component={ClientPortal} /><Route path="/:slug/info" component={BusinessInfo} /><Route path="/booking/:id" component={BookingStatus} /><Route path="/admin/:slug" component={AdminDashboard} /><Route path="/super-admin" component={SuperAdmin} /><Route path="/:slug" component={PublicBusiness} /></Switch>;
}
