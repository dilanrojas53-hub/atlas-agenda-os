import { useState, type ReactNode } from 'react';
import { Link, Route, Switch, useParams } from 'wouter';
import { toast } from 'sonner';
import { BarChart3, Building2, CalendarDays, Dumbbell, Image, MapPin, Package, PlusCircle, Sparkles, Ticket, UserCheck, Users, Wallet } from 'lucide-react';
import { BookingExperience } from './components/BookingExperience';
import { AdminWorkspace } from './components/AdminWorkspace';
import { StaffPortal } from './components/StaffPortal';
import { AdminLogin, ClientLogin, SuperAdminLogin } from './components/LoginScreens';
import { CustomerDashboardRenderer } from './components/CustomerDashboardRenderer';
import { AdminLayout, SuperAdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { resolveCustomerDashboard } from './platform/customerExperience';
import { useAtlasStore } from './state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

function Mini({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function ListCard({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return <article className="card">{icon}<h3>{title}</h3>{items.length ? items.map((item) => <p key={item}>{item}</p>) : <p>Sin registros todavía.</p>}</article>;
}

function Home() {
  return (
    <PublicLayout>
      <section className="public-hero">
        <div className="public-hero-copy">
          <span className="eyebrow">Digital Atlas para negocios de servicios</span>
          <h1>Agenda, pagos y clientes en un solo sistema</h1>
          <p>Gestioná reservas, membresías, pagos SINPE, clientes y promociones desde una plataforma clara para negocios de servicios.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/client/atlas-fight-academy">Ver portal cliente</Link>
            <Link className="btn btn-secondary" href="/ink-beauty-studio">Ver negocio de ejemplo</Link>
          </div>
        </div>
        <aside className="hero-panel">
          <span className="badge badge-violet">Producto SaaS</span>
          <h3>Una plataforma, varias experiencias</h3>
          <p>Landing pública, cuenta del cliente, panel del negocio, vista staff y control interno.</p>
        </aside>
      </section>
      <section id="features" className="feature-grid">
        <Mini icon={<CalendarDays />} title="Negocios de citas" text="Servicios, agenda, profesionales y depósitos de reserva." />
        <Mini icon={<Dumbbell />} title="Gimnasios y academias" text="Membresías, clases, pagos SINPE, eventos y productos." />
        <Mini icon={<Users />} title="Portal cliente" text="Cada persona ve sus próximos pasos, pagos, beneficios e historial." />
      </section>
    </PublicLayout>
  );
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

  if (isMembership) {
    return (
      <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
        <section className="public-tenant-hero">
          <div>
            <span className="eyebrow">Gym y academia</span>
            <h1>{tenant.name}</h1>
            <p>Entrenamiento, membresías y clases en un solo lugar. Consultá tus planes, pagos, clases y eventos desde tu cuenta de alumno.</p>
            <p className="inline-muted"><MapPin size={16} /> {tenant.address}</p>
            <div className="hero-actions"><a className="btn btn-primary" href="#plans">Ver planes</a><Link className="btn btn-secondary" href={`/client/${tenant.slug}`}>Entrar a mi cuenta</Link></div>
          </div>
          <aside className="tenant-status-card"><span className="badge badge-green">Portal de alumno</span><h3>Planes, pagos y clases</h3><strong>{memberships.length} alumnos activos</strong><p>Los alumnos pueden consultar su estado y revisar actividades.</p></aside>
        </section>
        <section id="plans" className="feature-grid">
          <ListCard icon={<Dumbbell />} title="Planes disponibles" items={['MMA mensual · ₡35 000', 'Boxeo mensual · ₡28 000', 'BJJ mensual · ₡32 000']} />
          <ListCard icon={<CalendarDays />} title="Clases de la semana" items={['MMA · 6:00 PM', 'BJJ · 7:30 PM', 'Boxeo · 8:00 AM']} />
          <ListCard icon={<Wallet />} title="Cómo pagar por SINPE" items={['Realizá el pago mensual', 'Subí el comprobante desde tu cuenta', 'El equipo valida tu mensualidad']} />
        </section>
        <section id="events" className="feature-grid"><ListCard icon={<Ticket />} title="Eventos" items={events.map((e) => `${e.title} · ${e.date}`)} /><ListCard icon={<Package />} title="Productos destacados" items={products.map((p) => `${p.name} · ${money(p.price)}`)} /></section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="appointments">
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">Belleza y servicios por cita</span>
          <h1>{tenant.name}</h1>
          <p>Reservá tu espacio, revisá el depósito y seguí tus citas desde tu cuenta.</p>
          <p className="inline-muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="hero-actions"><a className="btn btn-primary" href="#services">Reservar cita</a><Link className="btn btn-secondary" href={`/client/${tenant.slug}`}>Entrar a mi cuenta</Link></div>
        </div>
        <aside className="tenant-status-card"><span className="badge badge-green">Reserva por cita</span><h3>Próximo espacio</h3><strong>Hoy · 4:00 PM</strong><p>El negocio confirma el espacio y el depósito de reserva.</p></aside>
      </section>
      <section id="services" className="catalog-grid">{services.map((service) => <article className="card service-card" key={service.id}><span className="badge badge-amber">{service.category}</span><h3>{service.name}</h3><p>{service.duration} min · depósito {money(service.deposit)}</p><strong>Desde {money(service.price)}</strong><Link className="btn btn-primary btn-sm" href={`/booking/${service.id}`}>Reservar</Link></article>)}</section>
      <section id="professionals" className="feature-grid"><Mini icon={<UserCheck />} title="Profesionales" text="Elegí especialista según disponibilidad y servicio." /><Mini icon={<Wallet />} title="Depósito de reserva" text="Algunos servicios requieren depósito para confirmar el espacio." /><Mini icon={<MapPin />} title="Ubicación y WhatsApp" text="Confirmá dirección, referencias y detalles antes de asistir." /></section>
    </PublicLayout>
  );
}

function InfoPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  return <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType={isMembership ? 'membership' : 'appointments'}><section className="public-tenant-hero"><div><span className="eyebrow">Sobre {tenant.name}</span><h1>{isMembership ? 'Entrenamiento, comunidad y progreso' : 'Servicios por cita con seguimiento claro'}</h1><p>{isMembership ? 'Planes, clases, eventos y pagos organizados desde la cuenta de alumno.' : 'Servicios, reserva, depósito y seguimiento desde la cuenta del cliente.'}</p><Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver</Link></div><div className="hero-panel"><Image /><span>{isMembership ? 'Planes, clases y eventos' : 'Servicios, profesionales y ubicación'}</span></div></section></PublicLayout>;
}

function ClientPortal() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug && slug !== 'demo' ? slug : 'atlas-fight-academy');
  const spec = resolveCustomerDashboard(tenant.vertical);
  const [section, setSection] = useState(spec.nav[0]?.id || 'inicio');
  return <CustomerDashboardRenderer tenant={tenant} activeSection={section} onSectionChange={setSection} />;
}

function AdminPage() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const [activeTab, setActiveTab] = useState(tenant.vertical === 'membership' ? 'Membresías' : 'Agenda');
  const isMembership = tenant.vertical === 'membership';
  const count = isMembership ? store.memberships.filter((item) => item.tenantSlug === tenant.slug).length : store.appointments.filter((item) => item.tenantSlug === tenant.slug).length;
  return <AdminLayout tenant={tenant} activeTab={activeTab} onTabChange={setActiveTab}><div className="kpi-grid"><Kpi icon={isMembership ? <Dumbbell /> : <CalendarDays />} label={isMembership ? 'Membresías' : 'Citas'} value={String(count)} /><Kpi icon={<Wallet />} label="Pagos pendientes" value="1" /><Kpi icon={<Users />} label={isMembership ? 'Alumnos' : 'Clientes'} value={String(count)} /><Kpi icon={<Sparkles />} label="Promociones" value="4" /></div><AdminWorkspace tenant={tenant} activeTab={activeTab} /></AdminLayout>;
}

function StaffPage() { const { slug } = useParams(); const { getTenant } = useAtlasStore(); const tenant = getTenant(slug); return <StaffPortal tenantSlug={tenant.slug} />; }

function SuperAdmin() {
  const { tenants, addTenant, resetDemo, dataSource } = useAtlasStore();
  const [name, setName] = useState(''); const [vertical, setVertical] = useState<'appointments' | 'membership'>('appointments'); const [plan, setPlan] = useState<'starter' | 'operations' | 'growth'>('operations');
  const modules = vertical === 'membership' ? ['Landing', 'Portal', 'Membresías', 'Pagos SINPE', 'Productos', 'Eventos'] : ['Landing', 'Portal', 'Agenda', 'Servicios', 'Profesionales', 'Depósitos'];
  return <SuperAdminLayout><section className="page-header"><div className="flex-between"><div><span className="eyebrow">Digital Atlas control center</span><h2>Superadmin</h2><p>Crea negocios, define tipo, plan y funciones activas.</p></div><span className="badge badge-violet">Data: {dataSource}</span></div></section><div className="dashboard-grid"><article className="card wide-card"><Building2 /><h3>Negocios activos</h3>{Object.values(tenants).map((tenant) => <div className="agenda-row" key={tenant.slug}><span>{tenant.vertical === 'membership' ? 'Membresía' : 'Citas'}</span><strong>{tenant.name}</strong><Link href={`/admin/${tenant.slug}`}>Abrir admin</Link></div>)}</article><article className="card"><PlusCircle /><h3>Crear negocio</h3><div className="stack-form"><input className="input" placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} /><select className="input" value={vertical} onChange={(event) => setVertical(event.target.value as 'appointments' | 'membership')}><option value="appointments">Negocio de citas</option><option value="membership">Gimnasio o academia</option></select><select className="input" value={plan} onChange={(event) => setPlan(event.target.value as 'starter' | 'operations' | 'growth')}><option value="starter">Starter</option><option value="operations">Operations</option><option value="growth">Growth</option></select><div className="module-row">{modules.map((module) => <span key={module}>{module}</span>)}</div><button className="btn btn-primary btn-full" onClick={() => { if (!name) return toast.error('Escribí un nombre'); const createdSlug = addTenant({ name, vertical, plan, description: 'Negocio creado desde Digital Atlas.' }); setName(''); toast.success(`Negocio creado: ${createdSlug}`); }}>Crear</button><button className="btn btn-secondary btn-full" onClick={resetDemo}>Restablecer ejemplo</button></div></article><ListCard icon={<BarChart3 />} title="Métricas SaaS" items={[`Negocios: ${Object.keys(tenants).length}`, 'Roles separados activos', 'Supabase conectado con respaldo local']} /><ListCard icon={<UserCheck />} title="Próximo salto" items={['Autenticación por negocio', 'Permisos avanzados', 'Escritura real completa']} /></div></SuperAdminLayout>;
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <article className="kpi-card">{icon}<span>{label}</span><strong>{value}</strong></article>; }

export default function AtlasApp() {
  return <Switch><Route path="/" component={Home} /><Route path="/client/login" component={ClientLogin} /><Route path="/client/demo" component={ClientPortal} /><Route path="/client/:slug" component={ClientPortal} /><Route path="/:slug/info" component={InfoPage} /><Route path="/booking/:id" component={() => <PublicLayout><BookingExperience /></PublicLayout>} /><Route path="/admin/:slug/login" component={AdminLogin} /><Route path="/admin/:slug" component={AdminPage} /><Route path="/staff/:slug" component={StaffPage} /><Route path="/super-admin/login" component={SuperAdminLogin} /><Route path="/super-admin" component={SuperAdmin} /><Route path="/:slug" component={PublicTenant} /></Switch>;
}
