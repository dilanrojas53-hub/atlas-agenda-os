import { Link, useParams } from 'wouter';
import { Lock, ShieldCheck, UserRound } from 'lucide-react';

export function AdminLogin() {
  const { slug } = useParams();
  return (
    <main className="app-shell area-admin">
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Admin login</span>
          <h1>Entrar al panel</h1>
          <p>Acceso para el negocio. En producción se validará con Supabase Auth y acceso por tenant.</p>
        </div>
        <article className="card">
          <Lock />
          <h3>Admin del tenant</h3>
          <div className="stack-form">
            <input placeholder="Email del admin" />
            <input placeholder="Contraseña" type="password" />
            <Link className="btn primary full" href={`/admin/${slug || 'ink-beauty-studio'}`}>Entrar demo</Link>
          </div>
        </article>
      </section>
    </main>
  );
}

export function ClientLogin() {
  return (
    <main className="app-shell area-client">
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Cliente login</span>
          <h1>Mi espacio Atlas</h1>
          <p>Acceso del cliente para ver citas, membresías, comprobantes, productos, puntos y promociones.</p>
        </div>
        <article className="card">
          <UserRound />
          <h3>Entrar como cliente</h3>
          <div className="stack-form">
            <input placeholder="Teléfono o email" />
            <Link className="btn primary full" href="/client/demo">Entrar demo</Link>
          </div>
        </article>
      </section>
    </main>
  );
}

export function SuperAdminLogin() {
  return (
    <main className="app-shell area-super">
      <section className="business-hero split-hero">
        <div>
          <span className="eyebrow">Digital Atlas</span>
          <h1>Superadmin</h1>
          <p>Acceso interno para crear tenants, definir verticales, planes, módulos y configuración SaaS.</p>
        </div>
        <article className="card">
          <ShieldCheck />
          <h3>Control center</h3>
          <div className="stack-form">
            <input placeholder="Email Digital Atlas" />
            <input placeholder="Contraseña" type="password" />
            <Link className="btn primary full" href="/super-admin">Entrar demo</Link>
          </div>
        </article>
      </section>
    </main>
  );
}
