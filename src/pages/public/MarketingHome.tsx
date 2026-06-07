import { Link } from 'wouter';
import { BarChart3, CalendarDays, Dumbbell, LayoutDashboard, MapPin, ShieldCheck, Sparkles, UserRoundCheck, Users, Wallet } from 'lucide-react';
import { useAtlasStore } from '../../state/AtlasStore';

const money = (value: number) => `₡${value.toLocaleString('es-CR')}`;

type Business = ReturnType<typeof useAtlasStore>['tenants'][string];

function BusinessCard({ business }: { business: Business }) {
  const store = useAtlasStore();
  const isMembership = business.vertical === 'membership';
  const services = store.services.filter((item) => item.tenantSlug === business.slug).slice(0, 3);
  const products = store.products.filter((item) => item.tenantSlug === business.slug).slice(0, 2);
  const memberships = store.memberships.filter((item) => item.tenantSlug === business.slug).slice(0, 3);
  const prices = isMembership
    ? memberships.map((item) => `${item.plan} · ${money(item.amount)}`)
    : services.map((item) => `${item.name} · desde ${money(item.price)}`);
  const meta = isMembership
    ? `${memberships.length} alumnos · ${products.length} productos`
    : `${services.length} servicios · ${store.appointments.filter((item) => item.tenantSlug === business.slug).length} citas`;

  return (
    <article className={`trusted-business-card card ${isMembership ? 'business-card-academy' : 'business-card-appointments'}`}>
      <div className="trusted-card-top">
        <span className={`badge ${isMembership ? 'badge-green' : 'badge-amber'}`}>{isMembership ? 'Gym / academia' : 'Servicios por cita'}</span>
        <span className="trusted-plan">{business.plan || 'operations'}</span>
      </div>
      <h3>{business.name}</h3>
      <p>{business.description}</p>
      <p className="inline-muted"><MapPin size={15} /> {business.address}</p>
      <div className="business-live-meta">
        <span>{meta}</span>
        <span>{isMembership ? 'Portal alumno' : 'Reserva online'}</span>
      </div>
      <div className="trusted-price-list">
        {(prices.length ? prices : products.map((item) => `${item.name} · ${money(item.price)}`)).map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="trusted-actions">
        <Link className="btn btn-primary btn-sm" href={`/${business.slug}`}>{isMembership ? 'Ver academia' : 'Ver negocio'}</Link>
        <Link className="btn btn-secondary btn-sm" href={isMembership ? `/join/${business.slug}` : `/${business.slug}#services`}>{isMembership ? 'Solicitar registro' : 'Ver precios'}</Link>
      </div>
    </article>
  );
}

function TrustSection({ title, text, businesses, kind }: { title: string; text: string; businesses: Business[]; kind: 'appointments' | 'membership' }) {
  return (
    <section className={`trusted-section trusted-section-${kind}`}>
      <div className="trusted-section-head">
        <div>
          <span className="eyebrow">Negocios conectados</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <span className="trusted-count">{businesses.length} activos</span>
      </div>
      <div className="trusted-grid">
        {businesses.map((business) => <BusinessCard key={business.slug} business={business} />)}
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="marketing-metric"><strong>{value}</strong><span>{label}</span></div>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="market-step card">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function MarketingHome() {
  const { tenants, services, appointments, memberships, products, events } = useAtlasStore();
  const businesses = Object.values(tenants);
  const appointmentBusinesses = businesses.filter((business) => business.vertical !== 'membership');
  const membershipBusinesses = businesses.filter((business) => business.vertical === 'membership');

  return (
    <>
      <section className="public-hero marketing-hero marketplace-hero">
        <div className="public-hero-copy">
          <span className="eyebrow">Digital Atlas para negocios de servicios</span>
          <h1>Landing, reservas, pagos y clientes con estética de app premium</h1>
          <p>Atlas Agenda OS convierte estudios, clínicas, salones, gimnasios y academias en negocios digitales con página pública, portal cliente, panel admin y operación por rol.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#trusted-businesses">Ver negocios conectados</a>
            <a className="btn btn-secondary" href="#operating-model">Cómo funciona</a>
          </div>
          <div className="marketing-metrics-row">
            <Metric value={String(businesses.length)} label="negocios ejemplo" />
            <Metric value={String(services.length + memberships.length)} label="servicios y planes" />
            <Metric value={String(appointments.length + events.length)} label="citas y eventos" />
          </div>
        </div>
        <aside className="hero-panel marketing-panel ios-preview-panel">
          <span className="badge badge-violet">Sistema por negocio</span>
          <h3>Un panel controla cada página pública</h3>
          <p>El negocio edita servicios, planes, productos, eventos, pagos SINPE y datos públicos desde su propio panel privado.</p>
          <div className="ios-stack-preview">
            <span><LayoutDashboard size={16} /> Panel privado</span>
            <span><Sparkles size={16} /> Página pública</span>
            <span><UserRoundCheck size={16} /> Portal cliente</span>
          </div>
        </aside>
      </section>

      <section id="features" className="feature-grid marketing-feature-grid">
        <article className="card feature-card"><CalendarDays /><h3>Para negocios de citas</h3><p>Servicios, precios, profesionales, agenda, depósito de reserva y seguimiento del cliente.</p></article>
        <article className="card feature-card"><Dumbbell /><h3>Para gimnasios y academias</h3><p>Planes, mensualidades, comprobantes SINPE, clases, eventos, productos y alumnos.</p></article>
        <article className="card feature-card"><Users /><h3>Portal cliente incluido</h3><p>Cada persona entra a su cuenta para ver citas, pagos, historial, beneficios y próximos pasos.</p></article>
      </section>

      <section id="operating-model" className="operating-model card">
        <div>
          <span className="eyebrow">Estructura SaaS</span>
          <h2>Una página pública para vender. Un panel privado para operar.</h2>
          <p>Cada negocio tiene su propia página comercial y su propio panel admin. Lo que el admin configure alimenta lo que el cliente ve.</p>
        </div>
        <div className="operating-steps">
          <span><ShieldCheck size={18} /> Página pública del negocio</span>
          <span><Wallet size={18} /> Precios, pagos y depósitos</span>
          <span><BarChart3 size={18} /> Panel, métricas y solicitudes</span>
          <span><Sparkles size={18} /> Portal cliente y fidelización</span>
        </div>
      </section>

      <section className="market-steps-section">
        <div className="trusted-section-head">
          <div>
            <span className="eyebrow">Como SmartMenu, pero para servicios</span>
            <h2>El recorrido completo del cliente queda conectado</h2>
            <p>La landing muestra negocios conectados. Cada negocio tiene su página. Cada página lleva a reserva, registro o cuenta. El admin opera todo desde su propio espacio.</p>
          </div>
        </div>
        <div className="market-steps-grid">
          <Step number="01" title="El visitante descubre" text="Entra a Digital Atlas, baja y ve negocios por tipo: citas, clínicas, gimnasios o academias." />
          <Step number="02" title="Elige un negocio" text="Abre la página pública con precios, servicios, planes, eventos y llamadas a la acción claras." />
          <Step number="03" title="Reserva o se registra" text="El cliente crea solicitud, reserva cita o entra a su cuenta sin mezclarse con el admin." />
          <Step number="04" title="El negocio opera" text="El panel privado recibe solicitudes, actualiza servicios y alimenta la página pública." />
        </div>
      </section>

      <div id="trusted-businesses" className="trusted-wrapper">
        <TrustSection
          kind="appointments"
          title="Negocios formato citas que confían en Atlas"
          text="Estudios, salones, clínicas y servicios que necesitan reservas, precios claros, depósitos y seguimiento del cliente."
          businesses={appointmentBusinesses}
        />
        <TrustSection
          kind="membership"
          title="Gimnasios y academias conectadas"
          text="Negocios con membresías, mensualidades, comprobantes SINPE, clases, eventos, productos y comunidad."
          businesses={membershipBusinesses}
        />
      </div>

      <section className="final-market-cta card">
        <span className="eyebrow">Digital Atlas OS</span>
        <h2>Tu SaaS para vender páginas, portales y operación privada por negocio</h2>
        <p>El valor no es solo agendar. Es convertir cada negocio en una experiencia digital separada, clara y administrable.</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#trusted-businesses">Explorar negocios</a>
          <Link className="btn btn-secondary" href="/atlas/login">Entrar a Digital Atlas</Link>
        </div>
      </section>
    </>
  );
}
