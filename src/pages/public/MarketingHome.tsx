import { Link } from 'wouter';
import { CalendarDays, Dumbbell, MapPin, ShieldCheck, Sparkles, Users, Wallet } from 'lucide-react';
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

  return (
    <article className="trusted-business-card card">
      <div className="trusted-card-top">
        <span className={`badge ${isMembership ? 'badge-green' : 'badge-amber'}`}>{isMembership ? 'Gym / academia' : 'Servicios por cita'}</span>
        <span className="trusted-plan">{business.plan || 'operations'}</span>
      </div>
      <h3>{business.name}</h3>
      <p>{business.description}</p>
      <p className="inline-muted"><MapPin size={15} /> {business.address}</p>
      <div className="trusted-price-list">
        {(prices.length ? prices : products.map((item) => `${item.name} · ${money(item.price)}`)).map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="trusted-actions">
        <Link className="btn btn-primary btn-sm" href={`/${business.slug}`}>{isMembership ? 'Ver academia' : 'Ver negocio'}</Link>
        <Link className="btn btn-secondary btn-sm" href={isMembership ? `/${business.slug}#plans` : `/${business.slug}#services`}>{isMembership ? 'Ver planes' : 'Ver precios'}</Link>
      </div>
    </article>
  );
}

function TrustSection({ title, text, businesses }: { title: string; text: string; businesses: Business[] }) {
  return (
    <section className="trusted-section">
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

export function MarketingHome() {
  const { tenants } = useAtlasStore();
  const businesses = Object.values(tenants);
  const appointmentBusinesses = businesses.filter((business) => business.vertical !== 'membership');
  const membershipBusinesses = businesses.filter((business) => business.vertical === 'membership');

  return (
    <>
      <section className="public-hero marketing-hero">
        <div className="public-hero-copy">
          <span className="eyebrow">Digital Atlas para negocios de servicios</span>
          <h1>Tu negocio con página, reservas, pagos y clientes en un solo sistema</h1>
          <p>Atlas Agenda OS convierte estudios, clínicas, salones, gimnasios y academias en negocios digitales con landing pública, portal cliente, panel admin y operación por rol.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#trusted-businesses">Ver negocios conectados</a>
            <Link className="btn btn-secondary" href="/atlas/login">Entrar como Digital Atlas</Link>
          </div>
        </div>
        <aside className="hero-panel marketing-panel">
          <span className="badge badge-violet">Sistema multi-negocio</span>
          <h3>Un panel controla cada página pública</h3>
          <p>El negocio edita servicios, planes, productos, eventos, pagos SINPE y datos públicos desde su propio panel privado.</p>
        </aside>
      </section>

      <section id="features" className="feature-grid marketing-feature-grid">
        <article className="card feature-card"><CalendarDays /><h3>Para negocios de citas</h3><p>Servicios, precios, profesionales, agenda, depósito de reserva y seguimiento del cliente.</p></article>
        <article className="card feature-card"><Dumbbell /><h3>Para gimnasios y academias</h3><p>Planes, mensualidades, comprobantes SINPE, clases, eventos, productos y alumnos.</p></article>
        <article className="card feature-card"><Users /><h3>Portal cliente incluido</h3><p>Cada persona entra a su cuenta para ver citas, pagos, historial, beneficios y próximos pasos.</p></article>
      </section>

      <section className="operating-model card">
        <div>
          <span className="eyebrow">Estructura SaaS</span>
          <h2>Una página pública para vender. Un panel privado para operar.</h2>
          <p>Cada negocio tiene su propia página comercial y su propio panel admin. Lo que el admin configure alimenta lo que el cliente ve.</p>
        </div>
        <div className="operating-steps">
          <span><ShieldCheck size={18} /> Página pública del negocio</span>
          <span><Wallet size={18} /> Precios, pagos y depósitos</span>
          <span><Sparkles size={18} /> Portal cliente y fidelización</span>
        </div>
      </section>

      <div id="trusted-businesses" className="trusted-wrapper">
        <TrustSection
          title="Negocios formato citas que confían en Atlas"
          text="Estudios, salones, clínicas y servicios que necesitan reservas, precios claros, depósitos y seguimiento del cliente."
          businesses={appointmentBusinesses}
        />
        <TrustSection
          title="Gimnasios y academias conectadas"
          text="Negocios con membresías, mensualidades, comprobantes SINPE, clases, eventos y productos."
          businesses={membershipBusinesses}
        />
      </div>
    </>
  );
}
