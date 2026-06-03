import { Route, Switch, Link, useParams } from 'wouter';
import { CalendarDays, LayoutDashboard, Sparkles, Users, Scissors, ShieldCheck } from 'lucide-react';
import { business, services, appointments } from './data/demo';
import { APP_NAME, APP_TAGLINE } from './domain/core';

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="app-shell">{children}</main>;
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <span className="eyebrow">Digital Atlas</span>
        <h1>{APP_NAME}</h1>
        <p>{APP_TAGLINE}</p>
        <div className="actions">
          <Link href={`/${business.slug}`} className="btn primary">Ver demo publica</Link>
          <Link href={`/admin/${business.slug}`} className="btn secondary">Panel admin</Link>
        </div>
      </section>
      <section className="grid three">
        <Feature icon={<CalendarDays />} title="Booking" text="Clientes eligen servicio, fecha, hora y deposito." />
        <Feature icon={<Users />} title="Profesionales" text="Agenda por artista, especialista, cabina o sala." />
        <Feature icon={<Sparkles />} title="Growth" text="Upsells, recordatorios, loyalty e insights con IA." />
      </section>
    </Shell>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="card">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function PublicBusiness() {
  const { slug } = useParams();
  return (
    <Shell>
      <nav className="topbar"><Link href="/">Atlas Agenda OS</Link><Link href={`/${slug}/info`}>Info</Link></nav>
      <section className="business-hero">
        <span className="eyebrow">Demo multi-tenant</span>
        <h1>{business.name}</h1>
        <p>{business.description}</p>
        <p className="muted">{business.address}</p>
      </section>
      <section className="section-head"><h2>Servicios</h2><p>Catalogo reutilizado del concepto SmartMenu, adaptado a citas.</p></section>
      <div className="grid services">
        {services.map(service => <ServiceCard key={service.id} service={service} />)}
      </div>
    </Shell>
  );
}

function ServiceCard({ service }: { service: typeof services[number] }) {
  return (
    <article className="card service-card">
      <span className="pill">{service.category}</span>
      <h3>{service.name}</h3>
      <p>{service.duration} min · deposito ₡{service.deposit.toLocaleString('es-CR')}</p>
      <strong>Desde ₡{service.price.toLocaleString('es-CR')}</strong>
      <Link href={`/booking/${service.id}`} className="btn primary small">Reservar</Link>
    </article>
  );
}

function BusinessInfo() {
  return (
    <Shell>
      <nav className="topbar"><Link href={`/${business.slug}`}>Volver</Link></nav>
      <section className="business-hero"><h1>Landing configurable</h1><p>Hero, galeria, portafolio, horarios, mapa, WhatsApp y CTA para agendar.</p></section>
    </Shell>
  );
}

function BookingStatus() {
  return (
    <Shell>
      <section className="business-hero">
        <span className="eyebrow">Booking flow</span>
        <h1>Solicitud de cita</h1>
        <p>Prototipo de flujo: servicio, fecha, hora, profesional, datos del cliente y deposito.</p>
        <Link href={`/${business.slug}`} className="btn secondary">Volver al catalogo</Link>
      </section>
    </Shell>
  );
}

function AdminDashboard() {
  return (
    <Shell>
      <nav className="topbar"><Link href="/">Atlas</Link><Link href="/super-admin">Superadmin</Link></nav>
      <section className="section-head"><h1>Panel admin</h1><p>Agenda diaria, citas, servicios, profesionales, clientes, promos y landing.</p></section>
      <div className="grid two">
        <article className="card"><LayoutDashboard /><h3>Citas de hoy</h3>{appointments.map(a => <p key={a.id}>{a.time} · {a.service} · {a.status}</p>)}</article>
        <article className="card"><Scissors /><h3>Servicios</h3>{services.map(s => <p key={s.id}>{s.name} · ₡{s.price.toLocaleString('es-CR')}</p>)}</article>
      </div>
    </Shell>
  );
}

function SuperAdmin() {
  return (
    <Shell>
      <section className="business-hero"><ShieldCheck /><h1>Superadmin Digital Atlas</h1><p>Crear negocios, activar planes, ver metricas y gestionar tenants.</p></section>
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
