import type { ReactNode } from 'react';
import { Route, Switch, Link, useParams } from 'wouter';
import {
  CalendarDays,
  LayoutDashboard,
  Sparkles,
  Users,
  ShieldCheck,
  Clock,
  Wallet,
  MessageCircle,
  MapPin,
  ArrowRight,
  Building2,
  BarChart3,
  Image,
  UserCheck,
  Dumbbell,
  Ticket,
  Package,
  Upload,
} from 'lucide-react';
import { business, services, getTenant, memberships, products, events } from './data/demo';
import { APP_NAME, APP_TAGLINE } from './domain/core';
import { BookingExperience } from './components/BookingExperience';
import { AdminWorkspace } from './components/AdminWorkspace';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

function Shell({ children }: { children: ReactNode }) {
  return <main className="app-shell">{children}</main>;
}

function TopNav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className="topbar">
      <Link href="/" className="brand-link">Atlas Agenda OS</Link>
      <div className="nav-actions">
        {!compact && <Link href={`/${business.slug}`}>Demo citas</Link>}
        {!compact && <Link href="/atlas-fight-academy">Demo gym</Link>}
        <Link href="/client/demo">Cliente</Link>
        <Link href={`/admin/${business.slug}`}>Admin</Link>
        <Link href="/super-admin">Digital Atlas</Link>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <Shell>
      <TopNav />
      <section className="hero home-hero">
        <div>
          <span className="eyebrow">Digital Atlas product lab</span>
          <h1>{APP_NAME}</h1>
          <p>{APP_TAGLINE}. No es solo agenda: es un sistema multi-tenant con perfiles de cliente, pagos, productos, eventos, promociones y módulos por vertical.</p>
          <div className="actions">
            <Link href="/ink-beauty-studio" className="btn primary">Tenant de citas</Link>
            <Link href="/atlas-fight-academy" className="btn secondary">Tenant de membresías</Link>
          </div>
        </div>
        <aside className="hero-console">
          <span className="console-label">Motor reutilizable de SmartMenu</span>
          <h3>Tenant → Vertical → Módulos</h3>
          <p>El slug decide qué experiencia se muestra: reserva, membresía, productos, eventos o portal de cliente.</p>
          <div className="mini-flow">
            <span>Tenant</span><ArrowRight size={14} /><span>Cliente</span><ArrowRight size={14} /><span>Pago</span><ArrowRight size={14} /><span>Tracking</span>
          </div>
        </aside>
      </section>

      <section className="section-head">
        <span className="eyebrow">Arquitectura</span>
        <h2>Un sistema operativo por tipo de negocio</h2>
        <p>SmartMenu ya tenía catálogo, carrito, clientes, promos, loyalty, pagos y panel. Agenda OS reutiliza ese patrón, pero cada tenant activa módulos distintos.</p>
      </section>

      <section className="grid three">
        <Feature icon={<CalendarDays />} title="Citas" text="Clínicas, tattoo, piercing, belleza, spa y consultorios con agenda y depósitos." />
        <Feature icon={<Dumbbell />} title="Membresías" text="Gyms y academias con mensualidades, comprobantes SINPE, eventos y productos." />
        <Feature icon={<Users />} title="Perfil cliente" text="Cada cliente conserva citas, pagos, historial, promociones, puntos y documentos." />
      </section>
    </Shell>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function PublicBusiness() {
  const { slug } = useParams();
  const tenant = getTenant(slug);
  return tenant.vertical === 'membership' ? <MembershipTenant tenant={tenant} /> : <AppointmentTenant tenant={tenant} />;
}

function AppointmentTenant({ tenant }: { tenant: ReturnType<typeof getTenant> }) {
  const tenantServices = services.filter(service => service.tenantSlug === tenant.slug);
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">{tenant.label}</span>
          <h1>{tenant.name}</h1>
          <p>{tenant.description}</p>
          <p className="muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="module-row">{tenant.modules.map(module => <span key={module}>{module}</span>)}</div>
          <div className="actions">
            <a className="btn primary" href="#servicios">Reservar servicio</a>
            <Link href={`/${tenant.slug}/info`} className="btn secondary">Ver landing</Link>
          </div>
        </div>
        <div className="status-panel">
          <span className="pill success">Agenda abierta</span>
          <h3>Próximo espacio</h3>
          <strong>Hoy · 4:00 PM</strong>
          <p>Depósito desde {money(5000)} para confirmar la cita.</p>
        </div>
      </section>

      <section id="servicios" className="section-head">
        <span className="eyebrow">Catálogo por cita</span>
        <h2>Servicios reservables</h2>
        <p>Este tenant usa lógica de agenda: duración, profesional, depósito, recordatorios, historial y seguimiento post-cita.</p>
      </section>

      <div className="grid services">
        {tenantServices.map(service => <ServiceCard key={service.id} service={service} />)}
      </div>
    </Shell>
  );
}

function MembershipTenant({ tenant }: { tenant: ReturnType<typeof getTenant> }) {
  const tenantMemberships = memberships.filter(item => item.tenantSlug === tenant.slug);
  const tenantProducts = products.filter(item => item.tenantSlug === tenant.slug);
  const tenantEvents = events.filter(item => item.tenantSlug === tenant.slug);
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">{tenant.label}</span>
          <h1>{tenant.name}</h1>
          <p>{tenant.description}</p>
          <p className="muted"><MapPin size={16} /> {tenant.address}</p>
          <div className="module-row">{tenant.modules.map(module => <span key={module}>{module}</span>)}</div>
          <div className="actions">
            <Link href="/client/demo" className="btn primary">Ver portal cliente</Link>
            <Link href={`/admin/${tenant.slug}`} className="btn secondary">Panel academia</Link>
          </div>
        </div>
        <div className="status-panel">
          <span className="pill success">Membresías activas</span>
          <h3>Tracking mensual</h3>
          <strong>{tenantMemberships.length} clientes demo</strong>
          <p>El cliente sube comprobante SINPE y el negocio aprueba el mes.</p>
        </div>
      </section>

      <section className="section-head">
        <span className="eyebrow">Membresías y pagos</span>
        <h2>Control de mensualidades</h2>
      </section>
      <div className="dashboard-grid">
        <article className="card wide-card"><Wallet /><h3>Comprobantes SINPE</h3>{tenantMemberships.map(item => <div className="agenda-row" key={item.id}><span>{item.client}</span><strong>{item.plan}</strong><em>{item.status}</em></div>)}</article>
        <article className="card"><Package /><h3>Productos</h3>{tenantProducts.map(item => <p key={item.name}>{item.name} · {money(item.price)}</p>)}</article>
        <article className="card"><Ticket /><h3>Eventos</h3>{tenantEvents.map(item => <p key={item.title}>{item.title} · {item.date}</p>)}</article>
      </div>
    </Shell>
  );
}

function ServiceCard({ service }: { service: typeof services[number] }) {
  return (
    <article className="card service-card">
      <span className="pill">{service.category}</span>
      <h3>{service.name}</h3>
      <p>{service.duration} min · depósito {money(service.deposit)}</p>
      <strong>Desde {money(service.price)}</strong>
      <div className="service-meta">
        <span><Clock size={14} /> Agenda</span>
        <span><Wallet size={14} /> SINPE</span>
      </div>
      <Link href={`/booking/${service.id}`} className="btn primary small">Reservar ahora</Link>
    </article>
  );
}

function BusinessInfo() {
  const { slug } = useParams();
  const tenant = getTenant(slug);
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Landing del tenant</span>
          <h1>{tenant.name}</h1>
          <p>Una página pública configurable según el tipo de negocio: portafolio para tattoo, profesionales para clínica, eventos para academia o productos para gym.</p>
          <div className="actions"><Link href={`/${tenant.slug}`} className="btn secondary">Volver al tenant</Link></div>
        </div>
        <div className="mock-gallery"><Image /><span>Hero + módulos dinámicos + CTA principal</span></div>
      </section>
      <div className="grid three">
        <Feature icon={<Image />} title="Contenido" text="Fotos, portafolio, clases, certificaciones, tratamientos o instalaciones." />
        <Feature icon={<MessageCircle />} title="Acción principal" text="Agendar, pagar mensualidad, subir comprobante, comprar producto o registrarse a evento." />
        <Feature icon={<Clock />} title="Operación" text="Disponibilidad, vencimientos, recordatorios y automatizaciones por tenant." />
      </div>
    </Shell>
  );
}

function BookingStatus() {
  return (
    <Shell>
      <TopNav compact />
      <BookingExperience />
    </Shell>
  );
}

function ClientPortal() {
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Perfil personal del cliente</span>
          <h1>Mi espacio Atlas</h1>
          <p>Un cliente no solo agenda. Guarda sus citas, pagos, productos, puntos, promociones y comprobantes por cada negocio donde compra.</p>
        </div>
        <div className="status-panel">
          <span className="pill success">Cuenta cliente</span>
          <h3>Maria Lopez</h3>
          <p>2 negocios conectados · 240 puntos · 1 pago pendiente</p>
        </div>
      </section>
      <div className="dashboard-grid">
        <article className="card"><CalendarDays /><h3>Mis citas</h3><p>Ink Beauty Studio · Piercing nariz · Confirmada</p><p>Flash day tattoo · Próximamente</p></article>
        <article className="card"><Upload /><h3>Mis pagos</h3><p>Subir comprobante SINPE de mensualidad.</p><p>Ver depósitos y compras anteriores.</p></article>
        <article className="card"><Sparkles /><h3>Promos y puntos</h3><p>240 puntos disponibles.</p><p>Promo aftercare activa.</p></article>
      </div>
    </Shell>
  );
}

function AdminDashboard() {
  const { slug } = useParams();
  const tenant = getTenant(slug);
  const isMembership = tenant.vertical === 'membership';
  return (
    <Shell>
      <TopNav compact />
      <section className="admin-hero">
        <span className="eyebrow">Panel operativo · {tenant.label}</span>
        <h1>{tenant.name}</h1>
        <p>{isMembership ? 'Vista para mensualidades, comprobantes, productos, eventos y clientes.' : 'Vista para agenda diaria, servicios, profesionales, depósitos y clientes.'}</p>
      </section>
      <div className="kpi-grid">
        <Kpi icon={isMembership ? <Dumbbell /> : <CalendarDays />} label={isMembership ? 'Membresías' : 'Citas hoy'} value={isMembership ? '3' : '2'} />
        <Kpi icon={<Wallet />} label={isMembership ? 'Comprobantes pendientes' : 'Depósitos pendientes'} value="1" />
        <Kpi icon={<Users />} label="Clientes activos" value={isMembership ? '42' : '18'} />
        <Kpi icon={<Sparkles />} label="Promos activas" value="4" />
      </div>
      <AdminWorkspace tenant={tenant} />
    </Shell>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="kpi-card">{icon}<span>{label}</span><strong>{value}</strong></article>;
}

function SuperAdmin() {
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero">
        <span className="eyebrow">Digital Atlas control center</span>
        <h1>Superadmin</h1>
        <p>Desde aquí se crean tenants, se asignan verticales, se activan módulos y se mide el uso de cada sistema.</p>
      </section>
      <div className="dashboard-grid">
        <article className="card"><Building2 /><h3>Tenants</h3><p>Ink Beauty Studio · appointments · activo</p><p>Atlas Fight Academy · membership · activo</p></article>
        <article className="card"><BarChart3 /><h3>Métricas</h3><p>Reservas solicitadas: 24</p><p>Comprobantes recibidos: 18</p></article>
        <article className="card"><UserCheck /><h3>Planes</h3><p>Starter: landing + portal cliente</p><p>Operations: módulo operativo</p><p>Growth: IA + automatizaciones</p></article>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/client/demo" component={ClientPortal} />
      <Route path="/:slug/info" component={BusinessInfo} />
      <Route path="/:slug" component={PublicBusiness} />
      <Route path="/booking/:id" component={BookingStatus} />
      <Route path="/admin/:slug" component={AdminDashboard} />
      <Route path="/super-admin" component={SuperAdmin} />
    </Switch>
  );
}
