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
} from 'lucide-react';
import { business, services } from './data/demo';
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
        {!compact && <Link href={`/${business.slug}`}>Demo cliente</Link>}
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
          <p>{APP_TAGLINE}. Un SaaS para convertir cualquier estudio o clinica en una experiencia de reserva clara, vendible y medible.</p>
          <div className="actions">
            <Link href={`/${business.slug}`} className="btn primary">Ver experiencia cliente</Link>
            <Link href={`/admin/${business.slug}`} className="btn secondary">Ver panel operativo</Link>
          </div>
        </div>
        <aside className="hero-console">
          <span className="console-label">Sistema activo</span>
          <h3>Ink Beauty Studio</h3>
          <p>3 servicios destacados · 2 citas hoy · deposito configurado</p>
          <div className="mini-flow">
            <span>Servicio</span><ArrowRight size={14} /><span>Horario</span><ArrowRight size={14} /><span>Deposito</span><ArrowRight size={14} /><span>Confirmacion</span>
          </div>
        </aside>
      </section>

      <section className="section-head">
        <span className="eyebrow">Que estas viendo</span>
        <h2>El mismo motor SaaS, traducido de pedidos a citas</h2>
        <p>El objetivo no es una landing suelta. Es un sistema donde Digital Atlas crea negocios, cada negocio configura su marca y los clientes reservan servicios.</p>
      </section>

      <section className="grid three">
        <Feature icon={<CalendarDays />} title="Cliente" text="Ve servicios, precios desde, duracion, deposito y puede solicitar una cita." />
        <Feature icon={<LayoutDashboard />} title="Negocio" text="Gestiona agenda diaria, servicios, profesionales, clientes, promociones y landing." />
        <Feature icon={<ShieldCheck />} title="Digital Atlas" text="Crea tenants, controla planes, mide uso y replica el producto por vertical." />
      </section>
    </Shell>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <article className="card feature-card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function PublicBusiness() {
  const { slug } = useParams();
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Demo multi-tenant</span>
          <h1>{business.name}</h1>
          <p>{business.description}</p>
          <p className="muted"><MapPin size={16} /> {business.address}</p>
          <div className="actions">
            <a className="btn primary" href="#servicios">Reservar servicio</a>
            <Link href={`/${slug}/info`} className="btn secondary">Ver landing</Link>
          </div>
        </div>
        <div className="status-panel">
          <span className="pill success">Abierto hoy</span>
          <h3>Proximo espacio</h3>
          <strong>Hoy · 4:00 PM</strong>
          <p>Deposito desde {money(5000)} para confirmar la cita.</p>
        </div>
      </section>

      <section id="servicios" className="section-head">
        <span className="eyebrow">Catalogo inteligente</span>
        <h2>Servicios listos para reservar</h2>
        <p>Esto reemplaza el menu de restaurante: cada servicio tiene precio, duracion, deposito y reglas operativas.</p>
      </section>

      <div className="grid services">
        {services.map(service => <ServiceCard key={service.id} service={service} />)}
      </div>

      <section className="section-head">
        <span className="eyebrow">Como funciona</span>
        <h2>Reserva en 4 pasos</h2>
      </section>
      <div className="timeline-grid">
        {['Elige servicio', 'Selecciona horario', 'Deja datos y notas', 'Confirma deposito'].map((step, index) => (
          <article className="step-card" key={step}><strong>{index + 1}</strong><span>{step}</span></article>
        ))}
      </div>
    </Shell>
  );
}

function ServiceCard({ service }: { service: typeof services[number] }) {
  return (
    <article className="card service-card">
      <span className="pill">{service.category}</span>
      <h3>{service.name}</h3>
      <p>{service.duration} min · deposito {money(service.deposit)}</p>
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
  return (
    <Shell>
      <TopNav compact />
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Landing del negocio</span>
          <h1>Ink Beauty Studio</h1>
          <p>Una pagina publica configurable para vender confianza antes de pedir la cita.</p>
          <div className="actions"><Link href={`/${business.slug}`} className="btn secondary">Volver al catalogo</Link></div>
        </div>
        <div className="mock-gallery"><Image /><span>Hero + portafolio + mapa + horarios</span></div>
      </section>
      <div className="grid three">
        <Feature icon={<Image />} title="Portafolio" text="Fotos del estudio, trabajos realizados, certificaciones y ambiente." />
        <Feature icon={<MessageCircle />} title="CTA WhatsApp" text="Mensaje listo para consulta, valoracion o deposito." />
        <Feature icon={<Clock />} title="Horarios" text="Disponibilidad visible y editable desde el panel admin." />
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

function AdminDashboard() {
  return (
    <Shell>
      <TopNav compact />
      <section className="admin-hero">
        <span className="eyebrow">Panel operativo</span>
        <h1>Hoy en {business.name}</h1>
        <p>Vista para que el negocio entienda que debe hacer hoy, que citas tiene, que pagos faltan y que servicios vende mas.</p>
      </section>
      <div className="kpi-grid">
        <Kpi icon={<CalendarDays />} label="Citas hoy" value="2" />
        <Kpi icon={<Wallet />} label="Depositos pendientes" value="1" />
        <Kpi icon={<Users />} label="Clientes activos" value="18" />
        <Kpi icon={<Sparkles />} label="Upsells sugeridos" value="4" />
      </div>
      <AdminWorkspace />
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
        <p>Desde aqui se crean negocios, se asignan planes y se mide el uso de cada vertical.</p>
      </section>
      <div className="dashboard-grid">
        <article className="card"><Building2 /><h3>Negocios</h3><p>Ink Beauty Studio · Growth · activo</p><p>Proximo: clinica demo</p></article>
        <article className="card"><BarChart3 /><h3>Metricas</h3><p>Reservas solicitadas: 24</p><p>Conversion a deposito: 62%</p></article>
        <article className="card"><UserCheck /><h3>Planes</h3><p>Starter: landing + reservas</p><p>Operations: agenda + staff</p><p>Growth: IA + automatizaciones</p></article>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/:slug/info" component={BusinessInfo} />
      <Route path="/:slug" component={PublicBusiness} />
      <Route path="/booking/:id" component={BookingStatus} />
      <Route path="/admin/:slug" component={AdminDashboard} />
      <Route path="/super-admin" component={SuperAdmin} />
    </Switch>
  );
}
