import { Link, useParams } from 'wouter';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useAtlasStore } from '../../state/AtlasStore';

export function JoinMembershipPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">Registro</span>
          <h1>Unite a {tenant.name}</h1>
          <p>Este flujo conectará planes, datos del alumno y revisión desde el panel privado.</p>
          <div class