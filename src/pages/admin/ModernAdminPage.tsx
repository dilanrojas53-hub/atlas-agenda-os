import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { Building2, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminWorkspace } from '../../components/AdminWorkspace';
import { useAtlasStore } from '../../state/AtlasStore';

function hasAccess(slug: string) {
  return typeof window !== 'undefined' && window.localStorage.getItem(`atlas-gate:admin:${slug}`) === 'ok';
}

export function ModernAdminPage() {
  const { slug } = useParams();
  const store = useAtlasStore();
  const tenant = store.getTenant(slug);
  const [activeTab, setActiveTab] = useState('Dashboard');

  if (!hasAccess(tenant.slug)) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="login-logo"><Building2 size={24} /></div>
          <span className="eyebrow">Panel privado</span>
          <h1 className="login-title">Acceso administrativo</h1>
          <p className="login-sub">Ingresá desde la puerta segura de {tenant.name}.</p>
          <div className="empty-state"><ShieldCheck /><strong>Zona protegida</strong><span>La operación permanece separada de la página pública.</span></div>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/admin/${tenant.slug}/login`}>Ir al acceso</Link>
            <Link className="btn btn-secondary" href={`/${tenant.slug}`}>Volver</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <AdminLayout tenant={tenant} activeTab={activeTab} onTabChange={setActiveTab}>
      <AdminWorkspace tenant={tenant} activeTab={activeTab} />
    </AdminLayout>
  );
}
