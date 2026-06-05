import { Link, Route, Switch, useParams } from 'wouter';
import { Dumbbell, Wallet } from 'lucide-react';
import AtlasApp from './AtlasApp';
import { PublicLayout } from './layouts/PublicLayout';
import { useAtlasStore } from './state/AtlasStore';

function JoinPage() {
  const { slug } = useParams();
  const { getTenant } = useAtlasStore();
  const tenant = getTenant(slug);

  return (
    <PublicLayout slug={tenant.slug} businessName={tenant.name} businessType="membership">
      <section className="public-tenant-hero">
        <div>
          <span className="eyebrow">Registro de alumno</span>
          <h1>Unite a {tenant.name}</h1>
          <p>Elegí un plan, revisá el precio y entrá al portal para completar el seguimiento de inscripción y pagos.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={`/app/${tenant