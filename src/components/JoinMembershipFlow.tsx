import { Link, useParams } from 'wouter';
import { PublicLayout } from '../layouts/PublicLayout';
import { useAtlasStore } from '../state/AtlasStore';

export function JoinMembershipFlow() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant-hero">
        <div>
          <p className="eyebrow">Registro de alumno</p>
          <h1>Unite a {tenant.name}</h1>
          <p>Elegí un plan, enviá tus datos y el equipo del negocio podrá darle seguimiento desde su panel privado.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/app/${tenant.slug}/login`}>Entr