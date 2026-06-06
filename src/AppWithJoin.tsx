import { Link, Route, Switch, useParams } from 'wouter';
import { toast } from 'sonner';
import AtlasApp from './AtlasApp';
import { PublicLayout } from './layouts/PublicLayout';
import { useAtlasStore } from './state/AtlasStore';

const plans = [
  { name: 'MMA mensual', amount: 35000 },
  { name: 'Boxeo mensual', amount: 28000 },
  { name: 'BJJ mensual', amount: 32000 },
];

function money(value: number) {
  return `₡${value.toLocaleString('es-CR')}`;
}

function JoinPage() {
  const { slug } = useParams();
  const { getTenant, addMembershipRequest } = useAtlasStore();
  const tenant = getTenant(slug);
  const createRequest = (plan: typeof plans[number]) => {
    addMembershipRequest({
      tenantSlug: tenant.slug,
      client: 'Alumno demo',
      phone: 'Pendiente',
      plan: plan.name,
      amount: plan.amount,
      notes: 'Solicitud creada desde la página pública',
    });
    toast.success('Solicitud enviada al panel del negocio');
  };

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">Registro de alumno</span>
          <h1>Unite a {tenant.name}</h1>
          <p>Elegí un plan y enviá una solicitud. El negocio podrá verla en su panel privado, dentro de Solicitudes.</p>
          <div className="hero-actions">
            <Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver al negocio</Link>
            <Link className="btn btn-secondary" href={`/app/${tenant.slug}/login`}>Entrar a mi cuenta</Link>
          </div>
        </div>
        <aside className="tenant-status-card">
          <span className="badge badge-green">Solicitud</span>
          <h3>Se conecta al admin</h3>
          <p>Las solicitudes aparecen en el panel del negocio.</p>
        </aside>
      </section>
      <section className="feature-grid">
        {plans.map(plan => (
          <article className="card" key={plan.name}>
            <span className="badge badge-green">Plan</span>
            <h3>{plan.name}</h3>
            <p>Mensualidad: {money(plan.amount)}</p>
            <button className="btn btn-primary btn-full" onClick={() => createRequest(plan)}>Solicitar registro</button>
          </article>
        ))}
      </section>
    </PublicLayout>
  );
}

export default function AppWithJoin() {
  return (
    <Switch>
      <Route path="/join/:slug" component={JoinPage} />
      <Route component={AtlasApp} />
    </Switch>
  );
}
