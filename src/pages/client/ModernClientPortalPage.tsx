import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { ShieldCheck, UserRound } from 'lucide-react';
import { CustomerDashboardRenderer } from '../../components/CustomerDashboardRenderer';
import { resolveCustomerDashboard } from '../../platform/customerExperience';
import { useAtlasStore } from '../../state/AtlasStore';

function hasAccess(slug: string) {
  return typeof window !== 'undefined' && window.localStorage.getItem(`atlas-gate:client:${slug}`) === 'ok';
}

export function ModernClientPortalPage() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const spec = resolveCustomerDashboard(tenant.vertical);
  const [section, setSection] = useState(spec.nav[0]?.id || 'inicio');

  if (!hasAccess(tenant.slug)) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="login-logo"><UserRound size={24} /></div>
          <span className="eyebrow">{tenant.vertical === 'membership' ? 'Cuenta de alumno' : 'Cuenta del cliente'}</span>
          <h1 className="login-title">Tu espacio privado</h1>
          <p className="login-sub">Consultá estado, pagos, próximas acciones y beneficios de {tenant.name}.</p>
          <div className="empty-state"><ShieldCheck /><strong>Información personal</strong><span>Solo se muestran los datos asociados a esta cuenta y negocio.</span></div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/app/${tenant.slug}/login`}>Ir al acceso</Link>
            <Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver</Link>
          </div>
        </section>
      </main>
    );
  }

  return <CustomerDashboardRenderer tenant={tenant} activeSection={section} onSectionChange={setSection} />;
}
